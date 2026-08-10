import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

interface PermissionGuardProps {
  children: ReactNode;
  categoryPrefix?: string;
  requiredPermission?: string;
  redirectTo?: string;
}

export function PermissionGuard({
  children,
  categoryPrefix,
  requiredPermission,
  redirectTo = "/dashboard/restaurants",
}: PermissionGuardProps) {
  const { isLoading, hasPermission, hasAnyCategoryPermission } = useAuthUser();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  let isAllowed = false;

  if (categoryPrefix) {
    isAllowed = hasAnyCategoryPermission(categoryPrefix);
  } else if (requiredPermission) {
    isAllowed = hasPermission(requiredPermission);
  } else {
    isAllowed = true;
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}