// frontend/src/views/landing/components/HeroSection.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "~components/ui/Button";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="max-w-xl space-y-6 text-center lg:text-left">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent uppercase tracking-wider">
      </span>
      <h1 className="text-4xl sm:text-5xl font-black text-main leading-tight tracking-tight">
        {t("landing.hero.titleMain")} <br />
        <span className="text-accent">{t("landing.hero.titleSub")}</span>
      </h1>
      <p className="text-base sm:text-lg text-muted font-medium leading-relaxed">
        {t("landing.hero.description")}
      </p>
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
        <Link to="/dashboard">
          <Button variant="primary" className="px-6 py-3 text-base font-bold shadow-md hover:translate-y-[-1px] transition-transform">
            {t("landing.hero.launchBtn")}
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary" className="px-6 py-3 text-base font-bold border border-structure">
            {t("landing.hero.signInBtn")}
          </Button>
        </Link>
      </div>
    </div>
  );
}