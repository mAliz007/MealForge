import { apiClient } from "./apiClient";
import type { Order } from "../types";

export interface OrderItemInput {
  menu_item_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  restaurant_id: number;
  order_items: OrderItemInput[];
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>("/v1/orders");
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/v1/orders/${id}`);
    return response.data;
  },

  create: async (payload: CreateOrderPayload): Promise<Order> => {
    // Wraps payload in "order" object to satisfy Rails strong params require(:order)
    const response = await apiClient.post<Order>("/v1/orders", {
      order: payload,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/orders/${id}`);
  },
};