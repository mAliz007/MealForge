import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Box
} from "@mui/material";

import { useRestaurants } from "../../hooks/useRestaurants";
import type { MenuItemFormData } from "../../utils/schemas";
import type { MenuItem } from "../../types";

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
  const { data: restaurants } = useRestaurants();
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const { register, handleSubmit, reset, control } = useForm<MenuItemFormData>({
    defaultValues: editingItem
      ? { name: editingItem.name, price: editingItem.price, restaurantId: editingItem.restaurantId }
      : { name: "", price: 0, restaurantId: "" as any },
  });

  useEffect(() => {
    if (open) {
      if (editingItem) {
        reset({
          name: editingItem.name,
          price: editingItem.price,
          restaurantId: editingItem.restaurantId,
        });
        setIsAvailable(editingItem.available);
      } else {
        reset({ name: "", price: 0, restaurantId: "" as any });
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
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>
        {editingItem ? "Edit Menu Item" : "Create Menu Item"}
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            
            {/* Item Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("name", { required: "Item name is required" })}
                label="Item Name"
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Price */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                {...register("price", { 
                  required: "Price is required", 
                  valueAsNumber: true 
                })}
                label="Price ($)"
                type="number"
                slotProps={{ htmlInput: { step: "0.01" } }}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Restaurant Owner */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" disabled={!!editingItem}>
                <InputLabel id="restaurant-owner-label">Restaurant Owner</InputLabel>
                <Controller
                  name="restaurantId"
                  control={control}
                  rules={{ required: "Selecting a partner is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="restaurant-owner-label"
                      label="Restaurant Owner"
                      value={field.value ?? ""}
                    >
                      <MuiMenuItem value="">
                        <em>Select corporate partner...</em>
                      </MuiMenuItem>
                      {restaurants?.map((r) => (
                        <MuiMenuItem key={r.id} value={r.id}>
                          {r.name}
                        </MuiMenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Availability Option */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Available Immediately"
                />
              </Box>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onCancel} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={isPending}
          >
            {isPending ? "Saving..." : editingItem ? "Apply Changes" : "Create Selection"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}