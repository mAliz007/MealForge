import { apiClient } from "./apiClient";
import type { MenuItem } from "../types";
import type { MenuItemFormData } from "../utils/schemas";
import type { PaginatedResponse } from "../types/PagyType";

export interface MenuItemsFilters {
  restaurant_id?: string | number;
  available?: boolean | string;
  search?: string;
  page?: number;
  limit?: number;
}

export const menuItemService = {
  getAll: async (filters?: MenuItemsFilters): Promise<PaginatedResponse<MenuItem>> => {
    const response = await apiClient.get<PaginatedResponse<MenuItem>>("/v1/menu_items", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<MenuItem> => {
    const response = await apiClient.get<MenuItem>(`/v1/menu_items/${id}`);
    return response.data;
  },

  create: async (data: MenuItemFormData | FormData): Promise<MenuItem> => {
    let payload: any;
    let headers: Record<string, string> = {};

    if (data instanceof FormData) {
      // Wrap FormData keys into menu_item[...] format if not already formatted
      const formattedData = new FormData();
      data.forEach((value, key) => {
        if (key.startsWith("menu_item[")) {
          formattedData.append(key, value);
        } else {
          formattedData.append(`menu_item[${key}]`, value);
        }
      });
      payload = formattedData;
      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = { menu_item: data };
    }

    const response = await apiClient.post<MenuItem>("/v1/menu_items", payload, { headers });
    return response.data;
  },

  update: async (id: number, data: Partial<MenuItemFormData> | FormData): Promise<MenuItem> => {
    let payload: any;
    let headers: Record<string, string> = {};

    if (data instanceof FormData) {
      // Wrap FormData keys into menu_item[...] format if not already formatted
      const formattedData = new FormData();
      data.forEach((value, key) => {
        if (key.startsWith("menu_item[")) {
          formattedData.append(key, value);
        } else {
          formattedData.append(`menu_item[${key}]`, value);
        }
      });
      payload = formattedData;
      headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = { menu_item: data };
    }

    const response = await apiClient.put<MenuItem>(`/v1/menu_items/${id}`, payload, { headers });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/menu_items/${id}`);
  },
};