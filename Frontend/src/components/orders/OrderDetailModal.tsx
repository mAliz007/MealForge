import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import type { Order } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useUpdateOrder, useDownloadInvoice } from "../../hooks/useOrders";

interface OrderDetailModalProps {
  order: Order | null;
  canUpdateStatus?: boolean;
  onClose: () => void;
}

// Color matching exact status states
const STATUS_COLORS: Record<string, { badge: string; option: string }> = {
  pending: {
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    option: "text-amber-500 font-bold",
  },
  confirmed: {
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    option: "text-emerald-500 font-bold",
  },
  preparing: {
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    option: "text-blue-500 font-bold",
  },
  completed: {
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    option: "text-emerald-500 font-bold",
  },
  cancelled: {
    badge: "bg-red-500/10 text-red-500 border-red-500/30",
    option: "text-red-500 font-bold",
  },
};

const ORDER_STATUSES = ["pending", "confirmed", "preparing", "completed", "cancelled"] as const;

export function OrderDetailModal({
  order,
  canUpdateStatus = false,
  onClose,
}: OrderDetailModalProps) {
  // 1. ALL HOOKS FIRST
  const { t } = useTranslation();
  const { user, isAdmin, isOwner, restaurantId, hasPermission } = useAuthUser();
  const updateOrder = useUpdateOrder();
  const downloadInvoice = useDownloadInvoice();

  // Local status state for real-time instant UI reflection
  const [currentStatus, setCurrentStatus] = useState<string>(
    order?.status || "pending"
  );

  // Sync state whenever order prop updates or modal re-opens
  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  // 2. EARLY EXIT AFTER HOOKS
  if (!order) return null;

  // 3. COMPUTED VALUES
  const displayTotal = Number(
    order.total_amount ?? (order as any).total_amount ?? (order as any).total ?? 0
  );

  const displayRestaurantId =
    order.restaurant_id ?? (order as any).restaurant_id ?? (order as any).restaurant?.id;

  // Resilient fallback extraction for user's owned/assigned restaurant ID
  const activeRestaurantId =
    restaurantId ??
    user?.restaurant_id ??
    (user as any)?.restaurant?.id ??
    (user as any)?.restaurant_ids?.[0];

  const displayStatus = currentStatus.toLowerCase();

  // Match restaurant node safely comparing string representations
  const isTargetRestaurant =
    !activeRestaurantId ||
    !displayRestaurantId ||
    String(activeRestaurantId) === String(displayRestaurantId);

  // Check backend capability using exact permission key 'order.update_status'
  const hasUpdatePermission =
    canUpdateStatus ||
    hasPermission("order.update_status", activeRestaurantId) ||
    hasPermission("order.update", activeRestaurantId);

  const canManageOrder =
    isAdmin || (isTargetRestaurant && (isOwner || hasUpdatePermission));

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    if (nextStatus && nextStatus !== displayStatus) {
      setCurrentStatus(nextStatus);

      updateOrder.mutate({
        id: order.id,
        status: nextStatus,
      });
    }
  };

  const handleDownloadInvoice = () => {
    downloadInvoice.mutate(order.id, {
      onSuccess: () => {
        console.log("Invoice generation queued; PDF will download automatically when ready.");
      },
      onError: (error) => {
        console.error("Failed to queue invoice generation:", error);
      },
    });
  };

  const currentStyle =
    STATUS_COLORS[displayStatus] || {
      badge: "bg-structure text-muted border-structure",
      option: "text-main",
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-structure p-6 shadow-xl border border-structure animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-structure pb-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-main">{t("orders.modal.title")}</h2>
            <p className="text-xs text-muted font-mono mt-0.5">
              {t("orders.modal.manifestRef", { id: order.id })}
            </p>
          </div>

          {/* Dynamic Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${currentStyle.badge}`}
          >
            {t("orders.modal.stateLabel", { status: displayStatus })}
          </span>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm text-main">
          <div className="flex justify-between bg-canvas/50 p-3 rounded-lg font-mono border border-structure">
            <span className="text-muted">{t("orders.modal.processingNode")}</span>
            <span className="font-semibold text-main">
              {t("orders.modal.restaurantHub", { id: displayRestaurantId })}
            </span>
          </div>

          <div className="border border-structure rounded-lg p-4 bg-canvas/20">
            <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">
              {t("orders.modal.financialAccounting")}
            </h3>
            <div className="flex justify-between items-center text-base font-bold text-main">
              <span>{t("orders.modal.grossValue")}</span>
              <span className="text-emerald-500">${displayTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Dropdown Controls */}
          {canManageOrder && (
            <div className="border border-structure rounded-lg p-4 bg-canvas/40 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                  {t("orders.modal.manageStatus", { defaultValue: "Update Order Status" })}
                </h3>
                {updateOrder.isPending && (
                  <span className="text-xs text-primary font-medium animate-pulse">
                    Updating...
                  </span>
                )}
              </div>

              <div className="relative">
                <select
                  id="order-status-select"
                  value={displayStatus}
                  disabled={updateOrder.isPending}
                  onChange={handleStatusChange}
                  className={`w-full appearance-none rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer disabled:opacity-50 ${currentStyle.badge}`}
                >
                  {ORDER_STATUSES.map((status) => {
                    const optionStyle = STATUS_COLORS[status]?.option || "text-main";
                    return (
                      <option
                        key={status}
                        value={status}
                        className={`bg-structure uppercase py-1 ${optionStyle}`}
                      >
                        {status}
                      </option>
                    );
                  })}
                </select>

                {/* Dropdown Chevron */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l0.707 0.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Footer */}
        <div className="mt-6 flex justify-between items-center border-t border-structure pt-4">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-70"
            disabled={downloadInvoice.isPending}
            onClick={handleDownloadInvoice}
          >
            {downloadInvoice.isPending ? (
              <div className="flex items-center space-x-2 py-0.5">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                <span className="text-xs font-medium">
                  {t("orders.modal.generatingPdf", { defaultValue: "Generating PDF..." })}
                </span>
              </div>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t("orders.modal.downloadInvoice", { defaultValue: "Download Invoice" })}</span>
              </>
            )}
          </Button>

          <Button variant="primary" className="px-4 py-2 text-sm" onClick={onClose}>
            {t("orders.modal.dismissBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}