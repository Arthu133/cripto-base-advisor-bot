
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const TelegramBotSetup: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const setupWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "URL necessária",
        description: "Por favor, insira a URL do webhook",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the setup endpoint directly
      const { data, error } = await supabase.functions.invoke("crypto-telegram-bot/setup", {
        body: { 
          webhook_url: webhookUrl 
        },
      });

      if (error) throw error;

      toast({
        title: "Webhook configurado com sucesso!",
        description: "Seu bot do Telegram está pronto para receber mensagens.",
      });
      console.log("Setup result:", data);
    } catch (error) {
      console.error("Error setting up webhook:", error);
      toast({
        title: "Erro na configuração",
        description: error.message || "Não foi possível configurar o webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Configurar Bot do Telegram</CardTitle>
        <CardDescription>
          Configure o webhook do seu bot do Telegram para que ele possa receber mensagens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="webhook-url" className="text-sm font-medium">
              URL do Webhook
            </label>
            <Input
              id="webhook-url"
              placeholder="https://jmikifhihovkkcmdgjdd.functions.supabase.co/crypto-telegram-bot"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Esta deve ser a URL pública da sua função Supabase.
              Exemplo: https://jmikifhihovkkcmdgjdd.functions.supabase.co/crypto-telegram-bot
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={setupWebhook} disabled={isLoading} className="w-full">
          {isLoading ? "Configurando..." : "Configurar Webhook"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TelegramBotSetup;
