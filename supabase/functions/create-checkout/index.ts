
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
    const { paymentType, formData } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    
    // Configurar o produto baseado no tipo de pagamento
    let lineItems;
    let mode: "payment" | "subscription";
    let planType: string;
    let amount: number;
    
    if (paymentType === "monthly_subscription") {
      mode = "subscription";
      planType = "monthly_subscription";
      amount = 1790; // R$ 17,90 em centavos
      lineItems = [{
        price_data: {
          currency: "brl",
          product_data: {
            name: "Consultoria GuiaCripto - Assinatura Mensal",
            description: "Acesso completo à consultoria personalizada por Arthur Dias com renovação automática",
          },
          unit_amount: amount,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      }];
    } else {
      mode = "payment";
      planType = "three_day_access";
      amount = 890; // R$ 8,90 em centavos
      lineItems = [{
        price_data: {
          currency: "brl",
          product_data: {
            name: "Consultoria GuiaCripto - Acesso 3 Dias",
            description: "Acesso completo à consultoria personalizada por Arthur Dias durante 3 dias",
          },
          unit_amount: amount,
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: formData.email || undefined,
      line_items: lineItems,
      mode,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&form_data=${encodeURIComponent(JSON.stringify(formData))}&plan_type=${planType}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        form_data: JSON.stringify(formData),
        payment_type: paymentType,
        plan_type: planType,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro no checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
