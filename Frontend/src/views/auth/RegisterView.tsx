import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/forms/RegisterForm";
import { Card } from "../../components/ui/Card";
import { useRegister } from "../../hooks/useRegister"; // Adjust this path to your hooks directory

export default function RegisterView() {
  // Extract clean, fully typed handlers and error metrics directly from your hook
  const { onSubmit, isLoading, errorMessages } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-gray-500 mt-1">Get started as a platform administrator</p>
        </div>

        {/* Render systemic error arrays clean without cluttering view files */}
        {errorMessages && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            <ul className="list-disc pl-4 space-y-1">
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom hook parameters flawlessly bind to RegisterFormProps definitions */}
        <RegisterForm 
          onSubmit={onSubmit} 
          isLoading={isLoading}
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