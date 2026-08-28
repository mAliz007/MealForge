import { apiClient } from './apiClient'
import type { LoginFormData, RegisterFormData } from '../utils/schemas'
import type { AuthResponse } from '../types/auth.ts'

// Types for Admin Registration
export interface AdminRegisterFormData {
  user: {
    name: string
    email: string
    password: string
  }
  restaurant: {
    name: string
    location?: string
    address?: string
    status?: string
  }
}

export const authService = {
  // --- Customer Auth Methods ---
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', credentials)
    return response.data
  },

  register: async (userData: RegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', userData)
    return response.data
  },

  // --- Restaurant Admin / Owner Auth Methods ---
  loginAdmin: async (credentials: LoginFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/admin/login', credentials)
    return response.data
  },

  registerAdmin: async (adminData: AdminRegisterFormData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/admin/register', adminData)
    return response.data
  },

  // --- Shared Auth Methods ---
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/v1/auth/logout')
    return response.data
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiClient.get<AuthResponse>('/v1/auth/me')
    return response.data
  }
}