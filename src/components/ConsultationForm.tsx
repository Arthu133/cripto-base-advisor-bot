
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormQuestion from "./FormQuestion";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  knowledgeLevel: z.enum(["beginner", "intermediate", "advanced"]),
  objective: z.enum(["longTerm", "trading", "staking", "basics"]),
  investmentAmount: z.enum(["lessThan100", "between100And500", "moreThan500"]),
  hasExchange: z.enum(["yes", "no"]),
  exchangeName: z.string().optional(),
  hasWallet: z.enum(["yes", "no"]),
});

type FormValues = z.infer<typeof formSchema>;

const ConsultationForm = () => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeLevel: "beginner",
      objective: "basics",
      investmentAmount: "lessThan100",
      hasExchange: "no",
      exchangeName: "",
      hasWallet: "no",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    
    // Construct WhatsApp message based on form data
    let message = "Olá! Acabei de preencher o formulário e quero iniciar a consultoria.";
    message += `\n\nMeu nível: ${getKnowledgeLabel(data.knowledgeLevel)}`;
    message += `\nMeu objetivo: ${getObjectiveLabel(data.objective)}`;
    message += `\nInvestimento mensal: ${getInvestmentLabel(data.investmentAmount)}`;
    message += `\nTenho corretora: ${data.hasExchange === "yes" ? "Sim" : "Não"}`;
    if (data.hasExchange === "yes" && data.exchangeName) {
      message += ` (${data.exchangeName})`;
    }
    message += `\nTenho carteira: ${data.hasWallet === "yes" ? "Sim" : "Não"}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/31986585947?text=${encodedMessage}`;
    
    toast({
      title: "Formulário enviado com sucesso!",
      description: "Você será redirecionado para o WhatsApp em instantes.",
    });
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 1500);
  };

  // Helper functions to get labels
  const getKnowledgeLabel = (value: string): string => {
    const map: Record<string, string> = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado",
    };
    return map[value] || value;
  };

  const getObjectiveLabel = (value: string): string => {
    const map: Record<string, string> = {
      longTerm: "Investir a longo prazo",
      trading: "Fazer trade",
      staking: "Staking/DeFi",
      basics: "Entender o básico",
    };
    return map[value] || value;
  };

  const getInvestmentLabel = (value: string): string => {
    const map: Record<string, string> = {
      lessThan100: "Menos de R$ 100",
      between100And500: "Entre R$ 100 e R$ 500",
      moreThan500: "Mais de R$ 500",
    };
    return map[value] || value;
  };

  const watchHasExchange = form.watch("hasExchange");

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl crypto-card shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Consultoria Personalizada</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormQuestion
            control={form.control}
            name="knowledgeLevel"
            label="1. Qual seu nível atual de conhecimento em cripto?"
            options={[
              { value: "beginner", label: "Iniciante" },
              { value: "intermediate", label: "Intermediário" },
              { value: "advanced", label: "Avançado" },
            ]}
          />

          <FormQuestion
            control={form.control}
            name="objective"
            label="2. Qual seu objetivo com criptomoedas?"
            options={[
              { value: "longTerm", label: "Investir a longo prazo" },
              { value: "trading", label: "Fazer trade" },
              { value: "staking", label: "Staking/DeFi" },
              { value: "basics", label: "Entender o básico" },
            ]}
          />

          <FormQuestion
            control={form.control}
            name="investmentAmount"
            label="3. Quanto você pretende investir por mês?"
            options={[
              { value: "lessThan100", label: "Menos de R$ 100" },
              { value: "between100And500", label: "Entre R$ 100 e R$ 500" },
              { value: "moreThan500", label: "Mais de R$ 500" },
            ]}
          />

          <FormQuestion
            control={form.control}
            name="hasExchange"
            label="4. Já possui conta em alguma corretora?"
            options={[
              { value: "yes", label: "Sim", hasInput: true },
              { value: "no", label: "Não" },
            ]}
            textInputName="exchangeName"
          />

          <FormQuestion
            control={form.control}
            name="hasWallet"
            label="5. Já possui carteira cripto (como Metamask, TrustWallet)?"
            options={[
              { value: "yes", label: "Sim" },
              { value: "no", label: "Não" },
            ]}
          />

          <Button
            type="submit"
            className="w-full py-6 text-lg font-medium mt-6 bg-gradient-crypto hover:opacity-90 transition-opacity"
          >
            Começar Agora
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ConsultationForm;
