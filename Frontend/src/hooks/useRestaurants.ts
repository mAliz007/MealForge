import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { restaurantService } from "../services/restaurantService";
import type { RestaurantFormData } from "../utils/schemas";
import type { Restaurant } from "../types";
import type { PaginatedResponse } from "../types/PagyType";

// Query keys factory dictionary including restaurantId
export const restaurantKeys = {
  all: ["restaurants"] as const,
  list: (page: number, limit: number, search: string = "", restaurantId?: number | null) =>
    ["restaurants", "list", { page, limit, search, restaurantId }] as const,
};

// Hook to Fetch List (Supports Pagination + Search + Role Scoping + Query Options)
export function useRestaurants(
  page = 1,
  limit = 20,
  search = "",
  restaurantId?: number | null,
  options?: Omit<UseQueryOptions<PaginatedResponse<Restaurant>, Error>, "queryKey" | "queryFn">
) {
  return useQuery<PaginatedResponse<Restaurant>, Error>({
    queryKey: restaurantKeys.list(page, limit, search, restaurantId),
    queryFn: () => restaurantService.getAll(page, limit, search),
    placeholderData: (previousData) => previousData,
    ...options,
  });
}

// Hook to Create
export function useCreateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
}

// Hook to Update
export function useUpdateRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RestaurantFormData }) =>
      restaurantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
}

// Hook to Delete
export function useDeleteRestaurant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restaurantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all });
    },
  });
}