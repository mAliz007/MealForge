import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useRestaurants } from "../../hooks/useRestaurants";
import type { MenuItemFormData } from "../../utils/schemas";
import type { MenuItem } from "../../types";
import { Input } from "~components/ui/Input";
import { Button } from "~components/ui/Button";

interface MenuItemFormModalProps {
  open: boolean;
  editingItem?: MenuItem;
  onSubmit: (data: MenuItemFormData & { available: boolean }) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function MenuItemFormPanel({
  open,
  editingItem,
  onSubmit,
  onCancel,
  isPending,
}: MenuItemFormModalProps) {
  const { t } = useTranslation();
  
  // Fetch up to 30 restaurants for the form dropdown
  const { data: response } = useRestaurants(1, 30);
  const restaurantList = response?.data;
  const meta = response?.meta;
  const hasMore = meta && meta.count > 30;

  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<MenuItemFormData>({
    defaultValues: editingItem
      ? { name: editingItem.name, price: editingItem.price, restaurant_id: editingItem.restaurant_id }
      : { name: "", price: 0, restaurant_id: "" as any },
  });

  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          name: editingItem.name,
          price: editingItem.price,
          restaurant_id: editingItem.restaurant_id,
        });
        setIsAvailable(editingItem.available);
      } else {
        reset({ name: "", price: 0, restaurant_id: "" as any });
        setIsAvailable(true);
      }
    }
  }, [editingItem, reset, open]);

  const onFormSubmit = (formData: MenuItemFormData) => {
    onSubmit({
      ...formData,
      available: isAvailable,
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel} 
      fullWidth 
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--color-structure)",
            backgroundImage: "none",
            color: "var(--color-text-main)",
            borderRadius: "12px",
            border: "1px solid var(--color-structure)",
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "var(--color-text-main)" }}>
        {editingItem ? t("menu.form.titleEdit") : t("menu.form.titleCreate")}
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent 
          dividers
          sx={{ 
            p: 3,
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "var(--color-text-main)"
          }}
        >
          <div className="flex flex-col gap-4">
            
            {/* Item Name */}
            <Input
              label={t("menu.form.fieldName")}
              id="name"
              type="text"
              error={errors.name?.message}
              {...register("name", { required: t("menu.form.validation.nameRequired") })}
            />

            {/* Price */}
            <Input
              label={t("menu.form.fieldPrice")}
              id="price"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register("price", { 
                required: t("menu.form.validation.priceRequired"), 
                valueAsNumber: true 
              })}
            />

            {/* Restaurant Owner Select Field */}
            <div className="w-full flex flex-col gap-1.5">
              <label 
                htmlFor="restaurant_id" 
                className="text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {t("menu.form.fieldRestaurant")}
              </label>
              <Controller
                name="restaurant_id"
                control={control}
                rules={{ required: t("menu.form.validation.restaurantRequired") }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="restaurant_id"
                    disabled={!!editingItem}
                    value={field.value ?? ""}
                    className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.5rem_center] bg-[length:1.25em_1.25em] bg-no-repeat pr-10 ${
                      errors.restaurant_id
                        ? "border-red-500 focus:ring-red-500/20 text-red-500"
                        : "border-structure focus:border-accent focus:ring-accent/20 text-text-main"
                    }`}
                  >
                    <option value="" className="bg-canvas">{t("menu.form.selectPlaceholder")}</option>
                    {restaurantList?.map((r) => (
                      <option key={r.id} value={r.id} className="bg-canvas">
                        {r.name}
                      </option>
                    ))}
                    {hasMore && (
                      <option value="" disabled className="bg-canvas text-text-muted italic">
                        ──────────
                        (Showing 30 of {meta.count} - search in Restaurants view)
                      </option>
                    )}
                  </select>
                )}
              />
              {errors.restaurant_id && (
                <p className="text-xs font-medium text-red-500 mt-0.5">
                  {errors.restaurant_id.message}
                </p>
              )}
            </div>

            {/* Availability Option Stacked Cleanly */}
            <div className="w-full flex flex-col gap-1.5 pt-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("menu.form.fieldStatus") || "AVAILABILITY STATUS"}
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-structure text-accent focus:ring-accent/20 bg-canvas transition-colors duration-200 checked:bg-accent"
                />
                <span className="text-sm font-medium text-text-main">
                  {t("menu.form.fieldAvailable")}
                </span>
              </label>
            </div>

          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1.5 }}>
          <Button
            type="button"
            onClick={onCancel} 
            variant="secondary"
          >
            {t("menu.form.btnCancel")}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isPending}
          >
            {isPending 
              ? t("menu.form.btnSaving") 
              : editingItem 
                ? t("menu.form.btnSaveEdit") 
                : t("menu.form.btnSaveCreate")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}