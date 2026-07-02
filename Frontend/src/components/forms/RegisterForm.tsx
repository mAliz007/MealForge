// frontend/src/components/forms/RegisterForm.tsx
import { useFormContext } from "react-hook-form";
import { registerSchema } from "../../utils/schemas";
import type { RegisterFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";

interface RegisterFormProps {
  onSubmitSuccess: (data: RegisterFormData) => void;
}

function RegisterFields() {
  const { register, formState: { errors } } = useFormContext<RegisterFormData>();

  return (
    <>
      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register("name")}
      />
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

export function RegisterForm({ onSubmitSuccess }: RegisterFormProps) {
  return (
    <AuthFormLayout
      schema={registerSchema}
      onSubmitSuccess={onSubmitSuccess}
      submitButtonText="Create Account"
    >
      <RegisterFields />
    </AuthFormLayout>
  );
}