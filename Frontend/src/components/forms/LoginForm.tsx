import { useFormContext } from "react-hook-form";
import { loginSchema } from "../../utils/schemas";
import type { LoginFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";
// Import the interface from your centralized types hub
import type { LoginFormProps } from "../../types";

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

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  return (
    <AuthFormLayout
      schema={loginSchema}
      onSubmitSuccess={onSubmit} // Bridging 'onSubmit' down to layout
      isLoading={isLoading}       // Passing the mutation loading state down
      submitButtonText="Sign In"
    >
      <LoginFields />
    </AuthFormLayout>
  );
}