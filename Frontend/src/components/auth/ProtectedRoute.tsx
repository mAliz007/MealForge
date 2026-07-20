import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { ROUTES } from "../../app/router"; // Double check this import path matches your app structure
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Check our authentication status on mount / page refreshes
  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getCurrentUser,
    retry: false, // If the cookie is expired or missing, stop trying immediately
    staleTime: 1000 * 60 * 5, // Keep the session cached for 5 minutes before re-checking
  });

  // 1. Show a loading state while validating the secure cookie with Rails
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium text-gray-500">Verifying session...</span>
        </div>
      </div>
    );
  }

  // 2. If no user data comes back from the serializer, bounce them to login
  if (!authData?.user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 3. Authenticated! Render the dashboard layout safely
  return <>{children}</>;
}