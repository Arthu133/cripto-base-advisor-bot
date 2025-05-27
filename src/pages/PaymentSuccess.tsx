
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, MessageCircle } from 'lucide-react';
import { createWhatsAppMessage } from '@/utils/formSubmissionUtils';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [consultationId, setConsultationId] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');

      console.log("Verificando pagamento com session_id:", sessionId);

      if (!sessionId) {
        console.error("Nenhum session_id encontrado");
        setIsVerifying(false);
        return;
      }

      try {
        console.log("Chamando função verify-payment...");
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        console.log("Resposta da função verify-payment:", data, error);

        if (error) {
          console.error("Erro na função verify-payment:", error);
          throw error;
        }

        if (data?.success) {
          console.log("Pagamento verificado com sucesso!");
          setPaymentVerified(true);
          setFormData(data.formData);
          
          if (data.consultationId) {
            setConsultationId(data.consultationId);
          }

          // Criar mensagem para WhatsApp
          if (data.formData) {
            const message = createWhatsAppMessage(data.formData, data.consultationId);
            const encodedMessage = encodeURIComponent(`Olá Arthur! Acabei de fazer o pagamento da consultoria.\n\n${message}`);
            const whatsappLink = `https://wa.me/553191169528?text=${encodedMessage}`;
            setWhatsappUrl(whatsappLink);
            console.log("URL do WhatsApp criada:", whatsappLink);
          }
        } else {
          console.error("Pagamento não foi verificado:", data);
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  const redirectToWhatsApp = () => {
    if (whatsappUrl) {
      console.log("Redirecionando para WhatsApp:", whatsappUrl);
      window.location.href = whatsappUrl;
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Verificando seu pagamento...</h2>
          <p className="text-gray-600 mt-2">Por favor, aguarde enquanto confirmamos sua transação.</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erro na Verificação</h2>
          <p className="text-gray-600 mb-6">Não foi possível verificar seu pagamento. Entre em contato conosco.</p>
          <Button onClick={() => window.location.href = '/'}>
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Obrigado {formData?.fullName || 'pelo seu pagamento'}! Sua consultoria foi confirmada e seus dados foram salvos.
          </p>

          {consultationId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                ID da sua consulta: {consultationId}
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">Próximos Passos:</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1">
              <li>Clique no botão abaixo para ser redirecionado ao WhatsApp</li>
              <li>Suas respostas do formulário já estarão na mensagem</li>
              <li>Arthur Dias entrará em contato em breve</li>
            </ol>
          </div>

          <Button
            onClick={redirectToWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-medium"
            disabled={!whatsappUrl}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Falar com Arthur no WhatsApp
          </Button>

          <p className="text-sm text-gray-500 mt-4">
            Telefone: +55 (31) 9116-9528
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
