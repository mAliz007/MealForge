import type { MenuItem } from '../types'
import { apiClient } from './apiClient'


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
  const { data } = await apiClient.get<CartResponse>('/v1/cart')
  return data
}


export const addItemToCart = async (
  payload: AddItemPayload
): Promise<CartResponse> => {
  const { data } = await apiClient.post<CartResponse>('/v1/cart/items', payload)
  return data
}


export const updateCartItemQuantity = async (
  menuItemId: number,
  payload: UpdateQuantityPayload
): Promise<CartResponse> => {
  const { data } = await apiClient.patch<CartResponse>(
    `/v1/cart/items/${menuItemId}`,
    payload
  )
  return data
}


export const removeCartItem = async (
  menuItemId: number
): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>(
    `/v1/cart/items/${menuItemId}`
  )
  return data
}

export const clearCart = async (): Promise<CartResponse> => {
  const { data } = await apiClient.delete<CartResponse>('/v1/cart')
  return data
}