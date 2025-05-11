
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://jmikifhihovkkcmdgjdd.supabase.co";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaWtpZmhpaG92a2tjbWRnamRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTYzNTcsImV4cCI6MjA2MjM5MjM1N30.NYOaXvE-cD3wSZ6JN6DgcBjjlT1IoBnCskDzDT1DjVs";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Create Supabase client
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY
);

// Constants
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const OPENAI_API = "https://api.openai.com/v1/chat/completions";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get consultation data from Telegram start parameter
async function getConsultationDataFromMessage(message: string): Promise<any | null> {
  // Extract form data from message
  const knowledgeLevelMatch = message.match(/nível: ([^\n]+)/);
  const objectiveMatch = message.match(/objetivo: ([^\n]+)/);
  const investmentMatch = message.match(/Investimento mensal: ([^\n]+)/);
  const exchangeMatch = message.match(/Tenho corretora: ([^(]+)/);
  const exchangeNameMatch = message.match(/Tenho corretora: Sim \(([^)]+)\)/);
  const walletMatch = message.match(/Tenho carteira: ([^\n]+)/);

  if (
    knowledgeLevelMatch &&
    objectiveMatch && 
    investmentMatch
  ) {
    // Map knowledge level back to enum value
    let knowledgeLevel = "beginner";
    if (knowledgeLevelMatch[1] === "Intermediário") knowledgeLevel = "intermediate";
    if (knowledgeLevelMatch[1] === "Avançado") knowledgeLevel = "advanced";

    // Map objective back to enum value
    let objective = "basics";
    if (objectiveMatch[1] === "Investir a longo prazo") objective = "longTerm";
    if (objectiveMatch[1] === "Fazer trade") objective = "trading";
    if (objectiveMatch[1] === "Staking/DeFi") objective = "staking";

    // Map investment amount back to enum value
    let investmentAmount = "lessThan100";
    if (investmentMatch[1] === "Entre R$ 100 e R$ 500") investmentAmount = "between100And500";
    if (investmentMatch[1] === "Mais de R$ 500") investmentAmount = "moreThan500";

    const hasExchange = exchangeMatch && exchangeMatch[1].trim() === "Sim";
    const hasWallet = walletMatch && walletMatch[1].trim() === "Sim";

    return {
      knowledge_level: knowledgeLevel,
      objective: objective,
      investment_amount: investmentAmount,
      has_exchange: hasExchange,
      exchange_name: exchangeNameMatch ? exchangeNameMatch[1] : null,
      has_wallet: hasWallet
    };
  }
  
  return null;
}

// Save consultation data to database
async function saveConsultation(chatId: number, data: any): Promise<string | null> {
  try {
    const { data: consultation, error } = await supabase
      .from('consultations')
      .insert(data)
      .select('id')
      .single();

    if (error) {
      console.error("Error saving consultation:", error);
      return null;
    }

    return consultation.id;
  } catch (error) {
    console.error("Exception while saving consultation:", error);
    return null;
  }
}

// Save chat message to database
async function saveChatMessage(chatId: number, consultationId: string | null, message: string, isFromUser: boolean) {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        telegram_chat_id: chatId,
        consultation_id: consultationId,
        message_text: message,
        is_from_user: isFromUser
      });

    if (error) {
      console.error("Error saving chat message:", error);
    }
  } catch (error) {
    console.error("Exception while saving chat message:", error);
  }
}

// Get the latest consultation for this chat
async function getConsultationForChat(chatId: number): Promise<any | null> {
  try {
    // First get the consultation ID
    const { data: chatMessage, error: chatError } = await supabase
      .from('chat_messages')
      .select('consultation_id')
      .eq('telegram_chat_id', chatId)
      .is('consultation_id', 'not.null')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (chatError || !chatMessage || !chatMessage.consultation_id) {
      return null;
    }
    
    // Then get the consultation data
    const { data: consultation, error: consultationError } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', chatMessage.consultation_id)
      .single();
      
    if (consultationError || !consultation) {
      return null;
    }

    return consultation;
  } catch (error) {
    console.error("Exception while getting consultation for chat:", error);
    return null;
  }
}

