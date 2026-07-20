import type { Restaurant } from "../../types";
import { Button } from "../ui/Button";

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
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to remove ${restaurant.name}?`)) {
      onDelete(restaurant.id);
    }
  };

  return (
    <tr className="hover:bg-gray-50/50">
      <td className="px-6 py-4 font-mono font-medium">#{restaurant.id}</td>
      <td className="px-6 py-4 font-semibold text-gray-900">{restaurant.name}</td>
      <td className="px-6 py-4">{restaurant.location}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
            restaurant.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {restaurant.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        {isAdmin ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="px-2.5 py-1 text-xs"
              onClick={() => onEdit(restaurant)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Delete"}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-gray-400 italic">Read-Only</span>
        )}
      </td>
    </tr>
  );
}