import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { LoginForm } from "../../components/forms/LoginForm";
import { Card } from "../../components/ui/Card";
import { useState } from "react";

export default function LoginView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TanStack Query Mutation replaces the old fake handlers
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      console.log("Logged in successfully via backend cookie:", data);
      
      // Seed the query cache immediately with our updated user session details
      queryClient.setQueryData(["auth", "me"], data);
      
      setErrorMessage(null);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Pulls standard API error payload structural text if it exists
      const apiError = error.response?.data?.error || "Invalid email or password. Please try again.";
      setErrorMessage(apiError);
    }
  });

  const handleLoginSubmit = (formData: Record<string, any>) => {
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your dining platform</p>
        </div>

        {/* Display dynamic backend feedback when invalid strings occur */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Passing state variables down so buttons can render disable/loading modes */}
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={loginMutation.isPending} 
        />

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 underline decoration-2">
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
}