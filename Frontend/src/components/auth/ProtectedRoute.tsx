import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { ROUTES } from "../../app/router";
import type { ReactNode } from "react";
import { STALE_TIME_5_MINUTES } from "../../constants/config";
import { LoadingSpinner } from "../ui/LoadingSpinner"; // Adjust path if needed

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check our authentication status on mount / page refreshes
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    retry: false, // If the cookie is expired or missing, stop trying immediately
    staleTime: STALE_TIME_5_MINUTES, // Keep the session cached for 5 minutes before re-checking
  });

  // 1. Show a loading state while validating the secure cookie with Rails
  if (isLoading) {
    return <LoadingSpinner message="Verifying session..." fullScreen />;
  }

  // 2. If no user data comes back from the serializer, bounce them to login
  if (!authData?.user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 3. Authenticated! Render the dashboard layout safely
  return <>{children}</>;
}