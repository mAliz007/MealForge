import type { Restaurant } from "../../types";
import { Card } from "../ui/Card";
import { RestaurantTableRow } from "./RestaurantTableRow";
import { useTranslation } from "react-i18next";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  isAdmin: boolean;
  isOwner?: boolean;
  deletingId?: number | null;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: number) => void;
}

export function RestaurantTable({
  restaurants,
  isAdmin,
  isOwner = false,
  deletingId,
  onEdit,
  onDelete,
}: RestaurantTableProps) {
  const { t } = useTranslation();

  const showActions = isAdmin || isOwner;

  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-structure/40 border-b border-structure text-xs font-semibold uppercase tracking-wider text-muted">
            <th className="px-6 py-3">{t("restaurants.table.id")}</th>
            <th className="px-6 py-3">{t("restaurants.table.name")}</th>
            <th className="px-6 py-3">{t("restaurants.table.location")}</th>
            <th className="px-6 py-3">{t("restaurants.table.status")}</th>
            
            {/* Show Actions header for Admin or Owner; completely hide for Customer */}
            {showActions && (
              <th className="px-6 py-3 text-right">{t("restaurants.table.actions")}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-structure/50 text-sm text-main">
          {restaurants.map((res) => (
            <RestaurantTableRow
              key={res.id}
              restaurant={res}
              isAdmin={isAdmin}
              isOwner={isOwner}
              isDeleting={deletingId === res.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </Card>
  );
}