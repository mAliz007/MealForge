import axios from 'axios'
import type { MenuItem } from '../types'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // CRUCIAL: Instructs the browser to automatically attach and accept cookies
  // during cross-origin handshakes with your Rails backend
  withCredentials: true,
})


export interface CartItem {
  id?: number
  menuItem: MenuItem
  quantity: number
}

export interface CartResponse {
  restaurantId: number | null
  cartItems: CartItem[]
}

export interface AddItemPayload {
  menu_item_id: number
  quantity: number
  replace_if_conflict?: boolean
}

export interface UpdateQuantityPayload {
  quantity: number
}

// Error payload format returned on 422 conflict
export interface CartConflictError {
  error: 'restaurant_conflict'
  message: string
}


export const fetchCart = async (): Promise<CartResponse> => {
  const { data } = await apiClient.get<CartResponse>('/cart')
  return data
}


export const addItemToCart = async (
  payload: AddItemPayload
): Promise<CartResponse> => {
  const { data } = await apiClient.post<CartResponse>('/cart/items', payload)
  return data
}


export const updateCartItemQuantity = async (
  menuItemId: number,
  payload: UpdateQuantityPayload
): Promise<CartResponse> => {
  const { data } = await apiClient.patch<CartResponse>(
    `/cart/items/${menuItemId}`,
    payload
  )
  return data
}


export const removeCartItem = async (
  menuItemId: number
): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>(
    `/cart/items/${menuItemId}`
  )
  return data
}

export const clearCart = async (): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>('/cart')
  return data
}