// Generate personalized system prompt based on consultation data
function generateSystemPrompt(consultationData: any): string {
  // Base prompt
  let prompt = `Você é um consultor especialista em criptomoedas, ajudando um usuário com o seguinte perfil:`;
  
  // Add knowledge level
  if (consultationData.knowledge_level === "beginner") {
    prompt += `\n- Nível de conhecimento: Iniciante. Use linguagem simples, evite termos técnicos complexos e explique conceitos básicos.`;
  } else if (consultationData.knowledge_level === "intermediate") {
    prompt += `\n- Nível de conhecimento: Intermediário. Você pode usar alguns termos técnicos, mas ainda forneça explicações para conceitos mais avançados.`;
  } else if (consultationData.knowledge_level === "advanced") {
    prompt += `\n- Nível de conhecimento: Avançado. Você pode usar terminologia técnica livremente, assumindo um bom entendimento de blockchain e criptomoedas.`;
  }
  
  // Add objective
  if (consultationData.objective === "longTerm") {
    prompt += `\n- Objetivo: Investimento a longo prazo. Foque em estratégias de HODL, diversificação, DCA, e projetos com fundamentos sólidos.`;
  } else if (consultationData.objective === "trading") {
    prompt += `\n- Objetivo: Trading. Foque em análise técnica, gestão de risco, ferramentas de trading e estratégias de entrada/saída.`;
  } else if (consultationData.objective === "staking") {
    prompt += `\n- Objetivo: Staking/DeFi. Foque em protocolos DeFi, yield farming, staking de tokens, e riscos associados.`;
  } else if (consultationData.objective === "basics") {
    prompt += `\n- Objetivo: Entender o básico. Foque em explicar o que são criptomoedas, blockchain, carteiras, exchanges e segurança básica.`;
  }
  
  // Add investment amount
  if (consultationData.investment_amount === "lessThan100") {
    prompt += `\n- Orçamento: Menos de R$100 mensais. Sugira opções de baixo custo e possivelmente microcaps.`;
  } else if (consultationData.investment_amount === "between100And500") {
    prompt += `\n- Orçamento: Entre R$100 e R$500 mensais. Sugira um portfólio diversificado com algumas alocações em altcoins.`;
  } else if (consultationData.investment_amount === "moreThan500") {
    prompt += `\n- Orçamento: Mais de R$500 mensais. Sugira uma estratégia de portfólio mais sofisticada, possivelmente incluindo staking, DeFi e tokens de diversos setores.`;
  }
  
  // Add exchange info
  if (consultationData.has_exchange) {
    prompt += `\n- Já possui conta em corretora: ${consultationData.exchange_name ? consultationData.exchange_name : "Sim"}. Você pode recomendar diretamente operações usando esta corretora.`;
  } else {
    prompt += `\n- Não possui conta em corretora. Inclua informações sobre como escolher e abrir conta em corretoras confiáveis quando relevante.`;
  }
  
  // Add wallet info
  if (consultationData.has_wallet) {
    prompt += `\n- Já possui carteira cripto. Você pode assumir que o usuário sabe como receber e enviar criptomoedas.`;
  } else {
    prompt += `\n- Não possui carteira cripto. Inclua informações sobre como criar e usar carteiras de forma segura quando relevante.`;
  }
  
  // General guidelines
  prompt += `\n\nDiretrizes gerais:
- Seja amigável e paciente
- Forneça informações precisas e atualizadas
- Não dê conselhos financeiros específicos ou garantias de investimento
- Sempre priorize a segurança e a educação do usuário
- Ajude a desmistificar o mercado cripto evitando jargões desnecessários
- Dê exemplos práticos quando possível
- Mantenha respostas concisas, com no máximo 3 parágrafos quando possível

Em sua primeira mensagem, depois de uma breve saudação personalizada, sugira 3-4 tópicos relevantes ao perfil do usuário sobre os quais ele pode perguntar.`;

  return prompt;
}

