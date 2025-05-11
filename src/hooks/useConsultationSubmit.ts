
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '@/components/consultation/types';
import { createTelegramMessage, saveConsultationData } from '@/utils/formSubmissionUtils';

export function useConsultationSubmit() {
  const { toast } = useToast();

  const handleSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    
    try {
      // Save data to Supabase
      const { data: consultation, error } = await saveConsultationData(data);
      
      if (error) {
        console.error("Erro ao salvar consulta:", error);
        toast({
          title: "Erro ao salvar dados",
          description: "Não foi possível salvar seus dados, mas continuaremos com o atendimento.",
          variant: "destructive",
        });
      } else {
        console.log("Consulta salva com sucesso, ID:", consultation.id);
        toast({
          title: "Dados salvos com sucesso!",
          description: "Suas informações foram registradas.",
        });
      }
      
      // Create and encode message for Telegram, including consultation ID
      const consultationId = consultation?.id;
      const message = createTelegramMessage(data, consultationId);
      const encodedMessage = encodeURIComponent(message);
      
      // Direct to Telegram bot using start parameter to pass form data
      const telegramBotUrl = `https://t.me/CriptoBaseBot?start=${encodedMessage}`;
      
      toast({
        title: "Formulário enviado com sucesso!",
        description: "Você será redirecionado para o Telegram em instantes.",
      });
      
      // Redirect to Telegram after a short delay
      setTimeout(() => {
        window.location.href = telegramBotUrl;
      }, 1500);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast({
        title: "Erro ao processar dados",
        description: "Ocorreu um erro, mas continuaremos com o atendimento.",
        variant: "destructive",
      });
      
      // Fallback - redirect to Telegram even in case of error
      const telegramBotUrl = "https://t.me/CriptoBaseBot";
      setTimeout(() => {
        window.location.href = telegramBotUrl;
      }, 1500);
    }
  };

  return { handleSubmit };
}
