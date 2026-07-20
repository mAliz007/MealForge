// frontend/src/components/menu-items/MenuItemStates.tsx
import { useTranslation } from "react-i18next";
import { Card } from "../ui/Card";

export function MenuItemLoading() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center items-center h-48 text-text-muted">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mr-3"></div>
      {t("menu.states.loading")}
    </div>
  );
}

export function MenuItemError({ message }: { message?: string }) {
  const { t } = useTranslation();

  return (
    <Card className="border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 p-4">
      <h3 className="font-semibold text-sm">{t("menu.states.errorTitle")}</h3>
      <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1">
        {message || t("menu.states.errorFallback")}
      </p>
    </Card>
  );
}

export function MenuItemEmpty() {
  const { t } = useTranslation();

  return (
    <Card className="text-center py-12 border-structure bg-structure/10">
      <p className="text-lg font-medium text-text-main">{t("menu.states.emptyTitle")}</p>
      <p className="text-sm text-text-muted mt-1">
        {t("menu.states.emptySubtitle")}
      </p>
    </Card>
  );
}