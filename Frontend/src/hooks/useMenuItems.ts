import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuItemService, type MenuItemsFilters } from "../services/menuItemService";
import type { MenuItem } from "../types";
import type { MenuItemFormData } from "../utils/schemas";

// Query Key Factory for structural caching
export const menuQueryKeys = {
  all: ["menu_items"] as const,
  lists: () => [...menuQueryKeys.all, "list"] as const,
  list: (filters: MenuItemsFilters) => [...menuQueryKeys.lists(), filters] as const,
  detail: (id: number) => [...menuQueryKeys.all, "detail", id] as const,
};

export function useMenuItems(filters: MenuItemsFilters = {}) {
  return useQuery<MenuItem[], Error>({
    queryKey: menuQueryKeys.list(filters),
    queryFn: () => menuItemService.getAll(filters),
    // Keeps cache fresh but prevents excessive refetching while typing/filtering
    staleTime: 1000 * 30, 
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation<MenuItem, Error, MenuItemFormData>({
    mutationFn: (data) => menuItemService.create(data),
    onSuccess: () => {
      // Invalidates all menu lists to update table metrics globally
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation<MenuItem, Error, { id: number; data: Partial<MenuItemFormData> }>({
    mutationFn: ({ id, data }) => menuItemService.update(id, data),
    onSuccess: (updatedItem) => {
      // Multi-layer cache bursting: updates active list collections and targeted unique detail caches
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.detail(updatedItem.id) });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => menuItemService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: menuQueryKeys.detail(id) });
    },
  });
}