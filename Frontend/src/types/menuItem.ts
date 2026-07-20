export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  price: number;
  available: boolean;
};