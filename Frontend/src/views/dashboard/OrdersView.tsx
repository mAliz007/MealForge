import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../services/apiClient";
import { useAuthUser } from "../../hooks/useAuthUser";

import type { Order } from "../../types";
import type { PagyMeta } from "../../types/PagyType";

import { OrderRow } from "~components/orders/OrderRow";
import { OrderDetailModal } from "~components/orders/OrderDetailModal";
import { OrderPagination } from "~components/orders/OrderPagination";

export default function OrdersView() {
  const { t } = useTranslation();
  const { isAdmin, isOwner, hasPermission, restaurantId } = useAuthUser();

  const [page, setPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Granular capability checks
  const canManageOrders =
    isAdmin ||
    isOwner ||
    hasPermission("order.update", restaurantId) ||
    hasPermission("order.read", restaurantId);

  const canUpdateStatus =
    isAdmin || isOwner || hasPermission("order.update", restaurantId);

  // Fetch paginated order ledger
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, restaurantId],
    queryFn: async () => {
      const response = await apiClient.get("/v1/orders", {
        params: { page, restaurant_id: restaurantId },
      });
      return response.data as { data: Order[]; meta: PagyMeta };
    },
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-main">
            {t("orders.title", { defaultValue: "Order Management Ledger" })}
          </h1>
          <p className="text-xs text-muted font-mono mt-1">
            {t("orders.subtitle", {
              defaultValue: "Monitor and manage order transactions",
            })}
          </p>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="overflow-hidden rounded-xl border border-structure bg-structure/40 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-structure bg-canvas/60 text-xs uppercase font-bold text-muted tracking-wider">
            <tr>
              <th className="px-6 py-3">Order Ref</th>
              <th className="px-6 py-3">Restaurant Node</th>
              <th className="px-6 py-3">Gross Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-structure">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-muted font-mono"
                >
                  {t("orders.loading", { defaultValue: "Loading orders..." })}
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-rose-500">
                  {t("orders.error", {
                    defaultValue: "Failed to load order records.",
                  })}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-muted">
                  {t("orders.empty", { defaultValue: "No orders found." })}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  canUpdateStatus={canUpdateStatus}
                  onInspect={(ord) => setSelectedOrder(ord)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <OrderPagination
        meta={meta}
        currentPage={page}
        limit={20}
        totalItemsFallback={orders.length}
        onPageChange={setPage}
      />

      {/* Inspect / Status Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          canUpdateStatus={canUpdateStatus}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}