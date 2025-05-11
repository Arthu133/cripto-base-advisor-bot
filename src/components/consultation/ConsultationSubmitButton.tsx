
import React from 'react';
import { Button } from '@/components/ui/button';

const ConsultationSubmitButton: React.FC = () => {
  return (
    <Button
      type="submit"
      className="w-full py-6 text-lg font-medium mt-6 bg-gradient-crypto hover:opacity-90 transition-opacity"
    >
      Começar Agora
    </Button>
  );
};

export default ConsultationSubmitButton;
