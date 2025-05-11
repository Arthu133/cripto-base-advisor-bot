
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "Preciso ter conhecimento prévio em criptomoedas?",
      answer: "Não, a CriptoBase foi desenvolvida especialmente para iniciantes. Nossa IA vai guiar você desde o básico, adaptando as explicações ao seu nível de conhecimento."
    },
    {
      question: "Como funciona a consultoria pelo WhatsApp?",
      answer: "Após preencher o formulário, você será direcionado ao WhatsApp onde nossa IA estará pronta para responder suas dúvidas com base nas informações que você forneceu."
    },
    {
      question: "Quanto vou precisar investir para começar?",
      answer: "O valor mínimo varia de acordo com a corretora escolhida, mas existem opções que permitem começar com menos de R$ 100. Nossa consultoria é adaptada ao seu perfil de investimento."
    },
    {
      question: "O serviço é realmente gratuito?",
      answer: "Sim! A versão básica da consultoria é totalmente gratuita. Futuramente, ofereceremos planos premium com recursos adicionais e acesso a consultores humanos."
    },
    {
      question: "É seguro investir em criptomoedas?",
      answer: "Como todo investimento, criptomoedas possuem riscos. Nossa consultoria foca em práticas seguras e estratégias de gerenciamento de risco para iniciantes, ajudando você a evitar armadilhas comuns."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
