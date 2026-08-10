import { useState, useEffect } from "react";
import { useAuthUser } from "./useAuthUser";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext"; 
import { useAlertStore } from "../store/useAlertStore";
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
  const showAlert = useAlertStore((state) => state.showAlert);

  // 1. Role Authentication & Context Scopes
  const { isAdmin, isOwner, restaurantId: userRestaurantId, isLoading: isAuthLoading } = useAuthUser();
  const { restaurantId: cartRestaurantId, clearCart } = useCart();

  // 2. Filter & Pagination States
  const [localRestaurantId, setLocalRestaurantId] = useState<string>("");
  const [available, setAvailable] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // 3. Unify Restaurant State Identity
  const effectiveRestaurantId = isAdmin
    ? localRestaurantId
    : userRestaurantId
      ? String(userRestaurantId)
      : (cartRestaurantId !== null ? String(cartRestaurantId) : localRestaurantId);

  // Sync effect: Lock non-admin staff/owners to their assigned restaurant ID
  useEffect(() => {
    if (!isAdmin && userRestaurantId) {
      setLocalRestaurantId(String(userRestaurantId));
    }
  }, [isAdmin, userRestaurantId]);

  // Sync effect: Reset local selection if cart is emptied (customers)
  useEffect(() => {
    if (!isAdmin && !isOwner && !userRestaurantId && cartRestaurantId === null) {
      setLocalRestaurantId("");
    }
  }, [cartRestaurantId, isAdmin, isOwner, userRestaurantId]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleAvailableChange = (val: string) => {
    setAvailable(val);
    setPage(1);
  };

  const handleRestaurantFilterChange = (newId: string) => {
    setPage(1);

    // Staff or Owners locked to a restaurant
    if (userRestaurantId) {
      setLocalRestaurantId(String(userRestaurantId));
      return;
    }

    // Admins or Customers without items in cart
    if (isAdmin || cartRestaurantId === null) {
      setLocalRestaurantId(newId);
      return;
    }

    // Customer with active cart items switching to another restaurant
    if (cartRestaurantId !== null && newId !== String(cartRestaurantId) && newId !== "") {
      showAlert({
        title: t("menu.filter.clearCartTitle", "Clear Cart?"),
        message: t("menu.filter.clearCartMessage", "Changing restaurants will clear your current cart items."),
        confirmText: t("common.actions.confirm", "Confirm"),
        cancelText: t("common.actions.cancel", "Cancel"),
        variant: "warning",
        onConfirm: () => {
          clearCart(); 
          setLocalRestaurantId(newId);
        },
      });
    } else {
      setLocalRestaurantId(newId);
    }
  };

  // 4. Operational Gatekeepers
  const shouldSkipFetch = isAuthLoading || (!isAdmin && !effectiveRestaurantId);

  const activeFilters = {
    ...(effectiveRestaurantId ? { restaurant_id: Number(effectiveRestaurantId) } : {}),
    ...(available ? { available: available === "true" } : {}),
    ...(search ? { search } : {}),
    page,
    limit,
  };

  // 5. Query Executions
  const { data: responseData, isLoading: isDataLoading, error, isError } = useMenuItems(
    activeFilters,
    { enabled: !shouldSkipFetch }
  );

  const menuItems = responseData?.data || [];
  const meta = responseData?.meta;
  
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();

  // 6. Form Management UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);

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

  const isLoading = isAuthLoading || (!shouldSkipFetch && isDataLoading);

  return {
    t,
    isAdmin,
    isOwner,
    isLoading,
    isError: shouldSkipFetch ? false : isError,
    error: shouldSkipFetch ? null : error,
    menuItems,
    meta,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch: handleSearchChange,
    restaurantId: effectiveRestaurantId,
    setRestaurantId: handleRestaurantFilterChange,
    shouldSkipFetch,
    available,
    setAvailable: handleAvailableChange,
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