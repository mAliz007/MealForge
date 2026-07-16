import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { RestaurantForm } from "../forms/RestaurantForm";
import type { Restaurant } from "../../types";
import type { RestaurantFormData } from "../../utils/schemas";

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
  
  const formDefaults: RestaurantFormData | undefined = editingRestaurant
    ? {
        name: editingRestaurant.name,
        location: editingRestaurant.location,
        status: editingRestaurant.status, // Direct mapping! No conversion needed.
      }
    : undefined;

  return (
    <Dialog 
      open={open} 
      onClose={onCancel} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {editingRestaurant
          ? `Modify: ${editingRestaurant.name}`
          : "Register New Dining Partner"}
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        {/* We let your nested form handle inputs, validation, and actions */}
        <RestaurantForm
          defaultValues={formDefaults}
          onSubmitSuccess={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}