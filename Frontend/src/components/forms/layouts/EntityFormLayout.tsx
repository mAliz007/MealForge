// frontend/src/components/forms/layouts/EntityFormLayout.tsx
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { FieldValues, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { Button } from "../../ui/Button";

interface EntityFormLayoutProps<T extends FieldValues> {
  schema: ZodType<any, any, any>;
  defaultValues?: DefaultValues<T>;
  onSubmitSuccess: (data: any) => void;
  onCancel?: () => void;
  submitButtonText: string;
  children: ReactNode;
}

export function EntityFormLayout<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmitSuccess,
  onCancel,
  submitButtonText,
  children,
}: EntityFormLayoutProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Sync form state when dynamic defaults update
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitSuccess)} className="space-y-4 w-full">
        {children}

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {submitButtonText}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}