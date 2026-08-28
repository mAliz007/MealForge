import { Button } from "../ui/Button";
import type { Order } from "../../types";
import { useTranslation } from "react-i18next";
import { useAuthUser } from "../../hooks/useAuthUser";

interface OrderRowProps {
  order: Order;
  canUpdateStatus?: boolean;
  onInspect: (order: Order) => void;
}

export function OrderRow({
  order,
  canUpdateStatus = false,
  onInspect,
}: OrderRowProps) {
  const { t } = useTranslation();
  const { isAdmin, isOwner, restaurantId, hasPermission } = useAuthUser();

  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500",
    confirmed: "bg-emerald-500/10 text-emerald-500",
    preparing: "bg-blue-500/10 text-blue-500",
    completed: "bg-emerald-500/10 text-emerald-500",
    cancelled: "bg-red-500/10 text-red-500",
  };

  const displayTotal = Number(
    order.total_amount ?? (order as any).total_amount ?? (order as any).total ?? 0
  );
  const displayStatus = order.status || "pending";

  const orderRestaurantId =
    order.restaurant_id ?? (order as any).restaurant_id ?? (order as any).restaurant?.id;

  // Safely compare IDs across types
  const isAssignedRestaurant =
    !restaurantId ||
    !orderRestaurantId ||
    String(restaurantId) === String(orderRestaurantId);

  // Check permission using exact backend key 'order.update_status'
  const hasUpdatePermission =
    canUpdateStatus ||
    hasPermission("order.update_status", restaurantId) ||
    hasPermission("order.update", restaurantId);

  const isOrderOwner = isAdmin || ((isOwner || hasUpdatePermission) && isAssignedRestaurant);

  return (
    <tr className="hover:bg-structure/30 transition-colors">
      <td className="px-6 py-4 font-mono font-medium text-main">
        #{order.id}
        {isOrderOwner && (
          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
            {t("orders.table.yourTenant", { defaultValue: "Your Restaurant" })}
          </span>
        )}
      </td>
      <td className="px-6 py-4 font-mono text-sm text-muted">
        {t("orders.table.restaurantNode", { id: orderRestaurantId })}
      </td>
      <td className="px-6 py-4 font-semibold text-main">
        ${displayTotal.toFixed(2)}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
            statusColors[displayStatus as keyof typeof statusColors] ||
            "bg-structure text-muted"
          }`}
        >
          {displayStatus}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Button
          variant="secondary"
          className="px-2.5 py-1 text-xs font-medium"
          onClick={() => onInspect(order)}
        >
          {t("orders.table.inspectBtn", { defaultValue: "Inspect" })}
        </Button>
      </td>
    </tr>
  );
}