
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BotConfig = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Configuração do Sistema
          </h1>
          <p className="text-lg text-gray-600">
            Esta página está sendo atualizada.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sistema de Consultoria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              O sistema de consultoria está funcionando normalmente. 
              Os clientes preenchem o formulário e são redirecionados para o WhatsApp após o pagamento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BotConfig;
