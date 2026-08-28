import type { RegisterFormData } from "../utils/schemas";

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}