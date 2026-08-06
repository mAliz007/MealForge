import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { AuthResponse, UserRole } from "../types/auth.ts";

export function useAuthUser() {
  const { data, isLoading, isError } = useQuery<AuthResponse, Error>({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    staleTime: Infinity, // Keep auth static unless explicitly logged out/invalidated
  });

  const userObject = data?.user;
  const role = userObject?.role;

  // Role checks
  const isAdmin = role === "admin";
  const isOwner = role === "owner";
  const isCustomer = role === "customer";

  // Helper method to check against an array of roles
  const hasRole = (allowedRoles: UserRole[]) => !!role && allowedRoles.includes(role);

  return {
    user: userObject,
    role,
    isAdmin,
    isOwner,
    isCustomer,
    hasRole,
    restaurantId: userObject?.restaurant_id ?? null,
    isLoading,
    isError,
  };
}