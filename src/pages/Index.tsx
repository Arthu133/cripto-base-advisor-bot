
import React from "react";
import CryptoHero from "@/components/CryptoHero";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import ConsultationForm from "@/components/ConsultationForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <CryptoHero />
      
      {/* Benefits Section */}
      <Benefits />
      
      {/* How It Works Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>
      
      {/* Consultation Form Section */}
      <section id="consultation-form" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Preencha e Receba sua Consultoria
          </h2>
          <p className="text-xl text-center max-w-2xl mx-auto mb-12 text-gray-600">
            Preencha o formulário abaixo e comece agora sua jornada no mundo cripto com um suporte personalizado direto no Telegram!
          </p>
          <ConsultationForm />
        </div>
      </section>
      
      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
