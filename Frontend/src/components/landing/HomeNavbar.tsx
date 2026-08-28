// frontend/src/views/landing/components/HomeNavbar.tsx
import { Link } from "react-router-dom";
import { Sun, Moon, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "~components/ui/Button";

export function HomeNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "es" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/80 backdrop-blur-md border-b border-structure/50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logotype */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-extrabold text-xl shadow-sm transition-transform group-hover:scale-105">
            F
          </div>
          <span className="text-xl font-black text-main tracking-tight">FoodSplits</span>
        </Link>

        {/* Global Access Controls Row */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Public Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-structure bg-structure/20 text-muted hover:text-main text-xs font-semibold uppercase tracking-wider transition-colors"
            aria-label="Toggle Language"
          >
            <Languages size={14} />
            <span>{i18n.language.startsWith("en") ? "es" : "en"}</span>
          </button>

          {/* Public Dark Mode Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-structure bg-structure/20 text-muted hover:text-main transition-colors"
            aria-label="Toggle Theme Mode"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* Action Destination CTA - Strict Minimum Width Bound */}
          <Link to="/dashboard" className="inline-block">
            <Button variant="secondary" className="text-xs sm:text-sm font-semibold shadow-xs w-full min-w-[120px] sm:min-w-[140px] justify-center">
              {t("landing.header.dashboardBtn")}
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}