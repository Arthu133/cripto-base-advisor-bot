
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Verify payment function started");
    
    const { sessionId } = await req.json();
    console.log("Session ID received:", sessionId);
    
    if (!sessionId) {
      console.error("No session ID provided");
      return new Response(JSON.stringify({ success: false, error: "No session ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    console.log("Retrieving Stripe session...");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Session retrieved:", session.payment_status);
    
    if (session.payment_status === "paid") {
      console.log("Payment confirmed, processing data...");
      
      const formData = JSON.parse(session.metadata?.form_data || "{}");
      const planType = session.metadata?.plan_type || "three_day_access";
      
      console.log("Form data:", formData);
      console.log("Plan type:", planType);
      
      // Calcular data de expiração
      let endDate: Date;
      if (planType === "monthly_subscription") {
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
      }

      console.log("Saving subscription data...");
      
      // Salvar apenas a assinatura no banco (consultoria já foi salva)
      const subscriptionData = {
        user_email: formData.email,
        user_name: formData.fullName,
        phone_number: formData.phoneNumber,
        plan_type: planType,
        stripe_session_id: sessionId,
        stripe_subscription_id: session.subscription || null,
        amount: session.amount_total || 0,
        status: 'active',
        end_date: endDate.toISOString(),
      };

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (subscriptionError) {
        console.error("Erro ao salvar assinatura:", subscriptionError);
      } else {
        console.log("Subscription saved successfully");
      }

      console.log("Payment verification completed successfully");

      return new Response(JSON.stringify({ 
        success: true, 
        formData,
        planType,
        endDate: endDate.toISOString(),
        consultationId: formData.consultationId // Usar o ID que já foi salvo
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    console.log("Payment not confirmed, status:", session.payment_status);
    return new Response(JSON.stringify({ success: false, reason: "Payment not confirmed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na verificação:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      details: "Erro interno na verificação do pagamento"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
