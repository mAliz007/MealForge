import { useState } from "react";
import { useAuthUser } from "./useAuthUser";
import { useTranslation } from "react-i18next";
import {
  useMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
} from "./useMenuItems";
import type { MenuItem } from "../types";
import type { MenuItemFormData } from "../utils/schemas";

export function useMenuItemsView() {
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

  // Form Submission Router
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

  const openCreateForm = () => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  };

  // Compute unified structural loading states
  const isLoading = isAuthLoading || isDataLoading;

  return {
    t,
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
    isPending: createMutation.isPending || updateMutation.isPending,
    deleteMutation,
    handleFormSubmit,
    startEdit,
    handleCancelForm,
    openCreateForm,
  };
}