
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '@/components/consultation/types';
import { useNavigate } from 'react-router-dom';

export function useConsultationSubmit() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    
    try {
      // Armazenar dados do formulário no localStorage para usar na próxima página
      localStorage.setItem('consultationFormData', JSON.stringify(data));
      
      toast({
        title: "Formulário enviado!",
        description: "Agora escolha seu plano de pagamento.",
      });

      // Redirecionar para página de seleção de pagamento
      navigate('/payment-selection');
    } catch (error) {
      console.error("Erro ao processar formulário:", error);
      toast({
        title: "Erro ao processar formulário",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
