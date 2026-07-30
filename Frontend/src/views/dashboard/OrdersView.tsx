import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next";

// Modular Presentational Components
import { OrderRow } from "../../components/orders/OrderRow";
import { OrderDetailModal } from "../../components/orders/OrderDetailModal";
import {
  OrderLoading,
  OrderError,
  OrderEmpty,
} from "../../components/orders/OrderStates";

import { Card } from "../../components/ui/Card";
import type { Order } from "../../types";

export default function OrdersView() {
  const { t } = useTranslation();
  const { isAdmin, isLoading: isAuthLoading } = useAuthUser();
  const { data: rawOrders, isLoading: isDataLoading, error, isError } = useOrders();

  // Selected Order context for the modal inspector
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Normalize response: Extract array if nested in an object, or fallback to an empty array
  const orders: Order[] = Array.isArray(rawOrders)
    ? rawOrders
    : Array.isArray((rawOrders as any)?.orders)
    ? (rawOrders as any).orders
    : Array.isArray((rawOrders as any)?.data)
    ? (rawOrders as any).data
    : [];

  const handleInspect = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const isLoading = isAuthLoading || isDataLoading;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-main">{t("orders.title")}</h1>
        <p className="text-sm text-muted">
          {isAdmin 
            ? t("orders.adminDescription") 
            : t("orders.userDescription")}
        </p>
      </div>

      {/* Main Ledger States */}
      {isLoading ? (
        <OrderLoading />
      ) : isError ? (
        <OrderError message={error?.message} />
      ) : orders.length === 0 ? (
        <OrderEmpty />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-structure/40 border-b border-structure text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="px-6 py-3">{t("orders.table.orderId")}</th>
                <th className="px-6 py-3">{t("orders.table.node")}</th>
                <th className="px-6 py-3">{t("orders.table.total")}</th>
                <th className="px-6 py-3">{t("orders.table.state")}</th>
                <th className="px-6 py-3 text-right">{t("orders.table.invoice")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-structure/50 text-sm text-main">
              {orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onInspect={handleInspect}
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Itemization Detail Inspection Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </div>
  );
}