
import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  mainPain: z.string().min(5, "Por favor, descreva sua maior dor com mais detalhes"),
  knowledgeLevel: z.enum(["beginner", "intermediate", "advanced"]),
  objective: z.enum(["longTerm", "trading", "staking", "basics"]),
  investmentAmount: z.enum(["lessThan100", "between100And500", "moreThan500"]),
  hasExchange: z.enum(["yes", "no"]),
  exchangeName: z.string().optional(),
  hasWallet: z.enum(["yes", "no"]),
  paymentType: z.enum(["monthly", "subscription"]),
});

export type FormValues = z.infer<typeof formSchema>;
