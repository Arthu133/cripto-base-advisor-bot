
import React from "react";
import { Button } from "@/components/ui/button";

const CryptoHero: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById("consultation-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-20 pb-16 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      </div>
      
      <div className="relative z-10 container mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 max-w-4xl leading-tight">
          Sua revolução financeira com <span className="text-gradient-crypto">Criptomoedas</span> Começa Aqui
        </h1>
        
        <p className="text-xl max-w-3xl text-center mb-10 text-gray-700">
          Consultoria personalizada por Arthur Dias para iniciantes e investidores. Responda algumas perguntas e receba orientação especializada diretamente no seu Whatsapp.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={scrollToForm}
            className="px-8 py-6 text-lg font-medium bg-gradient-crypto hover:opacity-90 transition-opacity"
          >
            Começar Agora
          </Button>
          
          <Button 
            variant="outline"
            className="px-8 py-6 text-lg font-medium border-2 hover:bg-gray-50"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            Como Funciona
          </Button>
        </div>
        
        {/* Floating crypto icons */}
        <div className="mt-16 relative w-full max-w-3xl">
          <div className="absolute -top-8 left-10 w-16 h-16 animate-float">
            <img src="public/bitcoin-btc-logo.png" alt="Bitcoin" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -top-8 right-20 w-14 h-14 animate-float" style={{ animationDelay: "1s" }}>
            <img src="public/ethereum-eth-logo.png" alt="Ethereum" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-4 right-15 w-12 h-12 animate-float" style={{ animationDelay: "1.5s" }}>
            <img src="public/solana-sol-logo.png" alt="Solana" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CryptoHero;
