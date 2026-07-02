import type { ReactNode } from "react";
import type { FieldValues } from "react-hook-form";
import type { ZodType } from "zod";

export interface AuthFormLayoutProps<T extends FieldValues> {
  schema: ZodType<T, any, any>;
  onSubmitSuccess: (data: T) => void;
  submitButtonText: string;
  children: ReactNode;
}