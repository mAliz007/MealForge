import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";
import { ROUTES } from "../../app/router";
import type { ReactNode } from "react";
import type { UserRole } from "../../types/auth";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuthUser();

  // 1. Show a loading state while validating session
  if (isLoading) {
    return <LoadingSpinner message="Verifying session..." fullScreen />;
  }

  // 2. Redirect unauthenticated visitors to login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 3. Verify user's role against allowed roles
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD.DEFAULT} replace />;
  }

  // 4. Authorized - render children
  return <>{children}</>;
}