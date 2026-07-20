import { useFormContext } from "react-hook-form";
import { menuItemSchema } from "../../utils/schemas";
import type { MenuItemFormData } from "../../utils/schemas";
import { Input } from "../ui/Input";
import { mockRestaurants } from "../../utils/mockData";
import { EntityFormLayout } from "./layouts/EntityFormLayout";
// Import the types from your centralized types hub
import type { MenuItemFormInput, MenuItemFormProps } from "../../types";

function MenuItemFields() {
  const { register, formState: { errors } } = useFormContext<MenuItemFormInput>();

  return (
    <>
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
    </>
  );
}

export function MenuItemForm({ defaultValues, onSubmitSuccess, onCancel }: MenuItemFormProps) {
  const transformedDefaults = defaultValues
    ? {
        name: defaultValues.name,
        price: defaultValues.price.toString(),
        restaurantId: defaultValues.restaurantId.toString(),
      }
    : undefined;

  const handleFormSubmit = (data: any) => {
    onSubmitSuccess(data as MenuItemFormData);
  };

  return (
    <EntityFormLayout<MenuItemFormInput>
      schema={menuItemSchema}
      defaultValues={transformedDefaults}
      onSubmitSuccess={handleFormSubmit}
      onCancel={onCancel}
      submitButtonText={defaultValues ? "Save Item" : "Add Menu Item"}
    >
      <MenuItemFields />
    </EntityFormLayout>
  );
}