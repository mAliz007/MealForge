import { useFormContext } from "react-hook-form";
import { restaurantSchema } from "../../utils/schemas";
import type { RestaurantFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { EntityFormLayout } from "./layouts/EntityFormLayout";
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
        {/* Swapped text-gray-700 for text-muted */}
        <label htmlFor="status" className="text-xs font-semibold text-muted uppercase tracking-wider">
          Operating Status
        </label>
        
        {/* 
          Swapped bg-white -> bg-canvas
          Swapped border-gray-300 -> border-structure
          Swapped text-gray-900 -> text-main
          Swapped focus rings to leverage theme tokens safely
        */}
        <select
          id="status"
          className={`w-full px-3 py-2 bg-canvas border rounded-lg text-sm transition-shadow duration-200 focus:outline-none focus:ring-2 ${
            errors.status
              ? "border-red-500 focus:ring-red-500/20 text-red-500 bg-red-500/5"
              : "border-structure focus:border-accent focus:ring-accent/20 text-main"
          }`}
          {...register("status")}
        >
          {/* Option elements inherit native dark styles via browser standard, 
              but explicit class names ensure clean rendering across targets */}
          <option value="open" className="bg-structure text-main">Open</option>
          <option value="closed" className="bg-structure text-main">Closed</option>
        </select>
        
        {/* Validation Error Message */}
        {errors.status && (
          <p className="text-xs font-medium text-red-500 mt-0.5">{errors.status.message}</p>
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