export type MenuItem = {
  id: number;
  restaurant_id: number;
  name: string;
  description?: string;
  price: number;
  available: boolean;
};