import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import type { RegisterFormData } from "../utils/schemas";

export function useRegister() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  const registerMutation = useMutation({
    mutationFn: authService.register, // Strictly mapped to RegisterFormData
    onSuccess: (data) => {
      console.log("Registered account successfully via backend:", data);
      setErrorMessages(null);
      navigate("/login");
    },
    onError: (error: any) => {
      const apiErrors = error.response?.data?.errors || ["Registration failed. Please check your details."];
      setErrorMessages(apiErrors);
    }
  });

  const handleRegisterSubmit = (formData: RegisterFormData) => {
    registerMutation.mutate(formData);
  };

  return {
    onSubmit: handleRegisterSubmit,
    isLoading: registerMutation.isPending,
    errorMessages
  };
}