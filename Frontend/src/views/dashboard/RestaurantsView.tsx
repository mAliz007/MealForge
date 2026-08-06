import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next";
import {
  useRestaurants,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../hooks/useRestaurants";

import type { Restaurant } from "../../types";
import type { RestaurantFormData } from "../../utils/schemas";
import { RestaurantSearch } from "~components/restaurants/RestaurantSearch";
import { RestaurantFormCard } from "~components/restaurants/RestaurantFormCard";
import { RestaurantEmpty, RestaurantError, RestaurantLoading } from "~components/restaurants/RestaurantStates";
import { RestaurantTable } from "~components/restaurants/RestaurantTable";
import { RestaurantPagination } from "~components/restaurants/RestaurantPagination";

export default function RestaurantsView() {
  const { t } = useTranslation();
  const { isAdmin, isOwner, isLoading: isAuthLoading } = useAuthUser();

  // State
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");

  // TanStack Query
  const { data: response, isLoading: isDataLoading, error, isError } = useRestaurants(page, limit, search);
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const deleteMutation = useDeleteRestaurant();

  const restaurants = response?.data;
  const meta = response?.meta;

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>(undefined);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset page to 1 whenever search query changes
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

  const isLoading = isAuthLoading || isDataLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold text-main">{t("restaurants.title")}</h1>
          <p className="text-sm text-muted">
            {isAdmin 
              ? t("restaurants.adminDescription") 
              : t("restaurants.userDescription")}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Hide Search Bar for Owners */}
          {!isOwner && (
            <div className="w-full sm:w-64 shrink-0">
              <RestaurantSearch value={search} onSearch={handleSearchChange} />
            </div>
          )}

          {/* Add Button - Admin Only */}
          {isAdmin && (
            <Button
              variant="primary"
              className="shrink-0 whitespace-nowrap"
              onClick={() => {
                setEditingRestaurant(undefined);
                setIsFormOpen(true);
              }}
            >
              {t("restaurants.addBtn")}
            </Button>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <RestaurantFormCard
        open={isFormOpen}
        editingRestaurant={editingRestaurant}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelForm}
      />

      {/* Main Content States */}
      {isLoading ? (
        <RestaurantLoading />
      ) : isError ? (
        <RestaurantError message={error?.message} />
      ) : !restaurants || restaurants.length === 0 ? (
        <RestaurantEmpty />
      ) : (
        <div className="space-y-4">
          <RestaurantTable
            restaurants={restaurants}
            isAdmin={isAdmin}
            isOwner={isOwner}
            deletingId={deleteMutation.isPending ? (deleteMutation.variables as number) : null}
            onEdit={startEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
          />

          {/* Pagination omitted for Owners */}
          {!isOwner && (
            <RestaurantPagination
              meta={meta}
              currentPage={page}
              limit={limit}
              totalItemsFallback={restaurants.length}
              onPageChange={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}