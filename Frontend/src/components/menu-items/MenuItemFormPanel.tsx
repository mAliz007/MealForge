import { useEffect, useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { useRestaurants } from "../../hooks/useRestaurants";
import { useAuthUser } from "../../hooks/useAuthUser";
import type { MenuItemFormData } from "../../utils/schemas";
import type { MenuItem } from "../../types";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface MenuItemFormModalProps {
  open: boolean;
  editingItem?: MenuItem;
  onSubmit: (data: MenuItemFormData & { available: boolean; imageFile?: File | null }) => void;
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
  const { isOwner, user } = useAuthUser();
  
  // Image selection and preview state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Safely extract the restaurant ID regardless of property casing or nesting
  const ownerRestaurantId = 
    (user as any)?.restaurant_id ?? 
    (user as any)?.restaurantId ?? 
    (user as any)?.restaurant?.id;

  // Fetch up to 30 restaurants for admin selection dropdown
  const { data: response } = useRestaurants(1, 30);
  const restaurantList = response?.data;
  const meta = response?.meta;
  const hasMore = meta && meta.count > 30;

  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  // Determine initial restaurant ID (Owner's ID if owner, or editing item ID)
  const defaultRestId = editingItem 
    ? editingItem.restaurant_id 
    : (isOwner && ownerRestaurantId ? String(ownerRestaurantId) : "");

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<MenuItemFormData>({
    defaultValues: {
      name: editingItem?.name || "",
      price: editingItem?.price || 0,
      restaurant_id: defaultRestId as any,
    },
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
        setImagePreview(editingItem.image_url || null);
        setSelectedFile(null);
      } else {
        const initialRestId = isOwner && ownerRestaurantId ? String(ownerRestaurantId) : "";
        reset({ name: "", price: 0, restaurant_id: initialRestId as any });
        setIsAvailable(true);
        setImagePreview(null);
        setSelectedFile(null);
      }
    }
  }, [editingItem, reset, open, isOwner, ownerRestaurantId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const onFormSubmit = (formData: MenuItemFormData) => {
    // Fallback check to ensure owner's restaurant_id is always present
    const finalData = {
      ...formData,
      restaurant_id: isOwner && ownerRestaurantId ? (ownerRestaurantId as any) : formData.restaurant_id,
      available: isAvailable,
      imageFile: selectedFile,
    };
    onSubmit(finalData);
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
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "var(--color-text-main)" }}>
        {editingItem ? t("menu.form.titleEdit", "Edit Menu Item") : t("menu.form.titleCreate", "Add Menu Item")}
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

            {/* Image Picker */}
            <div className="w-full flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("menu.form.fieldImage", "Menu Item Image")}
              </label>

              <div className="flex items-center gap-4">
                {/* Preview Box */}
                <div className="w-20 h-20 rounded-xl bg-canvas border border-text-muted/20 overflow-hidden flex items-center justify-center shrink-0">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-text-muted/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>

                {/* Upload Action Controls */}
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas border border-text-muted/20 hover:bg-structure/80 cursor-pointer transition-colors text-text-main">
                    <span>{imagePreview ? t("menu.form.btnChangeImage", "Change Image") : t("menu.form.btnUploadImage", "Upload Image")}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-left text-xs text-red-500 hover:underline"
                    >
                      {t("menu.form.btnRemoveImage", "Remove Image")}
                    </button>
                  )}

                  <p className="text-[10px] text-text-muted">
                    {t("menu.form.imageConstraints", "JPEG, PNG, or WebP (max 5MB)")}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Item Name */}
            <Input
              label={t("menu.form.fieldName", "Name")}
              id="name"
              type="text"
              error={errors.name?.message}
              {...register("name", { required: t("menu.form.validation.nameRequired", "Name is required") })}
            />

            {/* Price */}
            <Input
              label={t("menu.form.fieldPrice", "Price ($)")}
              id="price"
              type="number"
              step="0.01"
              error={errors.price?.message}
              {...register("price", { 
                required: t("menu.form.validation.priceRequired", "Price is required"), 
                valueAsNumber: true 
              })}
            />

            {/* Restaurant Selection: Dropdown for Admins, Auto-Bound Badge for Owners */}
            <div className="w-full flex flex-col gap-1.5">
              <label 
                htmlFor="restaurant_id" 
                className="text-xs font-semibold text-text-muted uppercase tracking-wider"
              >
                {t("menu.form.fieldRestaurant", "Restaurant")}
              </label>

              {isOwner ? (
                <div className="w-full px-3 py-2 bg-canvas/60 border border-text-muted/20 rounded-lg text-sm text-text-muted flex justify-between items-center">
                  <span>{t("menu.form.ownerAutoAssigned", "Assigned to your restaurant")}</span>
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    ID: {ownerRestaurantId ?? "N/A"}
                  </span>
                </div>
              ) : (
                <Controller
                  name="restaurant_id"
                  control={control}
                  rules={{ required: t("menu.form.validation.restaurantRequired", "Restaurant selection is required") }}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="restaurant_id"
                      disabled={!!editingItem}
                      value={field.value ?? ""}
                      className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[right_0.5rem_center] bg-[length:1.25em_1.25em] bg-no-repeat pr-10 ${
                        errors.restaurant_id
                          ? "border-red-500 focus:ring-red-500/20 text-red-500"
                          : "border-text-muted/20 focus:border-brand-primary focus:ring-brand-primary/20 text-text-main"
                      }`}
                    >
                      <option value="" className="bg-canvas">{t("menu.form.selectPlaceholder", "-- Select Restaurant --")}</option>
                      {restaurantList?.map((r) => (
                        <option key={r.id} value={r.id} className="bg-canvas">
                          {r.name}
                        </option>
                      ))}
                      {hasMore && (
                        <option value="" disabled className="bg-canvas text-text-muted italic">
                          ──────────
                          (Showing 30 of {meta.count})
                        </option>
                      )}
                    </select>
                  )}
                />
              )}

              {errors.restaurant_id && !isOwner && (
                <p className="text-xs font-medium text-red-500 mt-0.5">
                  {errors.restaurant_id.message}
                </p>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="w-full flex flex-col gap-1.5 pt-1">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                {t("menu.form.fieldStatus", "AVAILABILITY STATUS")}
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 rounded border-text-muted/30 text-brand-primary focus:ring-brand-primary/20 bg-canvas transition-colors duration-200 checked:bg-brand-primary"
                />
                <span className="text-sm font-medium text-text-main">
                  {t("menu.form.fieldAvailable", "Available for order")}
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
            {t("menu.form.btnCancel", "Cancel")}
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isPending}
          >
            {isPending 
              ? t("menu.form.btnSaving", "Saving...") 
              : editingItem 
                ? t("menu.form.btnSaveEdit", "Save Changes") 
                : t("menu.form.btnSaveCreate", "Create Item")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}