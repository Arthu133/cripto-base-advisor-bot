
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { formSchema, FormValues } from "@/components/consultation/types";
import ConsultationFormHeader from "@/components/consultation/ConsultationFormHeader";
import ConsultationFormQuestions from "@/components/consultation/ConsultationFormQuestions";
import ConsultationSubmitButton from "@/components/consultation/ConsultationSubmitButton";
import { useConsultationSubmit } from "@/hooks/useConsultationSubmit";

const ConsultationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      mainPain: "",
      knowledgeLevel: "beginner",
      objective: "basics",
      investmentAmount: "lessThan100",
      hasExchange: "no",
      exchangeName: "",
      hasWallet: "no",
      paymentType: "monthly",
    },
  });

  const { handleSubmit } = useConsultationSubmit();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl crypto-card shadow-lg">
      <ConsultationFormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <ConsultationFormQuestions control={form.control} />
          <ConsultationSubmitButton />
        </form>
      </Form>
    </div>
  );
};

export default ConsultationForm;
