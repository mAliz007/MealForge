// frontend/src/views/landing/components/FeatureGrid.tsx
import { Utensils, ShieldCheck, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "~components/ui/Card";

export function FeatureGrid() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full">
      <Card hoverable className="space-y-3 p-5">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
          <Utensils size={20} />
        </div>
        <h3 className="font-bold text-main">{t("landing.features.router.title")}</h3>
        <p className="text-xs text-muted leading-relaxed">{t("landing.features.router.desc")}</p>
      </Card>

      <Card hoverable className="space-y-3 p-5">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
          <Layers size={20} />
        </div>
        <h3 className="font-bold text-main">{t("landing.features.matrix.title")}</h3>
        <p className="text-xs text-muted leading-relaxed">{t("landing.features.matrix.desc")}</p>
      </Card>
    </div>
  );
}