
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );

    // Buscar assinaturas expiradas
    const { data: expiredSubscriptions, error } = await supabase
      .rpc('check_expired_subscriptions');

    if (error) {
      throw error;
    }

    console.log(`Encontradas ${expiredSubscriptions?.length || 0} assinaturas expiradas`);

    // Marcar como expiradas e preparar notificações
    const notifications = [];
    
    if (expiredSubscriptions && expiredSubscriptions.length > 0) {
      for (const subscription of expiredSubscriptions) {
        // Marcar como expirada
        await supabase.rpc('mark_subscription_expired', { 
          subscription_id: subscription.id 
        });

        // Preparar notificação
        const planName = subscription.plan_type === 'monthly_subscription' 
          ? 'Assinatura Mensal' 
          : 'Acesso de 3 Dias';
          
        notifications.push({
          name: subscription.user_name,
          email: subscription.user_email,
          phone: subscription.phone_number,
          plan: planName,
          expiredAt: subscription.end_date
        });
      }
    }

    // Se houver notificações, enviar para você (você pode implementar webhook ou email aqui)
    if (notifications.length > 0) {
      console.log("NOTIFICAÇÃO: Assinaturas expiradas:", notifications);
      
      // Aqui você pode adicionar envio de email, webhook, etc.
      // Por exemplo, enviar para um webhook do Zapier ou Make.com
    }

    return new Response(JSON.stringify({ 
      success: true,
      expiredCount: notifications.length,
      notifications 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao verificar assinaturas:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
