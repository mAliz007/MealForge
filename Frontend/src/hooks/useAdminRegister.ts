import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { AdminRegisterFormData } from "../utils/schemas";

export function useAdminRegister() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  const registerAdminMutation = useMutation({
    mutationFn: authService.registerAdmin,
    onSuccess: (data) => {
      console.log("Registered admin and restaurant successfully:", data);
      setErrorMessages(null);
      navigate("/admin/login");
    },
    onError: (error: any) => {
      const apiErrors =
        error.response?.data?.errors ||
        [error.response?.data?.message] ||
        ["Admin registration failed. Please check your details."];
      
      setErrorMessages(Array.isArray(apiErrors) ? apiErrors : [apiErrors]);
    },
  });

  const handleAdminRegisterSubmit = (formData: AdminRegisterFormData) => {
    registerAdminMutation.mutate(formData);
  };

  return {
    onSubmit: handleAdminRegisterSubmit,
    isLoading: registerAdminMutation.isPending,
    errorMessages,
  };
}