import { Button } from "../ui/Button";
import type { Order } from "../../types";
import { useTranslation } from "react-i18next";

interface OrderRowProps {
  order: Order;
  onInspect: (order: Order) => void;
}

export function OrderRow({ order, onInspect }: OrderRowProps) {
  const { t } = useTranslation();

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500",
    confirmed: "bg-emerald-500/10 text-emerald-500",
    cancelled: "bg-red-500/10 text-red-500",
  };

  const displayTotal = Number(order.totalAmount ?? (order as any).total_amount ?? (order as any).total ?? 0);
  const displayStatus = order.status || "pending";

  return (
    <tr className="hover:bg-structure/30 transition-colors">
      <td className="px-6 py-4 font-mono font-medium text-main">#{order.id}</td>
      <td className="px-6 py-4 font-mono text-sm text-muted">
        {t("orders.table.restaurantNode", { id: order.restaurantId ?? (order as any).restaurant_id })}
      </td>
      <td className="px-6 py-4 font-semibold text-main">${displayTotal.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[displayStatus as keyof typeof statusColors] || "bg-structure text-muted"}`}>
          {displayStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Button 
          variant="secondary" 
          className="px-2.5 py-1 text-xs font-medium"
          onClick={() => onInspect(order)}
        >
          {t("orders.table.inspectBtn")}
        </Button>
      </td>
    </tr>
  );
}