// frontend/src/views/landing/LandingView.tsx

import { useTranslation } from "react-i18next";
import { FeatureGrid } from "~components/landing/FeatureGrid";
import { HeroSection } from "~components/landing/HeroSection";
import { HomeNavbar } from "~components/landing/HomeNavbar";

export default function LandingView() {
  const { t } = useTranslation(); 

  return (
    <div className="min-h-screen bg-linear-to-b from-canvas to-structure/30 flex flex-col justify-between transition-colors duration-200">
      
      {/* Decoupled Navigation Header */}
      <HomeNavbar />

      {/* Main Structural Content Segment */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        <HeroSection />
        <FeatureGrid />
      </main>

      {/* Static Footer */}
      <footer className="border-t border-structure bg-structure py-6 text-center text-xs font-semibold text-muted tracking-wider">
        {t("landing.footer.copyright")}
      </footer>
    </div>
  );
}