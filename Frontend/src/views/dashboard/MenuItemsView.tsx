// frontend/src/views/menu-items/MenuItemsView.tsx
import { useState } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next";
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "../../hooks/useMenuItems";

// Isolated Modular Presentation Components
import { MenuFilterBar } from "../../components/menu-items/MenuFilterBar";
import { MenuItemRow } from "../../components/menu-items/MenuItemRow";
import { MenuItemFormPanel } from "../../components/menu-items/MenuItemFormPanel";
import {
  MenuItemLoading,
  MenuItemError,
  MenuItemEmpty,
} from "../../components/menu-items/MenuItemStates";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import type { MenuItem } from "../../types";
import type { MenuItemFormData } from "../../utils/schemas";

export default function MenuItemsView() {
  const { t } = useTranslation();

  // 1. Role Authentication Scopes
  const { isAdmin, isLoading: isAuthLoading } = useAuthUser();

  // 2. Query Filtering State Strings
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [available, setAvailable] = useState<string>("");

  // Construct operational filters object
  const activeFilters = {
    ...(restaurantId && { restaurant_id: Number(restaurantId) }),
    ...(available && { available: available === "true" }),
  };

  // 3. TanStack Query Foundations
  const { data: menuItems, isLoading: isDataLoading, error, isError } = useMenuItems(activeFilters);
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  // 4. Panel Interface UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);

  // Form Submission Router (Creates a new entry or updates an existing entity)
  const handleFormSubmit = (payload: MenuItemFormData & { available: boolean }) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingItem(undefined);
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const startEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  };

  // Compute unified structural loading states
  const isLoading = isAuthLoading || isDataLoading;

  return (
    <div className="space-y-6 text-text-main transition-colors duration-200">
      {/* Page Header Layout */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("menu.title")}</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {isAdmin 
              ? t("menu.adminDescription") 
              : t("menu.userDescription")}
          </p>
        </div>

        {/* Render addition capability solely for privileged Admins */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setEditingItem(undefined);
                setIsFormOpen(true);
              }}
            >
              {t("menu.addItem")}
            </Button>
          </div>
        )}
      </div>

      {/* Filter Management Bar */}
      <MenuFilterBar
        restaurantId={restaurantId}
        setRestaurantId={setRestaurantId}
        available={available}
        setAvailable={setAvailable}
      />

      {/* 
        MUI Dialog (Modal Form) Wrapper 
        Rendered inline without conditional brackets to allow the modal's entry and exit animations to work cleanly.
      */}
      <MenuItemFormPanel
        open={isFormOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Base Response Content Rendering Flow */}
      {isLoading ? (
        <MenuItemLoading />
      ) : isError ? (
        <MenuItemError message={error?.message} />
      ) : !menuItems || menuItems.length === 0 ? (
        <MenuItemEmpty />
      ) : (
        <Card className="overflow-x-auto p-0 bg-structure border border-text-muted/10 rounded-2xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas/50 border-b border-text-muted/10 text-xs font-bold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("menu.table.id")}</th>
                <th className="px-6 py-4">{t("menu.table.details")}</th>
                <th className="px-6 py-4">{t("menu.table.price")}</th>
                <th className="px-6 py-4">{t("menu.table.status")}</th>
                <th className="px-6 py-4 text-right">
                  {isAdmin ? t("menu.table.actions") : t("menu.table.buildOrder")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-muted/10 text-sm">
              {menuItems.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  isAdmin={isAdmin}
                  isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
                  onEdit={startEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}