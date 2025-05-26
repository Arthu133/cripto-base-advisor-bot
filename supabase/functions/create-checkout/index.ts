
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
    
    if (paymentType === "monthly") {
      mode = "payment";
      lineItems = [{
        price_data: {
          currency: "brl",
          product_data: {
            name: "Consultoria GuiaCripto - 1 Mês",
            description: "Acesso completo à consultoria personalizada por Arthur Dias durante 1 mês",
          },
          unit_amount: 1790, // R$ 17,90 em centavos
        },
        quantity: 1,
      }];
    } else {
      mode = "subscription";
      lineItems = [{
        price_data: {
          currency: "brl",
          product_data: {
            name: "Consultoria GuiaCripto - Assinatura Mensal",
            description: "Acesso completo à consultoria personalizada por Arthur Dias com renovação automática",
          },
          unit_amount: 790, // R$ 7,90 em centavos
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: formData.fullName ? `${formData.fullName.toLowerCase().replace(/\s+/g, '')}@cliente.guiacripto.com` : undefined,
      line_items: lineItems,
      mode,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&form_data=${encodeURIComponent(JSON.stringify(formData))}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        form_data: JSON.stringify(formData),
        payment_type: paymentType,
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
