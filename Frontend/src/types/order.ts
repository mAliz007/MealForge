export type Order = {
  id: number;
  restaurant_id: number;
  status: "pending" | "confirmed" | "cancelled";
  total_amount: number;
};