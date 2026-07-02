import type { RegisterFormData } from "../utils/schemas";

export interface RegisterFormProps {
  onSubmitSuccess: (data: RegisterFormData) => void;
}