// Handle Telegram update
async function handleTelegramUpdate(update: any) {
  // Check if this is a message update
  if (!update.message) return { ok: true };

  const chatId = update.message.chat.id;
  const messageText = update.message.text || "";
  
  console.log(`Received message from ${chatId}: ${messageText}`);
  
  // Check if this is a /start command with parameters
  let consultationId = null;
  let consultationData = null;
  
  if (messageText.startsWith("/start") && messageText.length > 7) {
    const startParam = messageText.substring(7);
    const decodedParam = decodeURIComponent(startParam);
    console.log("Start parameter:", decodedParam);
    
    // Extract consultation data from start parameter
    consultationData = await getConsultationDataFromMessage(decodedParam);
    
    if (consultationData) {
      // Save consultation data
      consultationId = await saveConsultation(chatId, consultationData);
      console.log("Created consultation:", consultationId);
      
      // Generate personalized welcome message
      let welcomeMessage = "👋 Olá! Sou seu consultor de criptomoedas personalizado. Li suas informações e estou pronto para ajudar!\n\n";
      
      // Customize based on knowledge level
      if (consultationData.knowledge_level === "beginner") {
        welcomeMessage += "Vejo que você está começando sua jornada no mundo cripto. Não se preocupe, vou explicar tudo com linguagem simples.\n\n";
      } else if (consultationData.knowledge_level === "intermediate") {
        welcomeMessage += "Vejo que você já tem algum conhecimento sobre criptomoedas. Vamos aprofundar esse conhecimento juntos!\n\n";
      } else if (consultationData.knowledge_level === "advanced") {
        welcomeMessage += "Vejo que você já é experiente no mundo cripto. Vamos discutir estratégias mais avançadas!\n\n";
      }
      
      // Add objective-specific content
      if (consultationData.objective === "basics") {
        welcomeMessage += "Com base no seu perfil, posso ajudar com:\n";
        welcomeMessage += "- O que são criptomoedas e como funcionam\n";
        welcomeMessage += "- Como criar e proteger suas carteiras\n";
        welcomeMessage += "- Como escolher uma exchange confiável\n";
        welcomeMessage += "- Fundamentos de Bitcoin e Ethereum\n\n";
      } else if (consultationData.objective === "longTerm") {
        welcomeMessage += "Com base no seu perfil, posso ajudar com:\n";
        welcomeMessage += "- Estratégias de investimento a longo prazo\n";
        welcomeMessage += "- Diversificação de portfólio\n";
        welcomeMessage += "- Dollar-Cost Averaging (DCA)\n";
        welcomeMessage += "- Projetos com fundamentos sólidos\n\n";
      } else if (consultationData.objective === "trading") {
        welcomeMessage += "Com base no seu perfil, posso ajudar com:\n";
        welcomeMessage += "- Análise técnica básica\n";
        welcomeMessage += "- Gestão de risco no trading\n";
        welcomeMessage += "- Estratégias de entrada e saída\n";
        welcomeMessage += "- Ferramentas úteis para traders\n\n";
      } else if (consultationData.objective === "staking") {
        welcomeMessage += "Com base no seu perfil, posso ajudar com:\n";
        welcomeMessage += "- Como funciona staking de criptomoedas\n";
        welcomeMessage += "- Oportunidades de DeFi e yield farming\n";
        welcomeMessage += "- Riscos e recompensas do staking\n";
        welcomeMessage += "- Protocolos DeFi populares\n\n";
      }
      
      welcomeMessage += "Como posso ajudar você hoje?";
      
      // Send welcome message
      await sendTelegramMessage(chatId, welcomeMessage);
      
      // Save welcome message
      await saveChatMessage(chatId, consultationId, welcomeMessage, false);
      
      return { ok: true };
    }
  }
  
  // Get the latest consultation for this user
  if (!consultationData) {
    consultationData = await getConsultationForChat(chatId);
    if (consultationData) {
      consultationId = consultationData.id;
    }
  }

  // Save user message
  await saveChatMessage(chatId, consultationId, messageText, true);

  // Send "typing" action to Telegram
  await sendChatAction(chatId, "typing");

  try {
    // Get response from OpenAI
    const aiResponse = await getOpenAIResponse(messageText, consultationData);
    
    // Send the response back to Telegram
    await sendTelegramMessage(chatId, aiResponse);
    
    // Save AI response
    await saveChatMessage(chatId, consultationId, aiResponse, false);
    
    return { ok: true };
  } catch (error) {
    console.error("Error processing message:", error);
    
    // Send error message to user
    await sendTelegramMessage(chatId, 
      "Desculpe, tive um problema ao processar sua pergunta. Por favor, tente novamente mais tarde."
    );
    
    return { ok: false, error: error.message };
  }
}

// Send message to Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  });
}

// Send chat action to Telegram
async function sendChatAction(chatId: number, action: string) {
  await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      action: action,
    }),
  });
}

// Get response from OpenAI
async function getOpenAIResponse(userMessage: string, consultationData: any | null): Promise<string> {
  const systemPrompt = consultationData 
    ? generateSystemPrompt(consultationData)
    : "Você é um consultor de criptomoedas para iniciantes. Responda de forma amigável, clara e educativa. Use linguagem simples e explique conceitos complexos de forma acessível. Forneça informações precisas sobre Bitcoin, Ethereum e outras criptomoedas populares. Ajude iniciantes com estratégias básicas, segurança e como evitar golpes. Não dê conselhos financeiros específicos ou garantias de investimento. Mantenha as respostas concisas com no máximo 3 parágrafos quando possível.";

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
          content: systemPrompt
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
  console.log(`Setting webhook to: ${webhookUrl}`);
  
  const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ["message"],
    }),
  });

  const result = await response.json();
  console.log("Webhook setup result:", result);
  return result;
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
  
  console.log(`Request path: ${url.pathname}, extracted path: ${path}`);

  try {
    // For webhook setup endpoint
    if (path === "setup") {
      console.log("Processing setup request");
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
    if (req.method === "POST" && path !== "setup") {
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
        JSON.stringify({ 
          status: "Bot servidor está ativo! Configure o webhook do Telegram para começar.",
          environment: {
            telegram_token: TELEGRAM_BOT_TOKEN ? "Configurado" : "Não configurado",
            openai_key: OPENAI_API_KEY ? "Configurado" : "Não configurado",
            supabase: SUPABASE_URL && (SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY) ? "Configurado" : "Não configurado"
          }
        }),
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
