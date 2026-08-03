export type UserRole = 'customer' | 'owner' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  restaurant_id?: number | null; // Present when role is 'owner'
}

export interface AuthResponse {
  user: User;
  message?: string;
}