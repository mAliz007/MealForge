import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { menuItemSchema } from "../../utils/schemas";
import type { MenuItemFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { mockRestaurants } from "../../utils/mockData";
import { EntityFormLayout } from "./layouts/EntityFormLayout";
import type { MenuItemFormInput, MenuItemFormProps } from "../../types";

function MenuItemFields() {
  const { t } = useTranslation();
  const { register, formState: { errors } } = useFormContext<MenuItemFormInput>();

  return (
    <>
      {/* Form Section Header */}
      <div className="col-span-full border-b border-structure pb-2 mb-2">
        <h3 className="text-sm font-semibold text-text-main">
          {t("menu.form.title")}
        </h3>
        <p className="text-xs text-text-muted mt-0.5">
          {t("menu.form.subtitle")}
        </p>
      </div>

      <Input
        label={t("menu.form.labels.name")}
        id="name"
        type="text"
        placeholder={t("menu.form.placeholders.name")}
        error={errors.name?.message}
        {...register("name")}
      />
      
      <Input
        label={t("menu.form.labels.price")}
        id="price"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.price?.message}
        {...register("price")}
      />

      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="restaurantId" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          {t("menu.form.labels.restaurant")}
        </label>
        <select
          id="restaurantId"
          className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 text-text-main ${
            errors.restaurantId
              ? "border-red-500/50 focus:ring-red-500/20 text-red-600 bg-red-500/5 dark:text-red-400"
              : "border-structure focus:border-accent focus:ring-accent/20"
          }`}
          {...register("restaurantId")}
        >
          <option value="" className="bg-canvas text-text-muted">
            {t("menu.form.labels.placeholderSelect")}
          </option>
          {mockRestaurants.map((res) => (
            <option key={res.id} value={res.id} className="bg-canvas text-text-main">
              {res.name}
            </option>
          ))}
        </select>
        {errors.restaurantId && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-0.5">
            {errors.restaurantId.message}
          </p>
        )}
      </div>
    </>
  );
}