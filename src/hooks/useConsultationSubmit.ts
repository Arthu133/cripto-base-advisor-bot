
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '@/components/consultation/types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function useConsultationSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    
    try {
      // Primeiro salvar os dados da consultoria no banco
      console.log("Salvando dados da consultoria no banco...");
      
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

      const { data: consultationResult, error: consultationError } = await supabase
        .from('consultations')
        .insert(consultationData)
        .select('id')
        .single();
      
      if (consultationError) {
        console.error("Erro ao salvar consultoria:", consultationError);
        throw new Error("Erro ao salvar dados da consultoria");
      }

      console.log("Consultoria salva com sucesso:", consultationResult?.id);
      
      // Armazenar dados do formulário e ID da consultoria no localStorage
      const formDataWithId = {
        ...data,
        consultationId: consultationResult?.id
      };
      
      localStorage.setItem('consultationFormData', JSON.stringify(formDataWithId));
      
      toast({
        title: "Dados salvos com sucesso!",
        description: "Agora escolha seu plano de pagamento.",
      });

      // Redirecionar para página de seleção de pagamento
      navigate('/payment-selection');
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
