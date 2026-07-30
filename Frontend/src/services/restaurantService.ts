import { apiClient } from "./apiClient";
import type { RestaurantFormData } from "../utils/schemas";
import type { PaginatedResponse } from "../types/PagyType";
import type { Restaurant } from "../types";
import type { SuggestionItem } from "../types/search";

export const restaurantService = {
  // GET /api/v1/restaurants?page=1&limit=20&search=term
  getAll: async (
    page = 1,
    limit = 20,
    search = ""
  ): Promise<PaginatedResponse<Restaurant>> => {
    const response = await apiClient.get<PaginatedResponse<Restaurant>>("/v1/restaurants", {
      params: {
        page,
        limit,
        ...(search.trim() && { search: search.trim() }),
      },
    });
    return response.data;
  },

  // POST /api/v1/restaurants
  create: async (data: RestaurantFormData): Promise<Restaurant> => {
    const response = await apiClient.post<Restaurant>("/v1/restaurants", {
      restaurant: data,
    });
    return response.data;
  },

  // PUT /api/v1/restaurants/:id
  update: async (id: number, data: RestaurantFormData): Promise<Restaurant> => {
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

export const fetchRestaurantAutocomplete = async (
  query: string,
  signal?: AbortSignal
): Promise<SuggestionItem[]> => {
  const response = await apiClient.get<SuggestionItem[]>(
    "/v1/restaurants/autocomplete",
    {
      params: { q: query },
      signal,
    }
  );
  return response.data;
};