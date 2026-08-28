export type UserRole = 'customer' | 'owner' | 'admin' | 'staff';

export interface RestaurantRole {
  id: number;
  name: string;
}

export interface RestaurantAccess {
  restaurant_id: number;
  restaurant_name: string;
  role: RestaurantRole;
  permissions: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  restaurant_id?: number | null; // Present when role is 'owner'
  restaurant_access?: RestaurantAccess[]; // Present when role is 'staff' or 'owner'
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface Permission {
  id: number;
  key: string;
  description?: string;
}

export interface CustomRole {
  id: number;
  name: string;
  system_key?: string | null;
  permissions: string[];
}

export interface StaffMember {
  membership_id: number;
  user_id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  role: RestaurantRole;
}