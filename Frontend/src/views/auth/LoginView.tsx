// frontend/src/views/auth/LoginView.tsx
import { Link } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { Card } from "../../components/ui/Card";
import { useLogin } from "../../hooks/useLogin";
import { useTranslation } from "react-i18next";

export default function LoginView() {
  const { t } = useTranslation();
  // Completely clean, typed logic decoupled from UI layout
  const { onSubmit, isLoading, errorMessage } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-text-main px-4 transition-colors duration-200">
      <Card className="w-full max-w-md p-8 shadow-xl bg-structure border border-text-muted/10 rounded-2xl">
        <div className="text-center mb-6">
          {/* Logo styling matching your sidebar */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl mb-3 shadow-md shadow-blue-600/20">
            F
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">{t("auth.login.title")}</h2>
          <p className="text-sm text-text-muted mt-1">{t("auth.login.subtitle")}</p>
        </div>

        {/* Dynamic error feedback banner */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMessage}
          </div>
        )}

        {/* Clean, feature-isolated form layer */}
        <LoginForm 
          onSubmit={onSubmit} 
          isLoading={isLoading} 
        />

        <div className="text-center mt-6 text-sm text-text-muted">
          {t("auth.login.noAccount")}{" "}
          <Link to="/register" className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors">
            {t("auth.login.registerLink")}
          </Link>
        </div>
      </Card>
    </div>
  );
}