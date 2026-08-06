import { useState } from "react";
import { useAuthUser } from "./useAuthUser";
import { useTranslation } from "react-i18next";
import {
  useRestaurants,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "./useRestaurants";
import type { Restaurant } from "../types";
import type { RestaurantFormData } from "../utils/schemas";

export function useRestaurantsView() {
  const { t } = useTranslation();

  // 1. Role Authentication & Context Scopes
  const {
    isAdmin,
    isOwner,
    isStaff,
    restaurantId,
    isLoading: isAuthLoading,
  } = useAuthUser();

  // 2. Filter & Pagination States
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [search, setSearch] = useState<string>("");

  // 3. Operational Gatekeepers
  const shouldSkipFetch = isAuthLoading || (!isAdmin && !restaurantId);

  // 4. Scope Non-Admins to their specific assigned restaurant ID
  const scopedRestaurantId = !isAdmin && restaurantId ? Number(restaurantId) : null;

  // 5. Query Execution
  const {
    data: responseData,
    isLoading: isDataLoading,
    error,
    isError,
  } = useRestaurants(page, limit, search, scopedRestaurantId, {
    enabled: !shouldSkipFetch,
  });

  const restaurants = responseData?.data || [];
  const meta = responseData?.meta;

  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const deleteMutation = useDeleteRestaurant();

  // 6. Form & Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>(undefined);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleFormSubmit = (formData: RestaurantFormData) => {
    if (editingRestaurant) {
      updateMutation.mutate(
        { id: editingRestaurant.id, data: formData },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingRestaurant(undefined);
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      });
    }
  };

  const startEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingRestaurant(undefined);
  };

  const openCreateForm = () => {
    setEditingRestaurant(undefined);
    setIsFormOpen(true);
  };

  const isLoading = isAuthLoading || (!shouldSkipFetch && isDataLoading);

  return {
    t,
    isAdmin,
    isOwner,
    isStaff,
    isLoading,
    isError: shouldSkipFetch ? false : isError,
    error: shouldSkipFetch ? null : error,
    restaurants,
    meta,
    page,
    setPage,
    limit,
    search,
    setSearch: handleSearchChange,
    isFormOpen,
    editingRestaurant,
    isPending: createMutation.isPending || updateMutation.isPending,
    deleteMutation,
    handleFormSubmit,
    startEdit,
    handleCancelForm,
    openCreateForm,
  };
}