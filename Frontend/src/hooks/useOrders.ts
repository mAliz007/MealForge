import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, type CreateOrderPayload } from "../services/orderService";
import type { Order } from "../types";
import { STALE_TIME_10_SECONDS } from "../constants/config";

export const orderQueryKeys = {
  all: ["orders"] as const,
  lists: () => [...orderQueryKeys.all, "list"] as const,
  listWithParams: (params: Record<string, unknown>) => [...orderQueryKeys.lists(), params] as const,
  detail: (id: number) => [...orderQueryKeys.all, "detail", id] as const,
};

export function useOrders() {
  return useQuery<Order[], Error>({
    queryKey: orderQueryKeys.lists(),
    queryFn: () => orderService.getAll(),
    staleTime: STALE_TIME_10_SECONDS, // Orders are live data; keep stale time slightly lower
  });
}

export function useOrderDetails(id: number) {
  return useQuery<Order, Error>({
    queryKey: orderQueryKeys.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderPayload>({
    mutationFn: (payload) => orderService.create(payload),
    onSuccess: () => {
      // Clear order caches to instantly list new pending checkout entries
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { id: number; status: string }>({
    mutationFn: ({ id, status }) => orderService.update(id, { status }),
    onSuccess: (_, variables) => {
      // Refetch all order lists and clear specific order cache
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => orderService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: orderQueryKeys.detail(id) });
    },
  });
}