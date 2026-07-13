import type { LoginFormData } from "../utils/schemas";

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
}