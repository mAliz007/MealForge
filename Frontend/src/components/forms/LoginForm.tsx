import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { loginSchema } from "../../utils/schemas";
import type { LoginFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";
import type { LoginFormProps } from "../../types";

function LoginFields() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<LoginFormData>();

  return (
    <>
      <Input
        label={t("auth.emailLabel")}
        id="email"
        type="email"
        placeholder={t("auth.emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label={t("auth.passwordLabel")}
        id="password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />
    </>
  );
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation();

  return (
    <AuthFormLayout
      schema={loginSchema}
      onSubmitSuccess={onSubmit}
      submitButtonText={t("auth.signIn")}
    >
      <LoginFields />
    </AuthFormLayout>
  );
}