
import React from 'react';

const ConsultationFormHeader: React.FC = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Consultoria Personalizada em Criptomoedas</h2>
      <p className="text-gray-600 mb-6 text-center">
        Preencha o formulário abaixo e receba orientações personalizadas sobre criptomoedas diretamente de nosso especialista no Telegram!
      </p>
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Nossa IA analisará suas respostas e fornecerá recomendações adaptadas ao seu nível de conhecimento, objetivos 
              e situação financeira.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultationFormHeader;
