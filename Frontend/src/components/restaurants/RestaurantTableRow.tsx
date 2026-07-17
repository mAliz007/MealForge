import type { Restaurant } from "../../types";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";

interface RestaurantTableRowProps {
  restaurant: Restaurant;
  isAdmin: boolean;
  isDeleting: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: number) => void;
}

export function RestaurantTableRow({
  restaurant,
  isAdmin,
  isDeleting,
  onEdit,
  onDelete,
}: RestaurantTableRowProps) {
  const { t } = useTranslation();

  const handleDeleteClick = () => {
    if (window.confirm(t("restaurants.table.confirmDelete", { name: restaurant.name }))) {
      onDelete(restaurant.id);
    }
  };

  return (
    <tr className="hover:bg-structure/30 transition-colors">
      <td className="px-6 py-4 font-mono font-medium">#{restaurant.id}</td>
      <td className="px-6 py-4 font-semibold text-main">{restaurant.name}</td>
      <td className="px-6 py-4">{restaurant.location}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
            restaurant.status === "open"
              ? "bg-green-500/10 text-green-500 dark:text-green-400"
              : "bg-structure text-muted"
          }`}
        >
          {restaurant.status}
        </span>
      </td>
      
      {isAdmin && (
        <td className="px-6 py-4 text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="px-2.5 py-1 text-xs"
              onClick={() => onEdit(restaurant)}
            >
              {t("restaurants.table.edit")}
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? t("restaurants.table.removing") : t("restaurants.table.delete")}
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
}