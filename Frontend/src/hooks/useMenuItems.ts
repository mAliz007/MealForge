// frontend/src/hooks/useMenuItems.ts
import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { menuItemService, type MenuItemsFilters } from "../services/menuItemService";
import type { MenuItem } from "../types";
import type { MenuItemFormData } from "../utils/schemas";

export const menuQueryKeys = {
  all: ["menu_items"] as const,
  lists: () => [...menuQueryKeys.all, "list"] as const,
  list: (filters: MenuItemsFilters) => [...menuQueryKeys.lists(), filters] as const,
  detail: (id: number) => [...menuQueryKeys.all, "detail", id] as const,
};

// Accept TanStack configuration parameters as an optional second argument
export function useMenuItems(
  filters: MenuItemsFilters = {},
  options?: Omit<UseQueryOptions<MenuItem[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<MenuItem[], Error>({
    queryKey: menuQueryKeys.list(filters),
    queryFn: () => menuItemService.getAll(filters),
    staleTime: 1000 * 30, 
    ...options, // Safely merges the enabled flag configuration down
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, MenuItemFormData>({
    mutationFn: (data) => menuItemService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuQueryKeys.lists() });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation<MenuItem, Error, { id: number; data: Partial<MenuItemFormData> }>({
    mutationFn: ({ id, data }) => menuItemService.update(id, data),
    onSuccess: (updatedItem) => {
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