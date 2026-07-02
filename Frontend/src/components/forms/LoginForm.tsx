// frontend/src/components/forms/LoginForm.tsx
import { useFormContext } from "react-hook-form";
import { loginSchema } from "../../utils/schemas";
import type { LoginFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";

interface LoginFormProps {
  onSubmitSuccess: (data: LoginFormData) => void;
}

function LoginFields() {
  const { register, formState: { errors } } = useFormContext<LoginFormData>();

  return (
    <>
      <Input
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        id="password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
    </>
  );
}

export function LoginForm({ onSubmitSuccess }: LoginFormProps) {
  return (
    <AuthFormLayout
      schema={loginSchema}
      onSubmitSuccess={onSubmitSuccess}
      submitButtonText="Sign In"
    >
      <LoginFields />
    </AuthFormLayout>
  );
}