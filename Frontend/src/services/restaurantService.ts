import { apiClient } from "./apiClient";
import type { Restaurant } from "../types";
import type { RestaurantFormData } from "../utils/schemas";

export const restaurantService = {
  // GET /api/v1/restaurants
  getAll: async (): Promise<Restaurant[]> => {
    const response = await apiClient.get<Restaurant[]>("/v1/restaurants");
    return response.data;
  },

  // POST /api/v1/restaurants
  create: async (data: RestaurantFormData): Promise<Restaurant> => {
    // Wrap payload in a 'restaurant' key for Rails strong params
    const response = await apiClient.post<Restaurant>("/v1/restaurants", {
      restaurant: data,
    });
    return response.data;
  },

  // PUT /api/v1/restaurants/:id
  update: async (id: number, data: RestaurantFormData): Promise<Restaurant> => {
    // Wrap payload in a 'restaurant' key for Rails strong params
    const response = await apiClient.put<Restaurant>(`/v1/restaurants/${id}`, {
      restaurant: data,
    });
    return response.data;
  },

  // DELETE /api/v1/restaurants/:id
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/restaurants/${id}`);
  },
};