import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { registerSchema } from "../../utils/schemas";
import type { RegisterFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";
import type { RegisterFormProps } from "../../types";

function RegisterFields() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <>
      <Input
        label={t("auth.fullNameLabel")}
        id="name"
        type="text"
        placeholder={t("auth.fullNamePlaceholder")}
        error={errors.name?.message}
        {...register("name")}
      />
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

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation();

  return (
    <AuthFormLayout
      schema={registerSchema}
      onSubmitSuccess={onSubmit}
      submitButtonText={t("auth.createAccount")}
    >
      <RegisterFields />
    </AuthFormLayout>
  );
}