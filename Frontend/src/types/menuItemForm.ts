import type { MenuItemFormData } from "../utils/schemas";

export type MenuItemFormInput = {
  name: string;
  price: string;
  restaurant_id: string;
};

export interface MenuItemFormProps {
  defaultValues?: MenuItemFormData;
  onSubmitSuccess: (data: MenuItemFormData) => void;
  onCancel?: () => void;
}