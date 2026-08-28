import { Link } from "react-router-dom";
import { RegisterForm } from "../../components/forms/RegisterForm";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useRegister } from "../../hooks/useRegister";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../app/router";

export default function RegisterView() {
  const { t } = useTranslation();
  const { onSubmit, isLoading, errorMessages } = useRegister();

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        message={t("auth.register.creatingAccount") || "Creating account..."}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas text-text-main px-4 transition-colors duration-200">
      <Card className="w-full max-w-md p-8 shadow-xl bg-structure border border-text-muted/10 rounded-2xl">
        <div className="text-center mb-6">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-xl mb-3 shadow-md shadow-blue-600/20 hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Go to Home"
          >
            F
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {t("auth.register.title")}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {t("auth.register.subtitle")}
          </p>
        </div>

        {errorMessages && errorMessages.length > 0 && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            <ul className="list-disc pl-4 space-y-1">
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <RegisterForm onSubmit={onSubmit} isLoading={isLoading} />

        <div className="text-center mt-6 text-sm text-text-muted">
          {t("auth.register.hasAccount")}{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
          >
            {t("auth.register.loginLink")}
          </Link>
        </div>
      </Card>
    </div>
  );
}