
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Create checkout function started");
    
    const { paymentType, formData } = await req.json();
    console.log("Payment type:", paymentType);
    console.log("Form data received:", formData);
    
    if (!paymentType || !formData) {
      console.error("Missing required data");
      return new Response(JSON.stringify({ error: "Missing payment type or form data" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Definir preços e configurações baseado no tipo de pagamento
    let priceData;
    let mode: "payment" | "subscription" = "payment";
    
    if (paymentType === "monthly_subscription") {
      mode = "subscription";
      priceData = {
        currency: "brl",
        product_data: {
          name: "Consultoria Mensal - Arthur Dias",
          description: "Acesso completo à consultoria personalizada de criptomoedas",
        },
        unit_amount: 1790, // R$ 17,90
        recurring: {
          interval: "month",
        },
      };
    } else if (paymentType === "three_day_access") {
      priceData = {
        currency: "brl",
        product_data: {
          name: "Acesso de 3 Dias - Arthur Dias",
          description: "Acesso de 3 dias à consultoria personalizada de criptomoedas",
        },
        unit_amount: 890, // R$ 8,90
      };
    } else {
      console.error("Invalid payment type:", paymentType);
      return new Response(JSON.stringify({ error: "Invalid payment type" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Creating Stripe session with:", { mode, priceData });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/payment-selection`,
      customer_email: formData.email,
      metadata: {
        form_data: JSON.stringify(formData),
        plan_type: paymentType,
      },
    });

    console.log("Stripe session created successfully:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro na criação do checkout:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Erro interno na criação do checkout"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
