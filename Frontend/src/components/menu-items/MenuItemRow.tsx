import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Safely coerce price to a number in case the backend sent it down as a string
  const safePrice = Number(item.price) || 0;

  return (
    <tr className="border-b border-structure hover:bg-structure/30 transition-colors">
      {/* ID Column */}
      <td className="px-6 py-4 font-mono text-xs text-text-muted">#{item.id}</td>
      
      {/* Name and Meta */}
      <td className="px-6 py-4">
        <div className="font-semibold text-text-main">{item.name}</div>
        <div className="text-xs text-text-muted">
          {t("menu.row.metaRestaurantId", { id: item.restaurantId })}
        </div>
      </td>
      
      {/* Price */}
      <td className="px-6 py-4 font-semibold text-text-main">${safePrice.toFixed(2)}</td>
      
      {/* Availability Status Badge */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
            item.available 
              ? "bg-accent/10 text-accent dark:bg-accent/20" 
              : "bg-red-500/10 text-red-600 dark:text-red-400 dark:bg-red-500/20"
          }`}
        >
          {item.available ? t("menu.row.statusInStock") : t("menu.row.statusUnavailable")}
        </span>
      </td>
      
      {/* Actions */}
      <td className="px-6 py-4 text-right">
        {isAdmin ? (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => onEdit(item)}>
              {t("menu.row.btnEdit")}
            </Button>
            <Button
              variant="danger"
              className="px-2.5 py-1 text-xs"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
            >
              {isDeleting ? t("menu.row.btnRemoving") : t("menu.row.btnDelete")}
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
              className="w-14 rounded-lg border border-structure bg-canvas text-text-main px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
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
              {t("menu.row.btnAddToTray")}
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}