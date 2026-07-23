import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export function OrderLoading() {
  const { t } = useTranslation();

  return <LoadingSpinner message={t("orders.states.loading")} />;
}

export function OrderError({ message }: { message?: string }) {
  const { t } = useTranslation();

  return (
    <Card className="border-red-500/30 bg-red-500/5 p-4">
      <h3 className="font-semibold text-sm text-red-500">{t("orders.states.errorTitle")}</h3>
      <p className="text-xs text-red-400/80 mt-1">
        {message || t("orders.states.errorFallback")}
      </p>
    </Card>
  );
}

export function OrderEmpty() {
  const { t } = useTranslation();

  return (
    <Card className="text-center py-12">
      <p className="text-lg font-medium text-main">{t("orders.states.emptyTitle")}</p>
      <p className="text-sm text-muted mt-1">{t("orders.states.emptySubtitle")}</p>
    </Card>
  );
}