import { Button } from "../ui/Button";
import type { Order } from "../../types";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  // Safe fallback checking both naming configurations
  const displayTotal = Number(order.totalAmount ?? (order as any).total_amount ?? (order as any).total ?? 0);
  const displayRestaurantId = order.restaurantId ?? (order as any).restaurant_id;
  const displayStatus = order.status || "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Invoice Specs</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Manifest Reference ID: #{order.id}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700">
            State: {displayStatus}
          </span>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between bg-gray-50 p-3 rounded-lg font-mono">
            <span className="text-gray-500">Processing Node</span>
            <span className="font-semibold text-gray-900">Restaurant Hub #{displayRestaurantId}</span>
          </div>

          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/30">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Financial Accounting</h3>
            <div className="flex justify-between items-center text-base font-bold text-gray-900">
              <span>Gross Transacted Value</span>
              <span className="text-emerald-600">${displayTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="primary" className="px-4 py-2 text-sm" onClick={onClose}>
            Dismiss Ledger Entry
          </Button>
        </div>
      </div>
    </div>
  );
}