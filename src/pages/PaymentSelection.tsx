
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreditCard, Check } from 'lucide-react';
import { FormValues } from '@/components/consultation/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Recuperar dados do formulário do localStorage
    const storedData = localStorage.getItem('consultationFormData');
    if (!storedData) {
      // Se não há dados, redirecionar para o formulário
      navigate('/');
      return;
    }
    
    try {
      const data = JSON.parse(storedData);
      setFormData(data);
    } catch (error) {
      console.error('Erro ao recuperar dados do formulário:', error);
      navigate('/');
    }
  }, [navigate]);

  const handlePayment = async (paymentType: 'monthly' | 'subscription') => {
    if (!formData) return;

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          paymentType,
          formData
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        toast({
          title: "Redirecionando para pagamento",
          description: "Você será redirecionado para completar o pagamento.",
        });

        // Redirecionar para o Stripe Checkout
        window.location.href = data.url;
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
    } finally {
      setIsProcessing(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Escolha seu Plano de Consultoria
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Olá {formData.fullName}! Agora escolha o plano que melhor se adequa às suas necessidades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plano Mensal */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition-colors">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Único</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">R$ 17,90</div>
              <p className="text-gray-600">1 mês de acesso completo</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Consultoria personalizada</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Suporte direto no Whatsapp</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Estratégias personalizadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Sem renovação automática</span>
              </li>
            </ul>

            <Button
              onClick={() => handlePayment('monthly')}
              disabled={isProcessing}
              className="w-full py-4 text-lg font-medium bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Escolher Plano Mensal
            </Button>
          </div>

          {/* Plano Assinatura */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Assinatura Mensal</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">R$ 7,90</div>
              <p className="text-gray-600">Por mês, renovação automática</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Consultoria personalizada</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Suporte direto no Whatsapp</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Estratégias personalizadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Acesso contínuo</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Cancele quando quiser</span>
              </li>
            </ul>

            <Button
              onClick={() => handlePayment('subscription')}
              disabled={isProcessing}
              className="w-full py-4 text-lg font-medium bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Escolher Assinatura
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            Voltar ao Formulário
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSelection;
