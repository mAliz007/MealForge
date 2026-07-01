// frontend/src/components/forms/RegisterForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface RegisterFormProps {
  onSubmitSuccess: (data: RegisterFormData) => void;
}

export function RegisterForm({ onSubmitSuccess }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitSuccess)} className="space-y-4 w-full max-w-sm">
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
      <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
        Create Account
      </Button>
    </form>
  );
}