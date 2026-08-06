import { useTranslation } from "react-i18next";
import { useMenuItemsView } from "../../hooks/useMenuItemsView";

// Presentation Components
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
import { MenuItemPagination } from "../../components/menu-items/MenuItemPagination";

export default function MenuItemsView() {
  const { t } = useTranslation();

  // Destructure pagination, role flags, and state from view hook
  const {
    isAdmin,
    isOwner,
    isLoading,
    isError,
    error,
    menuItems,
    meta,
    page,
    setPage,
    limit,
    search,
    setSearch,
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

  // Permission helper: both Admins and Restaurant Owners can manage menu items
  const canManage = isAdmin || isOwner;

  return (
    <div className="space-y-6 text-text-main transition-colors duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("menu.title", "Menu Items")}</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {canManage 
              ? t("menu.adminDescription", "Manage menu offerings and availability.") 
              : t("menu.userDescription", "Browse restaurant menu items.")}
          </p>
        </div>

        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openCreateForm}>
              {t("menu.addItem", "Add Menu Item")}
            </Button>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <MenuFilterBar
        restaurantId={restaurantId}
        setRestaurantId={setRestaurantId}
        available={available}
        setAvailable={setAvailable}
        search={search}
        setSearch={setSearch}
      />

      {/* Slide-over/Modal Form Panel */}
      <MenuItemFormPanel
        open={isFormOpen}
        editingItem={editingItem}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
        isPending={isPending}
      />

      {/* State Router */}
      {isLoading ? (
        <MenuItemLoading />
      ) : isError ? (
        <MenuItemError message={error?.message} />
      ) : !canManage && shouldSkipFetch ? (
        <Card className="text-center py-16 px-4 border border-dashed border-text-muted/20">
          <p className="text-lg font-medium text-text-main">
            {t("menu.selectRestaurantTitle", "Please Select a Restaurant")}
          </p>
          <p className="text-sm text-text-muted mt-1">
            {t("menu.selectRestaurantSubtitle", "Choose a location from the selection filter bar above to browse their menu items.")}
          </p>
        </Card>
      ) : !menuItems || menuItems.length === 0 ? (
        <MenuItemEmpty />
      ) : (
        <div className="space-y-4">
          <Card className="overflow-x-auto p-0 bg-structure border border-text-muted/10 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas/50 border-b border-text-muted/10 text-xs font-bold uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4">{t("menu.table.id", "ID")}</th>
                  <th className="px-6 py-4">{t("menu.table.details", "Details")}</th>
                  <th className="px-6 py-4">{t("menu.table.price", "Price")}</th>
                  <th className="px-6 py-4">{t("menu.table.status", "Status")}</th>
                  <th className="px-6 py-4 text-right">
                    {canManage ? t("menu.table.actions", "Actions") : t("menu.table.buildOrder", "Order")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-text-muted/10 text-sm">
                {menuItems.map((item) => (
                  <MenuItemRow
                    key={item.id}
                    item={item}
                    isAdmin={canManage}
                    isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
                    onEdit={startEdit}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))}
              </tbody>
            </table>
          </Card>

          {/* Reusable Pagination Control Bar */}
          <MenuItemPagination
            meta={meta}
            currentPage={page}
            limit={limit}
            totalItemsFallback={menuItems.length}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}