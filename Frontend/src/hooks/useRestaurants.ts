import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "../services/restaurantService";
import type { Restaurant } from "../types";
import type { RestaurantFormData } from "../utils/schemas";

// Query keys factory dictionary
export const restaurantKeys = {
  all: ["restaurants"] as const,
};

// Hook to Fetch List
export function useRestaurants() {
  return useQuery<Restaurant[], Error>({
    queryKey: restaurantKeys.all,
    queryFn: restaurantService.getAll,
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