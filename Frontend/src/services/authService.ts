import { apiClient } from './apiClient'

// We will refine these types as you grow your user models
export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const authService = {
  login: async (credentials: Record<string, any>): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/login', credentials)
    return response.data
  },

  register: async (userData: Record<string, any>): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v1/auth/register', userData)
    return response.data
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/v1/auth/logout')
    return response.data
  },

  getCurrentUser: async (): Promise<any> => {
  // Triggers GET /api/v1/auth/me using your authenticated apiClient
  const response = await apiClient.get('/v1/auth/me');
  return response.data; // This returns the { user: ... } payload from your Rails serializer
 }
}