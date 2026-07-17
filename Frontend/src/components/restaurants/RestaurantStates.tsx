import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";

interface StateProps {
  message?: string;
}

export function RestaurantLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center h-48 text-muted">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mr-2"></div>
      {t("restaurants.states.syncing")}
    </div>
  );
}

export function RestaurantError({ message }: StateProps) {
  const { t } = useTranslation();
  return (
    <Card className="border-red-500/30 bg-red-500/5 p-6 text-center">
      <p className="text-sm font-semibold text-red-500">{t("restaurants.states.failedSync")}</p>
      <p className="text-xs text-red-400/80 mt-1">
        {message || t("restaurants.states.defaultError")}
      </p>
    </Card>
  );
}

export function RestaurantEmpty() {
  const { t } = useTranslation();
  return (
    <Card className="text-center py-12">
      <p className="text-lg font-medium text-main">{t("restaurants.states.noneFound")}</p>
      <p className="text-sm text-muted mt-1">{t("restaurants.states.addFirst")}</p>
    </Card>
  );
}