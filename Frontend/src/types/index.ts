// frontend/src/types/index.ts

export type Restaurant = {
  id: number;
  name: string;
  location: string;
  status: "active" | "inactive";
};

export type MenuItem = {
  id: number;
  restaurantId: number;
  name: string;
  description?: string;
  price: number;
  available: boolean;
};

export type Order = {
  id: number;
  restaurantId: number;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
};