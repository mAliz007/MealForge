import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { LoginFormData } from "../utils/schemas";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: authService.login, // Strongly typed to match schema!
    onSuccess: (data) => {
      console.log("Logged in successfully via backend cookie:", data);
      
      // Seed the cache with clean typed data
      queryClient.setQueryData(["auth", "me"], data);
      
      setErrorMessage(null);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const apiError = error.response?.data?.error || "Invalid email or password. Please try again.";
      setErrorMessage(apiError);
    }
  });

  const handleLoginSubmit = (formData: LoginFormData) => {
    loginMutation.mutate(formData);
  };

  return {
    onSubmit: handleLoginSubmit,
    isLoading: loginMutation.isPending,
    errorMessage
  };
}