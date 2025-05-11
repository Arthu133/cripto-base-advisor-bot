
import React from 'react';
import { Control } from 'react-hook-form';
import FormQuestion from '../FormQuestion';
import { FormValues } from './types';

interface ConsultationFormQuestionsProps {
  control: Control<FormValues>;
}

const ConsultationFormQuestions: React.FC<ConsultationFormQuestionsProps> = ({ control }) => {
  return (
    <>
      <FormQuestion
        control={control}
        name="knowledgeLevel"
        label="1. Qual seu nível atual de conhecimento em cripto?"
        options={[
          { value: "beginner", label: "Iniciante" },
          { value: "intermediate", label: "Intermediário" },
          { value: "advanced", label: "Avançado" },
        ]}
      />

      <FormQuestion
        control={control}
        name="objective"
        label="2. Qual seu objetivo com criptomoedas?"
        options={[
          { value: "longTerm", label: "Investir a longo prazo" },
          { value: "trading", label: "Fazer trade" },
          { value: "staking", label: "Staking/DeFi" },
          { value: "basics", label: "Entender o básico" },
        ]}
      />

      <FormQuestion
        control={control}
        name="investmentAmount"
        label="3. Quanto você pretende investir por mês?"
        options={[
          { value: "lessThan100", label: "Menos de R$ 100" },
          { value: "between100And500", label: "Entre R$ 100 e R$ 500" },
          { value: "moreThan500", label: "Mais de R$ 500" },
        ]}
      />

      <FormQuestion
        control={control}
        name="hasExchange"
        label="4. Já possui conta em alguma corretora?"
        options={[
          { value: "yes", label: "Sim", hasInput: true },
          { value: "no", label: "Não" },
        ]}
        textInputName="exchangeName"
      />

      <FormQuestion
        control={control}
        name="hasWallet"
        label="5. Já possui carteira cripto (como Metamask, TrustWallet)?"
        options={[
          { value: "yes", label: "Sim" },
          { value: "no", label: "Não" },
        ]}
      />
    </>
  );
};

export default ConsultationFormQuestions;
