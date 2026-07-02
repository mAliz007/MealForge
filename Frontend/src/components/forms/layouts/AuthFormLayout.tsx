import { useForm, FormProvider } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../ui/Button";
// Import the interface from your global types hub
import type { AuthFormLayoutProps } from "../../../types";

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