import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { useAuthUser } from "../../hooks/useAuthUser";
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
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500">
            {isAdmin 
              ? "Manage registered dining partners and operating statuses." 
              : "View active registered dining partners."}
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
              + Add Restaurant
            </Button>
          </div>
        )}
      </div>

      {/* Conditionally Render Form Card */}
      {isFormOpen && (
        <RestaurantFormCard
          editingRestaurant={editingRestaurant}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

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