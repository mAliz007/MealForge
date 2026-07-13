import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { RegisterForm } from "../../components/forms/RegisterForm";
import { Card } from "../../components/ui/Card";
import { useState } from "react";

export default function RegisterView() {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState<string[] | null>(null);

  // TanStack Mutation for processing the backend user creation flow
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      console.log("Registered account successfully via backend:", data);
      setErrorMessages(null);
      // Route straight to login view so they can establish their cookie session
      navigate("/login");
    },
    onError: (error: any) => {
      // Pull down full validation message arrays if Rails ActiveRecord validates trigger
      const apiErrors = error.response?.data?.errors || ["Registration failed. Please check your details."];
      setErrorMessages(apiErrors);
    }
  });

  const handleRegisterSubmit = (formData: Record<string, any>) => {
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Get started as a platform administrator</p>
        </div>

        {/* Display clear error messaging if registration validations fail */}
        {errorMessages && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <ul className="list-disc pl-4 space-y-1">
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <RegisterForm 
          onSubmit={handleRegisterSubmit} 
          isLoading={registerMutation.isPending}
        />

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 underline decoration-2">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}