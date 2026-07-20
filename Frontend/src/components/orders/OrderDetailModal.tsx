import { Button } from "../ui/Button";
import type { Order } from "../../types";
import { useTranslation } from "react-i18next";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { t } = useTranslation();

  if (!order) return null;

  // Enforce explicit snake_case keys mapped directly from our unified interface schema
  const displayTotal = Number(order.total_amount ?? 0);
  const displayRestaurantId = order.restaurant_id;
  const displayStatus = order.status || "pending";

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
          {/* Status Badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-accent/10 text-accent">
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
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <Button variant="primary" className="px-4 py-2 text-sm" onClick={onClose}>
            {t("orders.modal.dismissBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}