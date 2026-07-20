import { apiClient } from "./apiClient"; // Adjust this path to match your layout
import type { MenuItem } from "../types";
import type { MenuItemFormData } from "../utils/schemas";

export interface MenuItemsFilters {
  restaurant_id?: string | number;
  available?: boolean | string;
}

export const menuItemService = {
  getAll: async (filters?: MenuItemsFilters): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>("/v1/menu_items", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<MenuItem> => {
    const response = await apiClient.get<MenuItem>(`/v1/menu_items/${id}`);
    return response.data;
  },

  create: async (data: MenuItemFormData): Promise<MenuItem> => {
    // Wraps payload in "menu_item" object to satisfy Rails strong params require(:menu_item)
    const response = await apiClient.post<MenuItem>("/v1/menu_items", {
      menu_item: data,
    });
    return response.data;
  },

  update: async (id: number, data: Partial<MenuItemFormData>): Promise<MenuItem> => {
    const response = await apiClient.put<MenuItem>(`/v1/menu_items/${id}`, {
      menu_item: data,
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/menu_items/${id}`);
  },
};