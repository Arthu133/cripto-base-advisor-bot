
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Constants
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENAI_API = "https://api.openai.com/v1/chat/completions";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle Telegram update
async function handleTelegramUpdate(update: any) {
  // Check if this is a message update
  if (!update.message) return { ok: true };

  const chatId = update.message.chat.id;
  const messageText = update.message.text;
  
  console.log(`Received message from ${chatId}: ${messageText}`);

  // Send "typing" action to Telegram
  await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      action: "typing",
    }),
  });

  try {
    // Get response from OpenAI
    const aiResponse = await getOpenAIResponse(messageText);
    
    // Send the response back to Telegram
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: aiResponse,
        parse_mode: "Markdown",
      }),
    });
    
    return { ok: true };
  } catch (error) {
    console.error("Error processing message:", error);
    
    // Send error message to user
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente mais tarde.",
      }),
    });
    
    return { ok: false, error: error.message };
  }
}

// Get response from OpenAI
async function getOpenAIResponse(userMessage: string): Promise<string> {
  const response = await fetch(OPENAI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Você é um consultor de criptomoedas para iniciantes. 
          Responda de forma amigável, clara e educativa. 
          Use linguagem simples e explique conceitos complexos de forma acessível. 
          Forneça informações precisas sobre Bitcoin, Ethereum e outras criptomoedas populares.
          Ajude iniciantes com estratégias básicas, segurança e como evitar golpes.
          Não dê conselhos financeiros específicos ou garantias de investimento.
          Mantenha as respostas concisas com no máximo 3 parágrafos quando possível.`
        },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 800
    }),
  });

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    console.error("OpenAI API error:", data);
    throw new Error("Falha na API do OpenAI");
  }
  
  return data.choices[0].message.content.trim();
}

// Set up webhook for Telegram
async function setTelegramWebhook(webhookUrl: string) {
  const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message"],
    }),
  });

  return await response.json();
}

// Main handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Check for required env variables
  if (!TELEGRAM_BOT_TOKEN || !OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ 
        error: "Missing environment variables. Please set TELEGRAM_BOT_TOKEN and OPENAI_API_KEY." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();

  try {
    // For webhook setup
    if (path === "setup" && req.method === "POST") {
      const { webhook_url } = await req.json();
      const result = await setTelegramWebhook(webhook_url);
      return new Response(
        JSON.stringify({ success: true, result }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    // For handling Telegram webhook updates
    if (req.method === "POST") {
      const update = await req.json();
      const result = await handleTelegramUpdate(update);
      return new Response(
        JSON.stringify(result),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For testing if the function is working
    if (req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "Bot servidor está ativo! Configure o webhook do Telegram para começar." }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método não suportado" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
