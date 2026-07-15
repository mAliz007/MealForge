import { useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { useAuthUser } from "../../hooks/useAuthUser";

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
  const { isAdmin, isLoading: isAuthLoading } = useAuthUser();
  const { data: orders, isLoading: isDataLoading, error, isError } = useOrders();

  // Selected Order context for the modal inspector
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-sm text-gray-500">
          {isAdmin 
            ? "Monitor the global restaurant transaction ledgers and fulfillment records." 
            : "Review and track the real-time fulfillment state of your culinary selections."}
        </p>
      </div>

      {/* Main Ledger States */}
      {isLoading ? (
        <OrderLoading />
      ) : isError ? (
        <OrderError message={error?.message} />
      ) : !orders || orders.length === 0 ? (
        <OrderEmpty />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Fulfillment Node</th>
                <th className="px-6 py-3">Gross Total</th>
                <th className="px-6 py-3">Fulfillment State</th>
                <th className="px-6 py-3 text-right">Invoice Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
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