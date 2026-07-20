import type { Restaurant } from "../../types";
import { Card } from "../ui/Card";
import { RestaurantTableRow } from "./RestaurantTableRow";

interface RestaurantTableProps {
  restaurants: Restaurant[];
  isAdmin: boolean;
  deletingId?: number | null;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: number) => void;
}

export function RestaurantTable({
  restaurants,
  isAdmin,
  deletingId,
  onEdit,
  onDelete,
}: RestaurantTableProps) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {restaurants.map((res) => (
            <RestaurantTableRow
              key={res.id}
              restaurant={res}
              isAdmin={isAdmin}
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