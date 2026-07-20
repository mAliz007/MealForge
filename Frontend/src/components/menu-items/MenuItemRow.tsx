import { useState } from "react";
import { Button } from "../ui/Button";
import { useCart } from "../../context/CartContext";
import type { MenuItem } from "../../types";

interface MenuItemRowProps {
  item: MenuItem;
  isAdmin: boolean;
  isDeleting: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export function MenuItemRow({ item, isAdmin, isDeleting, onEdit, onDelete }: MenuItemRowProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Safely coerce price to a number in case the backend sent it down as a string
  const safePrice = Number(item.price) || 0;

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-4 font-mono text-xs text-gray-400">#{item.id}</td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">{item.name}</div>
        <div className="text-xs text-gray-400">Associated Restaurant ID: {item.restaurantId}</div>
      </td>
      {/* Updated line to use safePrice */}
      <td className="px-6 py-4 font-semibold text-gray-900">${safePrice.toFixed(2)}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.available ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
          }`}
        >
          {item.available ? "In Stock" : "Unavailable"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        {isAdmin ? (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Delete"}
            </Button>
          </div>
        ) : (
          <div className="flex justify-end items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              disabled={!item.available}
              className="w-14 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            />
            <Button
              variant="primary"
              className="px-3 py-1 text-xs font-medium"
              onClick={() => {
                addToCart(item, quantity);
                setQuantity(1); // Reset input count
              }}
              disabled={!item.available}
            >
              Add to Tray
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}