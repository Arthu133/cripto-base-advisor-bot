
import React from "react";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Option {
  value: string;
  label: string;
  hasInput?: boolean;
}

interface FormQuestionProps {
  control: any;
  name: string;
  label: string;
  options: Option[];
  textInputName?: string;
}

const FormQuestion: React.FC<FormQuestionProps> = ({
  control,
  name,
  label,
  options,
  textInputName
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-6 space-y-3">
          <FormLabel className="text-lg font-medium">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <div key={option.value} className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                    <FormLabel 
                      htmlFor={`${name}-${option.value}`} 
                      className="text-base font-normal cursor-pointer"
                    >
                      {option.label}
                    </FormLabel>
                  </div>
                  
                  {option.hasInput && textInputName && field.value === option.value && (
                    <FormField
                      control={control}
                      name={textInputName}
                      render={({ field: textField }) => (
                        <FormItem className="ml-6">
                          <FormControl>
                            {textInputName === "cryptoPortfolio" ? (
                              <Textarea 
                                placeholder="Ex: Bitcoin 50%, Ethereum 30%, Solana 20%"
                                className="min-h-[80px]"
                                {...textField} 
                              />
                            ) : (
                              <Input 
                                placeholder="Digite qual..." 
                                {...textField} 
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormQuestion;
