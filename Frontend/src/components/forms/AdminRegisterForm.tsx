import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { adminRegisterSchema } from "../../utils/schemas";
import type { AdminRegisterFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { AuthFormLayout } from "./layouts/AuthFormLayout";

export interface AdminRegisterFormProps {
  onSubmit: (data: AdminRegisterFormData) => void;
  isLoading?: boolean;
}

function AdminRegisterFields() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<AdminRegisterFormData>();

  return (
    <div className="space-y-4">
      {/* Owner / Admin Details Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t("auth.adminRegister.ownerDetails") || "Owner Details"}
        </h3>

        <Input
          label={t("auth.fullNameLabel") || "Full Name"}
          id="user.name"
          type="text"
          placeholder={t("auth.fullNamePlaceholder") || "John Doe"}
          error={errors.user?.name?.message}
          {...register("user.name")}
        />

        <Input
          label={t("auth.emailLabel") || "Email Address"}
          id="user.email"
          type="email"
          placeholder={t("auth.emailPlaceholder") || "admin@restaurant.com"}
          error={errors.user?.email?.message}
          {...register("user.email")}
        />

        <Input
          label={t("auth.passwordLabel") || "Password"}
          id="user.password"
          type="password"
          placeholder="••••••••"
          error={errors.user?.password?.message}
          {...register("user.password")}
        />
      </div>

      <div className="my-4 border-t border-text-muted/10" />

      {/* Restaurant Details Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {t("auth.adminRegister.restaurantDetails") || "Restaurant Details"}
        </h3>

        <Input
          label={t("auth.adminRegister.restaurantName") || "Restaurant Name"}
          id="restaurant.name"
          type="text"
          placeholder="e.g. Gourmet Bistro"
          error={errors.restaurant?.name?.message}
          {...register("restaurant.name")}
        />

        <Input
          label={t("auth.adminRegister.location") || "City / Location"}
          id="restaurant.location"
          type="text"
          placeholder="e.g. Lahore"
          error={errors.restaurant?.location?.message}
          {...register("restaurant.location")}
        />
      </div>
    </div>
  );
}

export function AdminRegisterForm({ onSubmit, isLoading }: AdminRegisterFormProps) {
  const { t } = useTranslation();

  return (
    <AuthFormLayout
      schema={adminRegisterSchema}
      onSubmitSuccess={onSubmit}
      submitButtonText={t("auth.adminRegister.createButton") || "Register Restaurant & Account"}
      isLoading={isLoading}
    >
      <AdminRegisterFields />
    </AuthFormLayout>
  );
}