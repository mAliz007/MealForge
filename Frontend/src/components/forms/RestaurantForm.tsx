// frontend/src/components/forms/RestaurantForm.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantSchema, type RestaurantFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface RestaurantFormProps {
  defaultValues?: RestaurantFormData;
  onSubmitSuccess: (data: RestaurantFormData) => void;
  onCancel?: () => void;
}

export function RestaurantForm({ defaultValues, onSubmitSuccess, onCancel }: RestaurantFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues,
  });

  // Keep the form updated if the default values change (like selecting a different row to edit)
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmitSuccess)} className="space-y-4 w-full">
      <Input
        label="Restaurant Name"
        id="name"
        type="text"
        placeholder="e.g. The Gourmet Burger Hub"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Location"
        id="location"
        type="text"
        placeholder="e.g. Downtown Sector A"
        error={errors.location?.message}
        {...register("location")}
      />
      
      <div className="w-full flex flex-col gap-1.5">
        <label htmlFor="status" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Operating Status
        </label>
        <select
          id="status"
          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
            errors.status
              ? "border-red-500 focus:ring-red-200 text-red-900"
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 text-gray-900"
          }`}
          {...register("status")}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="text-xs font-medium text-red-600 mt-0.5">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {defaultValues ? "Save Changes" : "Create Restaurant"}
        </Button>
      </div>
    </form>
  );
}