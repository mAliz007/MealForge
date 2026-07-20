export type Order = {
  id: number;
  restaurantId: number;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
};