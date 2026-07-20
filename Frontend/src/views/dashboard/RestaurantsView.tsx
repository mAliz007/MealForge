import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useTranslation } from "react-i18next"; // Added i18n
import {
  useRestaurants,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "../../hooks/useRestaurants";
import {
  RestaurantLoading,
  RestaurantError,
  RestaurantEmpty,
} from "../../components/restaurants/RestaurantStates";
import { RestaurantTable } from "../../components/restaurants/RestaurantTable";
import { RestaurantFormCard } from "../../components/restaurants/RestaurantFormCard";
import type { Restaurant } from "../../types";
import type { RestaurantFormData } from "../../utils/schemas";

export default function RestaurantsView() {
  const { t } = useTranslation();

  // 1. Role Authentication
  const { isAdmin, isLoading: isAuthLoading } = useAuthUser();

  // 2. TanStack Query & Mutations
  const { data: restaurants, isLoading: isDataLoading, error, isError } = useRestaurants();
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const deleteMutation = useDeleteRestaurant();

  // 3. UI State for the Modal Form Panel
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>(undefined);

  // Form submit router (Create vs Edit)
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

  // Determine global loading state
  const isLoading = isAuthLoading || isDataLoading;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-main">{t("restaurants.title")}</h1>
          <p className="text-sm text-muted">
            {isAdmin 
              ? t("restaurants.adminDescription") 
              : t("restaurants.userDescription")}
          </p>
        </div>
        
        {/* Only show Add button if user is an authorized Admin */}
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setEditingRestaurant(undefined);
                setIsFormOpen(true);
              }}
            >
              {t("restaurants.addBtn")}
            </Button>
          </div>
        )}
      </div>

      {/* MUI Dialog (Modal Form) */}
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
        <RestaurantTable
          restaurants={restaurants}
          isAdmin={isAdmin}
          deletingId={deleteMutation.isPending ? (deleteMutation.variables as number) : null}
          onEdit={startEdit}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      )}
    </div>
  );
}