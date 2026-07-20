import { Button } from "../ui/Button";
import type { Order } from "../../types";

interface OrderRowProps {
  order: Order;
  onInspect: (order: Order) => void;
}

export function OrderRow({ order, onInspect }: OrderRowProps) {
  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  // Safe fallback accounting for camelCase from types or snake_case from Active Model Serializers
  const displayTotal = Number(order.totalAmount ?? (order as any).total_amount ?? (order as any).total ?? 0);
  const displayStatus = order.status || "pending";

  return (
    <tr className="hover:bg-gray-50/70 transition-colors">
      <td className="px-6 py-4 font-mono font-medium text-gray-900">#{order.id}</td>
      <td className="px-6 py-4 font-mono text-sm text-gray-600">
        Restaurant #{order.restaurantId ?? (order as any).restaurant_id}
      </td>
      <td className="px-6 py-4 font-semibold text-gray-900">${displayTotal.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[displayStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
          {displayStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Button 
          variant="secondary" 
          className="px-2.5 py-1 text-xs font-medium"
          onClick={() => onInspect(order)}
        >
          Inspect Items
        </Button>
      </td>
    </tr>
  );
}