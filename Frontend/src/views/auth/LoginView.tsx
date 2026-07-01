// frontend/src/views/auth/LoginView.tsx
import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { Card } from "../../components/ui/Card";

export default function LoginView() {
  const navigate = useNavigate();

  const handleLoginSuccess = (data: any) => {
    console.log("Logged in successfully:", data);
    // Professional fake authentication state trigger: route them directly to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your dining platform</p>
        </div>

        <LoginForm onSubmitSuccess={handleLoginSuccess} />

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