
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

// Save consultation data to Supabase
export const saveConsultationData = async (data: FormValues) => {
  const consultationData = {
    knowledge_level: data.knowledgeLevel,
    objective: data.objective,
    investment_amount: data.investmentAmount,
    has_exchange: data.hasExchange === "yes",
    exchange_name: data.hasExchange === "yes" ? data.exchangeName : null,
    has_wallet: data.hasWallet === "yes",
  };
  
  return await supabase.from('consultations').insert(consultationData).select('id').single();
};

// Create Telegram message from form data
export const createTelegramMessage = (data: FormValues, consultationId?: string): string => {
  let message = "Olá! Acabei de preencher o formulário e quero iniciar a consultoria.";
  
  // Add consultation ID if available
  if (consultationId) {
    message += `\n\nID da consulta: ${consultationId}`;
  }
  
  message += `\n\nMeu nível: ${getKnowledgeLabel(data.knowledgeLevel)}`;
  message += `\nMeu objetivo: ${getObjectiveLabel(data.objective)}`;
  message += `\nInvestimento mensal: ${getInvestmentLabel(data.investmentAmount)}`;
  message += `\nTenho corretora: ${data.hasExchange === "yes" ? "Sim" : "Não"}`;
  if (data.hasExchange === "yes" && data.exchangeName) {
    message += ` (${data.exchangeName})`;
  }
  message += `\nTenho carteira: ${data.hasWallet === "yes" ? "Sim" : "Não"}`;
  
  return message;
};
