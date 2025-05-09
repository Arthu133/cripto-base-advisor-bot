
import React from "react";
import { Separator } from "@/components/ui/separator";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">CriptoBase</h3>
            <p className="text-gray-300">
              Consultoria automatizada para iniciantes no mundo das criptomoedas.
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Início</a></li>
              <li><a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Como Funciona</a></li>
              <li><a href="#consultation-form" className="text-gray-300 hover:text-white transition-colors">Consultoria</a></li>
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Contato</h4>
            <p className="text-gray-300">
              Entre em contato através do WhatsApp<br />
              +31 98658-5947
            </p>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CriptoBase. Todos os direitos reservados.</p>
          <p className="text-xs mt-2">
            Este site não oferece aconselhamento financeiro. Consulte um profissional antes de investir.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
