import { apiClient } from './apiClient'
import type { LoginFormData, RegisterFormData } from '../utils/schemas'
import type { AuthResponse } from '../types/auth.ts'

export const authService = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', credentials)
    return response.data
  },

  // Strictly typed to enforce name, email, and password properties
  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', userData)
    return response.data
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/v1/auth/logout')
    return response.data
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get('/v1/auth/me')
    return response.data
  }
}