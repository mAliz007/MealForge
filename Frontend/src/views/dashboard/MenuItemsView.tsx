import { useState } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
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
    <div className="space-y-6">
      {/* Page Header Layout */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-sm text-gray-500">
            {isAdmin 
              ? "Configure catalog availability and administrative listing matrices." 
              : "Browse culinary lists and build custom food delivery orders."}
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
              + Add Menu Item
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

      {/* Accordion/Form Modal Entry Wrapper */}
      {isFormOpen && (
        <Card className="max-w-xl border-blue-200 bg-blue-50/10">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {editingItem ? `Modify: ${editingItem.name}` : "Create New Menu Selection"}
          </h2>
          <MenuItemFormPanel
            editingItem={editingItem}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
        </Card>
      )}

      {/* Base Response Content Rendering Flow */}
      {isLoading ? (
        <MenuItemLoading />
      ) : isError ? (
        <MenuItemError message={error?.message} />
      ) : !menuItems || menuItems.length === 0 ? (
        <MenuItemEmpty />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Item Details</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">
                  {isAdmin ? "Actions" : "Build Order"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
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