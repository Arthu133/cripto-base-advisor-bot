
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TelegramBotSetup from "@/components/TelegramBotSetup";

const BotConfig: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Configuração do Bot de Consultoria Cripto
      </h1>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Configuração</TabsTrigger>
            <TabsTrigger value="guide">Guia de Uso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-8 py-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Configurar Bot do Telegram</h2>
              <p className="text-gray-600">
                Configure seu bot do Telegram para integrar com GPT-4 e fornecer consultoria em criptomoedas.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Importante:</strong> Você precisa configurar as chaves de API nas variáveis de ambiente do Supabase:
                    </p>
                    <ul className="list-disc ml-5 mt-2 text-sm text-yellow-700">
                      <li>TELEGRAM_BOT_TOKEN - Token do seu bot criado no BotFather</li>
                      <li>OPENAI_API_KEY - Sua chave da API do OpenAI</li>
                    </ul>
                  </div>
                </div>
              </div>

              <TelegramBotSetup />
            </div>
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-6 py-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Guia de Uso</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">1. Criar um Bot no Telegram</h3>
                  <p>Primeiro, crie um bot no Telegram usando o BotFather:</p>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Abra o Telegram e procure por "@BotFather"</li>
                    <li>Envie o comando /newbot</li>
                    <li>Siga as instruções para dar um nome e username ao seu bot</li>
                    <li>Guarde o token HTTP API que você receberá</li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">2. Configurar as Variáveis de Ambiente</h3>
                  <p>No painel de administração do Supabase, vá até:</p>
                  <ol className="list-decimal ml-6 space-y-2">
                    <li>Funções Edge → crypto-telegram-bot → Configurações</li>
                    <li>Adicione as variáveis:
                      <ul className="list-disc ml-6">
                        <li>TELEGRAM_BOT_TOKEN = [seu token do Telegram]</li>
                        <li>OPENAI_API_KEY = [sua chave da API do OpenAI]</li>
                      </ul>
                    </li>
                  </ol>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">3. Configurar o Webhook</h3>
                  <p>Use o formulário na aba "Configuração" para definir o webhook do seu bot. A URL deve apontar para esta função Edge do Supabase.</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">4. Teste o Bot</h3>
                  <p>Abra seu bot no Telegram e envie uma mensagem. Ele deve responder com informações sobre criptomoedas!</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BotConfig;
