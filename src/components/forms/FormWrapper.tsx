/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode, CSSProperties } from "react";
import {
  useForm,
  FormProvider,
  type UseFormProps,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";

interface FormWrapperProps<T extends FieldValues> extends UseFormProps<T> {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  schema?: ZodType<T, any, any>;
  className?: string;
  style?: CSSProperties;
}

export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  className,
  style,
  ...useFormProps
}: FormWrapperProps<T>) {
  console.log("FormWrapper - Has Schema:", !!schema);
  
  const methods = useForm<T>({
    ...useFormProps,
    resolver: schema ? zodResolver(schema) : undefined,
  });

  const handleSubmit = (data: T) => {
    console.log("FormWrapper - handleSubmit triggered, Data:", data);
    onSubmit(data);
  };

  const handleInvalid = (errors: any) => {
    console.log("FormWrapper - Validation Errors:", errors);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit, handleInvalid)}
        className={className}
        style={style}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}
