
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ConsultationSubmitButtonProps {
  isSubmitting?: boolean;
}

const ConsultationSubmitButton: React.FC<ConsultationSubmitButtonProps> = ({ isSubmitting = false }) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-6 text-lg font-medium mt-6 bg-gradient-crypto hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {isSubmitting ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-5 w-5" />
      )}
      {isSubmitting ? "Salvando dados..." : "Começar sua revolução financeira"}
    </Button>
  );
};

export default ConsultationSubmitButton;
