// frontend/src/components/ui/AlertDialog.tsx
import { useTranslation } from "react-i18next";
import { useAlertStore } from "../../store/useAlertStore";
import { Button } from "./Button";

export function AlertDialog() {
  const { t } = useTranslation();
  const isOpen = useAlertStore((state) => state.isOpen);
  const options = useAlertStore((state) => state.options);
  const closeAlert = useAlertStore((state) => state.closeAlert);

  if (!isOpen || !options) return null;

  const {
    title,
    message,
    confirmText,
    cancelText,
    variant = "danger",
    onConfirm,
  } = options;

  const handleConfirm = async () => {
    await onConfirm();
    closeAlert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title || t("common.alert.title", "Are you sure?")}
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={closeAlert}>
            {cancelText || t("common.actions.cancel", "Cancel")}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
          >
            {confirmText || t("common.actions.confirm", "Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}