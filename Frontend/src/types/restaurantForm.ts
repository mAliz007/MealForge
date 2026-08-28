import type { RestaurantFormData } from "../utils/schemas";

export interface RestaurantFormProps {
  defaultValues?: RestaurantFormData;
  onSubmitSuccess: (data: RestaurantFormData) => void;
  onCancel?: () => void;
}