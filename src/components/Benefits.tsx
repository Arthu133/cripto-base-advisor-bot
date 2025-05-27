
import React from "react";
import { Shield, Lightbulb, TrendingUp, MessageCircle } from "lucide-react";

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 rounded-lg crypto-card transition-all duration-300 hover:shadow-md">
    <div className="mb-4 text-crypto-purple p-3 rounded-full bg-purple-50">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const Benefits: React.FC = () => {
  const benefits = [
    {
      icon: <Shield size={24} />,
      title: "Segurança Primeiro",
      description: "Aprenda práticas seguras para proteger seus investimentos e evitar golpes comuns."
    },
    {
      icon: <Lightbulb size={24} />,
      title: "Conhecimento Simplificado",
      description: "Conceitos complexos explicados de forma clara e acessível para iniciantes."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Estratégias Testadas",
      description: "Dicas e estratégias baseadas em práticas reais do mercado de criptomoedas."
    },
    {
      icon: <MessageCircle size={24} />,
      title: "Suporte Personalizado",
      description: "Atendimento via WhatsApp adaptado ao seu perfil e objetivos específicos."
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Por que escolher uma consultoria personalizada com um especialista?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard 
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
