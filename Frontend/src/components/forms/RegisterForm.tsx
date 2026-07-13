import { useFormContext } from "react-hook-form";
import { registerSchema } from "../../utils/schemas";
import type { RegisterFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";
// Import the interface from your centralized types hub
import type { RegisterFormProps } from "../../types";

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

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  return (
    <AuthFormLayout
      schema={registerSchema}
      onSubmitSuccess={onSubmit} // Bridging 'onSubmit' down to layout
      isLoading={isLoading}       // Passing the mutation loading state down
      submitButtonText="Create Account"
    >
      <RegisterFields />
    </AuthFormLayout>
  );
}