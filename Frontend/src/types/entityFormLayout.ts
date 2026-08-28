import type { ReactNode } from "react";
import type { FieldValues, DefaultValues } from "react-hook-form";
import type { ZodType } from "zod";

export interface EntityFormLayoutProps<T extends FieldValues> {
  schema: ZodType<any, any, any>;
  defaultValues?: DefaultValues<T>;
  onSubmitSuccess: (data: any) => void;
  onCancel?: () => void;
  submitButtonText: string;
  children: ReactNode;
}