
import React from "react";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormTextInputProps {
  control: any;
  name: string;
  label: string;
  placeholder: string;
  isTextarea?: boolean;
}

const FormTextInput: React.FC<FormTextInputProps> = ({
  control,
  name,
  label,
  placeholder,
  isTextarea = false
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-6 space-y-3">
          <FormLabel className="text-lg font-medium">{label}</FormLabel>
          <FormControl>
            {isTextarea ? (
              <Textarea 
                placeholder={placeholder}
                className="min-h-[100px]"
                {...field} 
              />
            ) : (
              <Input 
                placeholder={placeholder}
                {...field} 
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTextInput;
