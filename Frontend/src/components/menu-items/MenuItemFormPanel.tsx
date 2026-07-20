import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { useRestaurants } from "../../hooks/useRestaurants";
import type { MenuItemFormData } from "../../utils/schemas";
import type { MenuItem } from "../../types";

interface MenuItemFormPanelProps {
  editingItem?: MenuItem;
  // This accepts the form schema data along with our supplementary availability parameter
  onSubmit: (data: MenuItemFormData & { available: boolean }) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function MenuItemFormPanel({ editingItem, onSubmit, onCancel, isPending }: MenuItemFormPanelProps) {
  const { data: restaurants } = useRestaurants();
  
  // Track availability explicitly via local state so it stays isolated from MenuItemFormData
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const { register, handleSubmit, reset } = useForm<MenuItemFormData>({
    defaultValues: editingItem 
      ? { name: editingItem.name, price: editingItem.price, restaurantId: editingItem.restaurantId }
      : { name: "", price: 0, restaurantId: undefined },
  });

  useEffect(() => {
    if (editingItem) {
      reset({
        name: editingItem.name,
        price: editingItem.price,
        restaurantId: editingItem.restaurantId,
      });
      setIsAvailable(editingItem.available);
    }
  }, [editingItem, reset]);

  const onFormSubmit = (formData: MenuItemFormData) => {
    // Merge the exact schema payload with our custom state key cleanly
    onSubmit({
      ...formData,
      available: isAvailable,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Item Name</label>
          <input
            {...register("name", { required: true })}
            type="text"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Price ($)</label>
          <input
            {...register("price", { required: true, valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 uppercase">Restaurant Owner</label>
          <select
            {...register("restaurantId", { required: true, valueAsNumber: true })}
            disabled={!!editingItem}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 disabled:opacity-60 focus:outline-none"
          >
            <option value="">Select corporate partner...</option>
            {restaurants?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center pt-6">
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 h-4 w-4"
            />
            List Item as Available Immediately
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? "Saving..." : editingItem ? "Apply Changes" : "Create Selection"}
        </Button>
      </div>
    </form>
  );
}