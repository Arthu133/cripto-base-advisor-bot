
import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phoneNumber: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos").regex(/^[\d\s\(\)\-\+]+$/, "Formato de telefone inválido"),
  mainPain: z.string().min(5, "Por favor, descreva sua maior dor com mais detalhes"),
  email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
  knowledgeLevel: z.enum(["beginner", "intermediate", "advanced"]),
  objective: z.enum(["longTerm", "trading", "staking", "basics"]),
  investmentAmount: z.enum(["lessThan100", "between100And500", "moreThan500"]),
  hasExchange: z.enum(["yes", "no"]),
  exchangeName: z.string().optional(),
  hasCrypto: z.enum(["yes", "no"]),
  cryptoPortfolio: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
