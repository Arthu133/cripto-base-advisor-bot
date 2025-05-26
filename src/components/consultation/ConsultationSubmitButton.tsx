
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ConsultationSubmitButton: React.FC = () => {
  return (
    <Button
      type="submit"
      className="w-full py-6 text-lg font-medium mt-6 bg-gradient-crypto hover:opacity-90 transition-opacity"
    >
      <ArrowRight className="mr-2 h-5 w-5" />
      Começar sua revolução financeira
    </Button>
  );
};

export default ConsultationSubmitButton;
