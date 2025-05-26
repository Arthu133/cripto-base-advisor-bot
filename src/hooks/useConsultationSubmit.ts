
import { useToast } from '@/hooks/use-toast';
import { FormValues } from '@/components/consultation/types';
import { supabase } from '@/integrations/supabase/client';

export function useConsultationSubmit() {
  const { toast } = useToast();

  const handleSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    
    try {
      // Criar sessão de checkout no Stripe
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-checkout', {
        body: {
          paymentType: data.paymentType,
          formData: data
        }
      });

      if (checkoutError) {
        throw new Error(checkoutError.message);
      }

      if (checkoutData?.url) {
        toast({
          title: "Redirecionando para pagamento",
          description: "Você será redirecionado para completar o pagamento.",
        });

        // Redirecionar para o Stripe Checkout
        window.location.href = checkoutData.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
