
import React from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

const ConsultationSubmitButton: React.FC = () => {
  return (
    <Button
      type="submit"
      className="w-full py-6 text-lg font-medium mt-6 bg-gradient-crypto hover:opacity-90 transition-opacity"
    >
      <CreditCard className="mr-2 h-5 w-5" />
      Prosseguir para Pagamento
    </Button>
  );
};

export default ConsultationSubmitButton;
