import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import type { MenuItem } from "../../types";
import { Button } from "../ui/Button";
import { useAddToCart } from "../../hooks/useCartQuery";

interface MenuItemRowProps {
  item: MenuItem;
  isAdmin: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isDeleting: boolean;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
}

export function MenuItemRow({
  item,
  isAdmin,
  canEdit,
  canDelete,
  isDeleting,
  onEdit,
  onDelete,
}: MenuItemRowProps) {
  const { t } = useTranslation();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Initialize TanStack Query mutation hook
  const addToCartMutation = useAddToCart();

  // Safely parse price to Number in case backend returns string
  const formattedPrice = Number(item.price || 0).toFixed(2);

  const handleAddToCart = () => {
    addToCartMutation.mutate(
      {
        menu_item_id: item.id,
        quantity: 1,
      },
      {
        onError: (error) => {
          // Handle 422 restaurant conflict or other errors if needed
          console.error("Failed to add item to cart:", error);
        },
      }
    );
  };

  return (
    <>
      <tr className="hover:bg-canvas/30 transition-colors duration-150">
        {/* ID */}
        <td className="px-6 py-4 font-mono text-xs text-text-muted">
          #{item.id}
        </td>

        {/* Thumbnail Image Column */}
        <td className="px-6 py-4">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="group relative w-12 h-12 rounded-lg bg-canvas border border-text-muted/20 overflow-hidden flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={t("menu.row.clickToEnlarge", "Click to enlarge")}
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <svg
                className="w-6 h-6 text-text-muted/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>
        </td>

        {/* Name & Description */}
        <td className="px-6 py-4">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="font-semibold text-text-main group-hover:text-blue-600 transition-colors">
              {item.name}
            </div>
            {item.description && (
              <div className="text-xs text-text-muted line-clamp-1 mt-0.5">
                {item.description}
              </div>
            )}
          </button>
        </td>

        {/* Price */}
        <td className="px-6 py-4 font-semibold text-text-main">
          ${formattedPrice}
        </td>

        {/* Status Badge */}
        <td className="px-6 py-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              item.available
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            }`}
          >
            {item.available
              ? t("menu.row.statusInStock", "In Stock")
              : t("menu.row.statusUnavailable", "Unavailable")}
          </span>
        </td>

        {/* Action Buttons Column */}
        <td className="px-6 py-4 text-right whitespace-nowrap">
          {isAdmin ? (
            <div className="flex items-center justify-end gap-2">
              {canEdit && (
                <Button
                  variant="secondary"
                  className="text-xs py-1.5 px-3"
                  onClick={() => onEdit(item)}
                >
                  {t("menu.row.btnEdit", "Edit")}
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="danger"
                  className="text-xs py-1.5 px-3 min-w-[70px]"
                  isLoading={isDeleting}
                  onClick={() => onDelete(item.id)}
                >
                  {isDeleting
                    ? t("menu.row.btnRemoving", "Removing...")
                    : t("menu.row.btnDelete", "Delete")}
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="primary"
              className="text-xs py-1.5 px-3 w-28 text-center"
              disabled={!item.available || addToCartMutation.isPending}
              isLoading={addToCartMutation.isPending}
              onClick={handleAddToCart}
            >
              {t("menu.row.btnAddToCart", "Add to Cart")}
            </Button>
          )}
        </td>
      </tr>

      {/* Item Details & Enlarged Image Modal */}
      <Dialog
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--color-structure, #ffffff)",
              backgroundImage: "none",
              color: "var(--color-text-main, #000000)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              overflow: "hidden",
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          {item.name}
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <div className="flex flex-col gap-4">
            {/* Enlarged Image */}
            <div className="w-full h-64 rounded-xl bg-canvas border border-text-muted/20 overflow-hidden flex items-center justify-center">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-contain bg-black/10"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-text-muted/40">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs">
                    {t("menu.preview.noImage", "No image available")}
                  </span>
                </div>
              )}
            </div>

            {/* Price & Status Row */}
            <div className="flex items-center justify-between border-b border-text-muted/10 pb-3">
              <div>
                <span className="text-xs uppercase text-text-muted font-semibold block">
                  {t("menu.table.price", "Price")}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ${formattedPrice}
                </span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                    item.available
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}
                >
                  {item.available
                    ? t("menu.row.statusInStock", "In Stock")
                    : t("menu.row.statusUnavailable", "Unavailable")}
                </span>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  {t("menu.preview.description", "Description")}
                </h4>
                <p className="text-sm text-text-main leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
            {t("common.actions.close", "Close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}