
import * as z from "zod";

export const formSchema = z.object({
  knowledgeLevel: z.enum(["beginner", "intermediate", "advanced"]),
  objective: z.enum(["longTerm", "trading", "staking", "basics"]),
  investmentAmount: z.enum(["lessThan100", "between100And500", "moreThan500"]),
  hasExchange: z.enum(["yes", "no"]),
  exchangeName: z.string().optional(),
  hasWallet: z.enum(["yes", "no"]),
});

export type FormValues = z.infer<typeof formSchema>;
