import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { LoginFormData } from "../utils/schemas";
import { ROUTES } from "../app/router";

interface UseLoginOptions {
  portal?: "customer" | "admin";
}

export function useLogin(options: UseLoginOptions = {}) {
  const { portal = "customer" } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: (formData: LoginFormData) =>
      portal === "admin"
        ? authService.loginAdmin(formData)
        : authService.login(formData),
    onSuccess: (data) => {
      console.log(`Logged in successfully via ${portal} portal:`, data);

      // Seed the React Query cache
      queryClient.setQueryData(["auth", "me"], data);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      setErrorMessage(null);

      // Redirect based on portal role
      if (portal === "admin") {
        navigate(ROUTES.DASHBOARD.DEFAULT);
      } else {
        navigate(ROUTES.DASHBOARD.DEFAULT);
      }
    },
    onError: (error: any) => {
      const apiError =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid email or password. Please try again.";
      setErrorMessage(apiError);
    },
  });

  const handleLoginSubmit = (formData: LoginFormData) => {
    loginMutation.mutate(formData);
  };

  return {
    onSubmit: handleLoginSubmit,
    isLoading: loginMutation.isPending,
    errorMessage,
  };
}