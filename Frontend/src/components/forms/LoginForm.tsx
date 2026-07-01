// frontend/src/components/forms/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface LoginFormProps {
  onSubmitSuccess: (data: LoginFormData) => void;
}

export function LoginForm({ onSubmitSuccess }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmitSuccess)} className="space-y-4 w-full max-w-sm">
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
        Sign In
      </Button>
    </form>
  );
}