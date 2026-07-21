// frontend/src/views/menu-items/MenuItemsView.tsx
import { useTranslation } from "react-i18next";
import { useMenuItemsView } from "../../hooks/useMenuItemsView";

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

export default function MenuItemsView() {
  const { t } = useTranslation();

  // Connect presentation layer entirely to the clean state machine hook
  const {
    isAdmin,
    isLoading,
    isError,
    error,
    menuItems,
    restaurantId,
    setRestaurantId,
    available,
    setAvailable,
    isFormOpen,
    editingItem,
    isPending,
    deleteMutation,
    handleFormSubmit,
    startEdit,
    handleCancelForm,
    openCreateForm,
    shouldSkipFetch,
  } = useMenuItemsView();

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

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openCreateForm}>
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

      <MenuItemFormPanel
        open={isFormOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
        isPending={isPending}
      />

      {/* State Machine UI Router Implementation */}
      {isLoading ? (
        <MenuItemLoading />
      ) : isError ? (
        <MenuItemError message={error?.message} />
      ) : shouldSkipFetch ? (
        <Card className="text-center py-16 px-4 border border-dashed border-text-muted/20">
          <p className="text-lg font-medium text-text-main">Please Select a Restaurant</p>
          <p className="text-sm text-text-muted mt-1">
            Choose a location from the selection filter bar above to browse their menu items.
          </p>
        </Card>
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