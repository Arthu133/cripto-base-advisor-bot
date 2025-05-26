
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
        name="mainPain"
        label="2. Qual a sua maior dor atualmente no mundo das criptomoedas?"
        placeholder="Descreva sua principal dificuldade ou dúvida sobre criptomoedas"
        isTextarea={true}
      />

      <FormQuestion
        control={control}
        name="knowledgeLevel"
        label="3. Qual seu nível atual de conhecimento em cripto?"
        options={[
          { value: "beginner", label: "Iniciante" },
          { value: "intermediate", label: "Intermediário" },
          { value: "advanced", label: "Avançado" },
        ]}
      />

      <FormQuestion
        control={control}
        name="objective"
        label="4. Qual seu objetivo com criptomoedas?"
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
        label="5. Quanto você pretende investir por mês?"
        options={[
          { value: "lessThan100", label: "Menos de R$ 100" },
          { value: "between100And500", label: "Entre R$ 100 e R$ 500" },
          { value: "moreThan500", label: "Mais de R$ 500" },
        ]}
      />

      <FormQuestion
        control={control}
        name="hasExchange"
        label="6. Já possui conta em alguma corretora?"
        options={[
          { value: "yes", label: "Sim", hasInput: true },
          { value: "no", label: "Não" },
        ]}
        textInputName="exchangeName"
      />

      <FormQuestion
        control={control}
        name="hasWallet"
        label="7. Já possui carteira cripto (como Metamask, TrustWallet)?"
        options={[
          { value: "yes", label: "Sim" },
          { value: "no", label: "Não" },
        ]}
      />

      <FormQuestion
        control={control}
        name="paymentType"
        label="8. Escolha seu plano de consultoria:"
        options={[
          { value: "monthly", label: "Pagamento Único - R$ 17,90 (1 mês de acesso)" },
          { value: "subscription", label: "Assinatura Mensal - R$ 7,90/mês (renovação automática)" },
        ]}
      />
    </>
  );
};

export default ConsultationFormQuestions;
