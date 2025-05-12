
import React from "react";
import { ClipboardList, MessageSquare, BookOpen } from "lucide-react";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <ClipboardList className="h-10 w-10" />,
      title: "Preencha o Formulário",
      description: "Compartilhe seu perfil, objetivos e experiência com criptomoedas através do nosso formulário simples.",
    },
    {
      icon: <MessageSquare className="h-10 w-10" />,
      title: "Atendimento no Telegram",
      description: "Você será redirecionado para o Telegram onde eu, Arthur Dias, estarei pronto para responder suas dúvidas.",
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Aprenda na Prática",
      description: "Receba orientações personalizadas, glossários e estratégias adaptadas ao seu perfil de investidor.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6">
              <div className="mb-4 text-crypto-blue p-4 rounded-full bg-blue-50">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
