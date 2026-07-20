import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { AuthResponse } from "../types/auth.ts";

export function useAuthUser() {
  const { data, isLoading } = useQuery<AuthResponse, Error>({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    staleTime: Infinity, // Keep auth static unless explicitly logged out/invalidated
  });

  const userObject = data?.user;
  const role = userObject?.role;
  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

  return {
    user: userObject,
    role,
    isAdmin,
    isCustomer,
    isLoading,
  };
}