import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { AuthResponse, UserRole } from "../types/auth.ts";

export function useAuthUser() {
  const { data, isLoading, isError } = useQuery<AuthResponse, Error>({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    staleTime: Infinity,
  });

  const userObject = data?.user;
  const role = userObject?.role;

  // Primary Role checks
  const isAdmin = role === "admin";
  const isOwner = role === "owner";
  const isStaff = role === "staff";
  const isCustomer = role === "customer";

  // Helper method to check against an array of system roles
  const hasRole = (allowedRoles: UserRole[]) => !!role && allowedRoles.includes(role);

  /**
   * Helper to verify if a user has a specific catalog permission key.
   */
  const hasPermission = (permissionKey: string, restaurantId?: number | null): boolean => {
    if (!userObject) return false;
    if (isAdmin) return true;

    // Owner check
    if (isOwner) {
      return !!restaurantId && userObject.restaurant_id === restaurantId;
    }

    // Staff check
    if (isStaff && userObject.restaurant_access) {
      if (!restaurantId) {
        return userObject.restaurant_access.some((access) =>
          access.permissions.includes(permissionKey)
        );
      }

      const access = userObject.restaurant_access.find(
        (a) => a.restaurant_id === restaurantId
      );
      return access ? access.permissions.includes(permissionKey) : false;
    }

    return false;
  };

  /**
   * Helper to verify if a user has ANY permission matching a category prefix (e.g., "order" or "menu_item").
   * Automatically allows Admins, Owners, and Customers.
   */
  const hasAnyCategoryPermission = (categoryPrefix: string, restaurantId?: number | null): boolean => {
    if (!userObject) return false;
    if (isAdmin || isOwner || isCustomer) return true;

    if (isStaff && userObject.restaurant_access) {
      if (!restaurantId) {
        return userObject.restaurant_access.some((access) =>
          access.permissions.some((perm) => perm.startsWith(categoryPrefix))
        );
      }

      const access = userObject.restaurant_access.find(
        (a) => a.restaurant_id === restaurantId
      );
      return access
        ? access.permissions.some((perm) => perm.startsWith(categoryPrefix))
        : false;
    }

    return false;
  };

  // Extract restaurantId safely for both Owner (root) and Staff (restaurant_access array)
  const effectiveUserRestaurantId =
    userObject?.restaurant_id ??
    userObject?.restaurant_access?.[0]?.restaurant_id ??
    null;

  return {
    user: userObject,
    role,
    isAdmin,
    isOwner,
    isStaff,
    isCustomer,
    hasRole,
    hasPermission,
    hasAnyCategoryPermission,
    restaurantId: effectiveUserRestaurantId,
    restaurantAccess: userObject?.restaurant_access ?? [],
    isLoading,
    isError,
  };
}