import type { LoginFormData } from "../utils/schemas";

export interface LoginFormProps {
  onSubmitSuccess: (data: LoginFormData) => void;
}