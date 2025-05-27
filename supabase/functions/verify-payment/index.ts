
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
    const { sessionId } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === "paid") {
      const formData = JSON.parse(session.metadata?.form_data || "{}");
      const planType = session.metadata?.plan_type || "three_day_access";
      
      // Calcular data de expiração
      let endDate: Date;
      if (planType === "monthly_subscription") {
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
      }

      // Salvar assinatura no banco
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

      const { error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (error) {
        console.error("Erro ao salvar assinatura:", error);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        formData,
        planType,
        endDate: endDate.toISOString()
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na verificação:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
