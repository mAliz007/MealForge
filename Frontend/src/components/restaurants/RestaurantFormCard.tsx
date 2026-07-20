import { Card } from "../ui/Card";
import { RestaurantForm } from "../forms/RestaurantForm";
import type { Restaurant } from "../../types";
import type { RestaurantFormData } from "../../utils/schemas";

interface RestaurantFormCardProps {
  editingRestaurant?: Restaurant;
  onSubmit: (formData: RestaurantFormData) => void;
  onCancel: () => void;
}

export function RestaurantFormCard({
  editingRestaurant,
  onSubmit,
  onCancel,
}: RestaurantFormCardProps) {
  
  const formDefaults: RestaurantFormData | undefined = editingRestaurant
    ? {
        name: editingRestaurant.name,
        location: editingRestaurant.location,
        status: editingRestaurant.status, // Direct mapping! No conversion needed.
      }
    : undefined;

  return (
    <Card className="max-w-xl border-blue-200 bg-blue-50/10">
      <h2 className="text-base font-bold text-gray-900 mb-4">
        {editingRestaurant
          ? `Modify: ${editingRestaurant.name}`
          : "Register New Dining Partner"}
      </h2>
      <RestaurantForm
        defaultValues={formDefaults}
        onSubmitSuccess={onSubmit}
        onCancel={onCancel}
      />
    </Card>
  );
}