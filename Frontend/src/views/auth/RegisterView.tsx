// frontend/src/views/auth/RegisterView.tsx
import { useNavigate, Link } from "react-router-dom";
import { RegisterForm } from "../../components/forms/RegisterForm";
import { Card } from "../../components/ui/Card";

export default function RegisterView() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (data: any) => {
    console.log("Registered account successfully:", data);
    // Automatically route to login after creating an account
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Get started as a platform administrator</p>
        </div>

        <RegisterForm onSubmitSuccess={handleRegisterSuccess} />

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