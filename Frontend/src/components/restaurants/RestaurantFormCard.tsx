import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { RestaurantForm } from "../forms/RestaurantForm";
import type { Restaurant } from "../../types";
import type { RestaurantFormData } from "../../utils/schemas";
import { useTranslation } from "react-i18next";

interface RestaurantFormModalProps {
  open: boolean; // Controls whether the modal is visible
  editingRestaurant?: Restaurant;
  onSubmit: (formData: RestaurantFormData) => void;
  onCancel: () => void;
}

export function RestaurantFormCard({
  open,
  editingRestaurant,
  onSubmit,
  onCancel,
}: RestaurantFormModalProps) {
  const { t } = useTranslation();
  
  const formDefaults: RestaurantFormData | undefined = editingRestaurant
    ? {
        name: editingRestaurant.name,
        location: editingRestaurant.location,
        status: editingRestaurant.status,
      }
    : undefined;

  return (
    <Dialog 
      open={open} 
      onClose={onCancel} // Correctly using onCancel from props here
      fullWidth 
      maxWidth="sm"
      // Fixed: Migrated PaperProps configuration into slotProps.paper for MUI v6/v7
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--color-structure)",
            backgroundImage: "none", // Prevent MUI dark-mode gradient overlays
            color: "var(--color-text-main)",
            borderRadius: "12px",
            border: "1px solid var(--color-structure)",
          }
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "var(--color-text-main)" }}>
        {editingRestaurant
          ? t("restaurants.formCard.modifyTitle", { name: editingRestaurant.name })
          : t("restaurants.formCard.registerTitle")}
      </DialogTitle>
      
      <DialogContent 
        dividers 
        sx={{ 
          p: 3,
          borderColor: "rgba(255, 255, 255, 0.08)",
          color: "var(--color-text-main)"
        }}
      >
        <RestaurantForm
          defaultValues={formDefaults}
          onSubmitSuccess={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}