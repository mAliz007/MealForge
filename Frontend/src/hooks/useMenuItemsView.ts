import { useState, useEffect } from "react";
import { useAuthUser } from "./useAuthUser";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext"; 
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

  // 1. Role Authentication & Cart Scopes
  const { isAdmin, isLoading: isAuthLoading } = useAuthUser();
  const { restaurantId: cartRestaurantId, clearCart } = useCart();

  // 2. Filter & Pagination States
  const [localRestaurantId, setLocalRestaurantId] = useState<string>("");
  const [available, setAvailable] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // 3. Unify Restaurant State Identity to prevent loop racing
  const effectiveRestaurantId = isAdmin 
    ? localRestaurantId 
    : (cartRestaurantId !== null ? String(cartRestaurantId) : localRestaurantId);

  // Reset page to 1 whenever search, restaurant, or available filters change
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleAvailableChange = (val: string) => {
    setAvailable(val);
    setPage(1);
  };

  // Sync effect: Reset local dropdown selection back to empty if the cart is fully emptied out
  useEffect(() => {
    if (!isAdmin && cartRestaurantId === null) {
      setLocalRestaurantId("");
    }
  }, [cartRestaurantId, isAdmin]);

  const handleRestaurantFilterChange = (newId: string) => {
    setPage(1);
    if (isAdmin) {
      setLocalRestaurantId(newId);
      return;
    }

    // Customer Interceptor Workflow: Switching restaurants while holding current active items
    if (cartRestaurantId !== null && newId !== String(cartRestaurantId) && newId !== "") {
      const confirmClear = window.confirm(
        "Changing restaurants will clear your current cart items. Proceed?"
      );
      
      if (confirmClear) {
        clearCart(); 
        setLocalRestaurantId(newId);
      }
    } else {
      setLocalRestaurantId(newId);
    }
  };

  // 4. Operational Gatekeepers
  const shouldSkipFetch = !isAdmin && !effectiveRestaurantId;

  const activeFilters = {
    ...(effectiveRestaurantId && { restaurant_id: Number(effectiveRestaurantId) }),
    ...(available && { available: available === "true" }),
    ...(search && { search }),
    page,
    limit,
  };

  // 5. Query Executions passing configuration object downstream
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