// frontend/src/components/forms/MenuItemForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema, type MenuItemFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { mockRestaurants } from "../../utils/mockData";

// Define the shape matching exactly what HTML input elements yield
type MenuItemFormInput = {
  name: string;
  price: string;
  restaurantId: string;
};

interface MenuItemFormProps {
  defaultValues?: MenuItemFormData;
  onSubmitSuccess: (data: MenuItemFormData) => void;
  onCancel?: () => void;
}

export function MenuItemForm({ defaultValues, onSubmitSuccess, onCancel }: MenuItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemFormInput>({
    // We explicitly cast the zodResolver to match our HTML input format expectations
    resolver: zodResolver(menuItemSchema) as any,
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      price: defaultValues.price.toString(),
      restaurantId: defaultValues.restaurantId.toString(),
    } : undefined,
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        price: defaultValues.price.toString(),
        restaurantId: defaultValues.restaurantId.toString(),
      });
    }
  }, [defaultValues, reset]);

  // The onSubmit wrapper parses out the perfectly coerced data contract safely
  const handleFormSubmit = (data: any) => {
    onSubmitSuccess(data as MenuItemFormData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 w-full">
      <Input
        label="Menu Item Name"
        id="name"
        type="text"
        placeholder="e.g. Garlic Parmesan Fries"
        error={errors.name?.message}
        {...register("name")}
      />
      
      <Input
        label="Price ($)"
        id="price"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.price?.message}
        {...register("price")}
      />

      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="restaurantId" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Assign to Restaurant
        </label>
        <select
          id="restaurantId"
          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.restaurantId
              ? "border-red-500 focus:ring-red-200 text-red-900"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 text-gray-900"
          }`}
          {...register("restaurantId")}
        >
          <option value="">Select a restaurant...</option>
          {mockRestaurants.map((res) => (
            <option key={res.id} value={res.id}>
              {res.name}
            </option>
          ))}
        </select>
        {errors.restaurantId && (
          <p className="text-xs font-medium text-red-600 mt-0.5">
            {errors.restaurantId.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {defaultValues ? "Save Item" : "Add Menu Item"}
        </Button>
      </div>
    </form>
  );
}