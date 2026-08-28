import { useFormContext } from "react-hook-form";
import { restaurantSchema } from "../../utils/schemas";
import type { RestaurantFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { EntityFormLayout } from "./layouts/EntityFormLayout";
import type { RestaurantFormProps } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";

function RestaurantFields() {
  const { t } = useTranslation();
  const { isAdmin } = useAuthUser();
  const { register, formState: { errors } } = useFormContext<RestaurantFormData>();

  return (
    <>
      <Input
        label={t("restaurants.form.labels.name")}
        id="name"
        type="text"
        placeholder={t("restaurants.form.placeholders.name")}
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        label={t("restaurants.form.labels.location")}
        id="location"
        type="text"
        placeholder={t("restaurants.form.placeholders.location")}
        error={errors.location?.message}
        {...register("location")}
      />

      {/* Admin-only numeric User ID input */}
      {isAdmin && (
        <Input
          label={t("restaurants.form.labels.userId", { defaultValue: "Owner User ID" })}
          id="user_id"
          type="number"
          placeholder={t("restaurants.form.placeholders.userId", { defaultValue: "e.g. 5" })}
          error={errors.user_id?.message}
          {...register("user_id")}
        />
      )}

      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="status" className="text-xs font-semibold text-muted uppercase tracking-wider">
          {t("restaurants.form.labels.status")}
        </label>

        <select
          id="status"
          className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 ${
            errors.status
              ? "border-red-500 focus:ring-red-500/20 text-red-500 bg-red-500/5"
              : "border-structure focus:border-accent focus:ring-accent/20 text-main"
          }`}
          {...register("status")}
        >
          <option value="open" className="bg-structure text-main">
            {t("restaurants.form.labels.open")}
          </option>
          <option value="closed" className="bg-structure text-main">
            {t("restaurants.form.labels.closed")}
          </option>
        </select>

        {errors.status && (
          <p className="text-xs font-medium text-red-500 mt-0.5">{errors.status.message}</p>
        )}
      </div>
    </>
  );
}

export function RestaurantForm({ defaultValues, onSubmitSuccess, onCancel }: RestaurantFormProps) {
  const { t } = useTranslation();

  return (
    <EntityFormLayout<RestaurantFormData>
      schema={restaurantSchema}
      defaultValues={defaultValues}
      onSubmitSuccess={onSubmitSuccess}
      onCancel={onCancel}
      submitButtonText={
        defaultValues
          ? t("restaurants.form.actions.save")
          : t("restaurants.form.actions.create")
      }
    >
      <RestaurantFields />
    </EntityFormLayout>
  );
}