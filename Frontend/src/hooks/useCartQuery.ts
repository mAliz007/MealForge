import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  fetchCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  type AddItemPayload,
  type UpdateQuantityPayload,
  type CartResponse,
  type CartConflictError,
} from '../services/cartApi'

export const CART_QUERY_KEY = ['cart']

/**
 * Hook to fetch and watch the user's cart
 */
export const useCart = (isAuthenticated: boolean = true) => {
  return useQuery<CartResponse>({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: isAuthenticated, // Only fetch automatically if user is logged in
    staleTime: 1000 * 60 * 5,  // 5 minutes cache
  })
}

/**
 * Hook to add an item to the cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, Error | CartConflictError, AddItemPayload>({
    mutationFn: addItemToCart,
    onSuccess: (data) => {
      // Instantly update query cache with new cart data
      queryClient.setQueryData(CART_QUERY_KEY, data)
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        // Return structured conflict error for component modal handling
        return Promise.reject(error.response.data as CartConflictError)
      }
    },
  })
}

/**
 * Hook to update quantity of an existing item
 */
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient()

  return useMutation<
    CartResponse,
    Error,
    { menuItemId: number; payload: UpdateQuantityPayload }
  >({
    mutationFn: ({ menuItemId, payload }) =>
      updateCartItemQuantity(menuItemId, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data)
    },
  })
}

/**
 * Hook to remove a single item from the cart
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, Error, number>({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data)
    },
  })
}

/**
 * Hook to clear the entire cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient()

  return useMutation<CartResponse, Error, void>({
    mutationFn: clearCart,
    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data)
    },
  })
}