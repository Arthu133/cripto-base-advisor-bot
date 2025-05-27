
import React from 'react';
import { Control } from 'react-hook-form';
import FormQuestion from '../FormQuestion';
import FormTextInput from '../FormTextInput';
import { FormValues } from './types';

interface ConsultationFormQuestionsProps {
  control: Control<FormValues>;
}

const ConsultationFormQuestions: React.FC<ConsultationFormQuestionsProps> = ({ control }) => {
  return (
    <>
      <FormTextInput
        control={control}
        name="fullName"
        label="1. Qual seu nome completo?"
        placeholder="Digite seu nome completo"
      />

      <FormTextInput
        control={control}
        name="phoneNumber"
        label="2. Qual o seu número de telefone para contato?"
        placeholder="(11) 99999-9999"
      />

      <FormTextInput
        control={control}
        name="mainPain"
        label="3. Qual a sua maior dor atualmente no mundo das criptomoedas?"
        placeholder="Descreva sua principal dificuldade ou dúvida sobre criptomoedas"
        isTextarea={true}
      />

      <FormTextInput
        control={control}
        name="email"
        label="4. Qual o seu email para contato?"
        placeholder="seu@email.com"
      />

      <FormQuestion
        control={control}
        name="knowledgeLevel"
        label="5. Qual seu nível atual de conhecimento em cripto?"
        options={[
          { value: "beginner", label: "Iniciante" },
          { value: "intermediate", label: "Intermediário" },
          { value: "advanced", label: "Avançado" },
        ]}
      />

      <FormQuestion
        control={control}
        name="objective"
        label="6. Qual seu objetivo com criptomoedas?"
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
        label="7. Quanto você pretende investir por mês?"
        options={[
          { value: "lessThan100", label: "Menos de R$ 100" },
          { value: "between100And500", label: "Entre R$ 100 e R$ 500" },
          { value: "moreThan500", label: "Mais de R$ 500" },
        ]}
      />

      <FormQuestion
        control={control}
        name="hasExchange"
        label="8. Já possui conta em alguma corretora?"
        options={[
          { value: "yes", label: "Sim", hasInput: true },
          { value: "no", label: "Não" },
        ]}
        textInputName="exchangeName"
      />

      <FormQuestion
        control={control}
        name="hasCrypto"
        label="9. Você já possui alguma criptomoeda?"
        options={[
          { value: "no", label: "Não" },
          { value: "yes", label: "Sim", hasInput: true },
        ]}
        textInputName="cryptoPortfolio"
      />
    </>
  );
};

export default ConsultationFormQuestions;
