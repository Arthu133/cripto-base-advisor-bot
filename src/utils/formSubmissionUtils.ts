
import { FormValues } from "@/components/consultation/types";
import { supabase } from "@/integrations/supabase/client";

// Helper functions to get labels
export const getKnowledgeLabel = (value: string): string => {
  const map: Record<string, string> = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  };
  return map[value] || value;
};

export const getObjectiveLabel = (value: string): string => {
  const map: Record<string, string> = {
    longTerm: "Investir a longo prazo",
    trading: "Fazer trade",
    staking: "Staking/DeFi",
    basics: "Entender o básico",
  };
  return map[value] || value;
};

export const getInvestmentLabel = (value: string): string => {
  const map: Record<string, string> = {
    lessThan100: "Menos de R$ 100",
    between100And500: "Entre R$ 100 e R$ 500",
    moreThan500: "Mais de R$ 500",
  };
  return map[value] || value;
};

export const getPaymentTypeLabel = (value: string): string => {
  const map: Record<string, string> = {
    monthly_subscription: "Assinatura Mensal - R$ 17,90/mês",
    three_day_access: "Acesso de 3 Dias - R$ 8,90",
  };
  return map[value] || value;
};

// Save consultation data to Supabase
export const saveConsultationData = async (data: FormValues) => {
  const consultationData = {
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    main_pain: data.mainPain,
    email: data.email,
    knowledge_level: data.knowledgeLevel,
    objective: data.objective,
    investment_amount: data.investmentAmount,
    has_exchange: data.hasExchange === "yes",
    exchange_name: data.hasExchange === "yes" ? data.exchangeName : null,
    has_crypto: data.hasCrypto === "yes",
    crypto_portfolio: data.hasCrypto === "yes" ? data.cryptoPortfolio : null,
  };
  
  return await supabase.from('consultations').insert(consultationData).select('id').single();
};

// Create message from form data for WhatsApp
export const createWhatsAppMessage = (data: FormValues, consultationId?: string): string => {
  let message = `*DADOS DA CONSULTORIA PAGA*\n`;
  
  // Add consultation ID if available
  if (consultationId) {
    message += `ID da consulta: ${consultationId}\n`;
  }
  
  message += `\n*Nome:* ${data.fullName}`;
  message += `\n*Telefone:* ${data.phoneNumber}`;
  message += `\n*Email:* ${data.email}`;
  message += `\n*Maior Dor:* ${data.mainPain}`;
  message += `\n*Nível de Conhecimento:* ${getKnowledgeLabel(data.knowledgeLevel)}`;
  message += `\n*Objetivo:* ${getObjectiveLabel(data.objective)}`;
  message += `\n*Investimento Mensal:* ${getInvestmentLabel(data.investmentAmount)}`;
  message += `\n*Tem Corretora:* ${data.hasExchange === "yes" ? "Sim" : "Não"}`;
  if (data.hasExchange === "yes" && data.exchangeName) {
    message += ` (${data.exchangeName})`;
  }
  message += `\n*Possui Criptomoedas:* ${data.hasCrypto === "yes" ? "Sim" : "Não"}`;
  if (data.hasCrypto === "yes" && data.cryptoPortfolio) {
    message += `\n*Portfólio Atual:* ${data.cryptoPortfolio}`;
  }
  
  return message;
};
