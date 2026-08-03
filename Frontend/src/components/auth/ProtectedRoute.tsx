import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser"; // Adjust path if needed
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

  // 1. Show a loading state while validating the session
  if (isLoading) {
    return <LoadingSpinner message="Verifying session..." fullScreen />;
  }

  // 2. If no user data comes back, bounce them to login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 3. If allowedRoles is defined and user's role isn't included, redirect to main dashboard
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to={ROUTES.DASHBOARD.DEFAULT} replace />;
  }

  // 4. Authenticated & authorized! Render children safely
  return <>{children}</>;
}