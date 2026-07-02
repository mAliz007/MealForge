// frontend/src/components/forms/layouts/AuthFormLayout.tsx
import type { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { Button } from "../../ui/Button";

interface AuthFormLayoutProps<T extends FieldValues> {
  schema: ZodType<T, any, any>;
  onSubmitSuccess: (data: T) => void;
  submitButtonText: string;
  children: ReactNode;
}

export function AuthFormLayout<T extends FieldValues>({
  schema,
  onSubmitSuccess,
  submitButtonText,
  children,
}: AuthFormLayoutProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitSuccess)}
        className="space-y-4 w-full max-w-sm"
      >
        {children}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
        >
          {submitButtonText}
        </Button>
      </form>
    </FormProvider>
  );
}