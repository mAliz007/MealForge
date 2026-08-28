// frontend/src/components/dashboard/DashboardFooter.tsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "../../app/router";

export function DashboardFooter() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-structure/40 border-t border-structure/60 py-4 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-muted">
        
        {/* Left Hand: App Branding & Copyright Metadata */}
        <div className="flex items-center gap-1.5 order-2 sm:order-1">
          <span className="font-bold text-main">FoodSplits</span>
          <span>&copy; {currentYear}.</span>
          <span className="hidden xs:inline text-[11px] opacity-70">
            {t("dashboard.footer.allRightsReserved", "All rights reserved.")}
          </span>
        </div>

        {/* Right Hand: Context Utility Links */}
        <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2 text-[11px] sm:text-xs">
          <Link 
            to={ROUTES.DASHBOARD.DEFAULT} 
            className="hover:text-main transition-colors"
          >
            {t("dashboard.footer.support", "Support")}
          </Link>
          <span className="w-1 h-1 rounded-full bg-structure-modifier" />
          <Link 
            to={ROUTES.DASHBOARD.DEFAULT} 
            className="hover:text-main transition-colors"
          >
            {t("dashboard.footer.privacy", "Privacy Policy")}
          </Link>
          <span className="w-1 h-1 rounded-full bg-structure-modifier" />
          <Link 
            to={ROUTES.DASHBOARD.DEFAULT} 
            className="hover:text-main transition-colors"
          >
            {t("dashboard.footer.terms", "Terms of Service")}
          </Link>
        </div>

      </div>
    </footer>
  );
}