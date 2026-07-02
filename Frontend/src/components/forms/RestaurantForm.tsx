import { useFormContext } from "react-hook-form";
import { restaurantSchema } from "../../utils/schemas";
import type { RestaurantFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { EntityFormLayout } from "./layouts/EntityFormLayout";
// Import the interface from your centralized types hub
import type { RestaurantFormProps } from "../../types";

function RestaurantFields() {
  const { register, formState: { errors } } = useFormContext<RestaurantFormData>();

  return (
    <>
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
    </>
  );
}

export function RestaurantForm({ defaultValues, onSubmitSuccess, onCancel }: RestaurantFormProps) {
  return (
    <EntityFormLayout<RestaurantFormData>
      schema={restaurantSchema}
      defaultValues={defaultValues}
      onSubmitSuccess={onSubmitSuccess}
      onCancel={onCancel}
      submitButtonText={defaultValues ? "Save Changes" : "Create Restaurant"}
    >
      <RestaurantFields />
    </EntityFormLayout>
  );
}