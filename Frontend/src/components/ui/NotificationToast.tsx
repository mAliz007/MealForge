// src/components/ui/NotificationToast.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, X, ShoppingBag, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ActionCablePayload } from "../../hooks/useOrderNotifications";

interface NotificationToastProps {
  notification: ActionCablePayload | null; // Changed to ActionCablePayload
  onClose: () => void;
  autoHideDuration?: number;
}

export function NotificationToast({
  notification,
  onClose,
  autoHideDuration = 6000,
}: NotificationToastProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [notification, autoHideDuration, onClose]);

  if (!notification) return null;

  const handleViewOrders = () => {
    onClose();
    navigate("/dashboard/orders");
  };

  // 1. Handle Invoice Generated UI (TypeScript automatically discriminates the union type here)
  if ("event" in notification && notification.event === "invoice_generated") {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-structure text-text-main border border-primary/30 shadow-2xl rounded-2xl p-4 transition-all transform duration-300 animate-in slide-in-from-bottom-5 fade-in"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0 mt-0.5">
            <FileText className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-text-main leading-snug">
              Invoice Ready
            </h4>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {notification.message || `Invoice for Order #${notification.order_id} has been downloaded.`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors"
            aria-label={t("notifications.dismiss")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // 2. Handle Order Placed UI (OrderNotificationPayload)
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-structure text-text-main border border-primary/30 shadow-2xl rounded-2xl p-4 transition-all transform duration-300 animate-in slide-in-from-bottom-5 fade-in"
    >
      <div className="flex items-start gap-3">
        {/* Success Icon */}
        <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0 mt-0.5">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-text-main leading-snug">
            {t("notifications.orderPlacedTitle")}
          </h4>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {t("notifications.orderMessage", {
              id: notification.id,
              restaurant: notification.restaurant_name,
            })}
          </p>

          {/* Details Pill */}
          {notification.total_amount != null && (
            <div className="mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 bg-canvas border border-text-muted/10 rounded-lg text-xs font-semibold">
              <span className="text-text-muted">{t("notifications.total")}:</span>
              <span className="text-primary">${notification.total_amount.toFixed(2)}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleViewOrders}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              {t("notifications.viewOrders")}
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-main p-1 rounded-lg transition-colors"
          aria-label={t("notifications.dismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}