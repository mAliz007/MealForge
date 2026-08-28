import { Link } from "react-router-dom";
import { LoginForm } from "../../components/forms/LoginForm";
import { Card } from "../../components/ui/Card";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { useLogin } from "../../hooks/useLogin";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../../app/router";

interface LoginViewProps {
  portal?: "customer" | "admin";
}

export default function LoginView({ portal = "customer" }: LoginViewProps) {
  const { t } = useTranslation();
  const isAdminPortal = portal === "admin";

  const { onSubmit, isLoading, errorMessage } = useLogin({ portal });

  if (isLoading) {
    return (
      <LoadingSpinner
        fullScreen
        message={t("auth.login.signingIn") || "Logging in..."}
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
            {isAdminPortal
              ? t("auth.adminLogin.title")
              : t("auth.login.title")}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {isAdminPortal
              ? t("auth.adminLogin.subtitle")
              : t("auth.login.subtitle")}
          </p>
        </div>

        {/* Dynamic error feedback banner */}
        {errorMessage && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-medium animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMessage}
          </div>
        )}

        {/* Feature-isolated form layer */}
        <LoginForm onSubmit={onSubmit} isLoading={isLoading} />

        {/* Primary action link (Register) */}
        <div className="text-center mt-6 text-sm text-text-muted">
          {isAdminPortal ? (
            <>
              {t("auth.adminLogin.noAccount")}{" "}
              <Link
                to={ROUTES.ADMIN_REGISTER}
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
              >
                {t("auth.adminLogin.registerLink")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.login.noAccount")}{" "}
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
              >
                {t("auth.login.registerLink")}
              </Link>
            </>
          )}
        </div>

        {/* Secondary Portal Switch Link */}
        <div className="text-center mt-3 text-sm text-text-muted">
          {isAdminPortal ? (
            <>
              {t("auth.adminLogin.customerPortalPrefix")}{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
              >
                {t("auth.adminLogin.customerPortalLink")}
              </Link>
            </>
          ) : (
            <>
              {t("auth.login.adminPortalPrefix")}{" "}
              <Link
                to={ROUTES.ADMIN_LOGIN}
                className="font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-colors"
              >
                {t("auth.login.adminPortalLink")}
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}