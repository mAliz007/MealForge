import type { MenuItemFormData } from "../utils/schemas";

export type MenuItemFormInput = {
  name: string;
  price: string;
  restaurantId: string;
};

export interface MenuItemFormProps {
  defaultValues?: MenuItemFormData;
  onSubmitSuccess: (data: MenuItemFormData) => void;
  onCancel?: () => void;
}