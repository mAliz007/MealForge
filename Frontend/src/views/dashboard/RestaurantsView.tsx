import { Button } from "../../components/ui/Button";
import { useRestaurantsView } from "../../hooks/useRestaurantsView";
import { RestaurantSearch } from "~components/restaurants/RestaurantSearch";
import { RestaurantFormCard } from "~components/restaurants/RestaurantFormCard";
import { RestaurantEmpty, RestaurantError, RestaurantLoading } from "~components/restaurants/RestaurantStates";
import { RestaurantTable } from "~components/restaurants/RestaurantTable";
import { RestaurantPagination } from "~components/restaurants/RestaurantPagination";

export default function RestaurantsView() {
  const {
    t,
    isAdmin,
    isOwner,
    isStaff,
    isLoading,
    isError,
    error,
    restaurants,
    meta,
    page,
    setPage,
    limit,
    search,
    setSearch,
    isFormOpen,
    editingRestaurant,
    deleteMutation,
    handleFormSubmit,
    startEdit,
    handleCancelForm,
    openCreateForm,
  } = useRestaurantsView();

  const isScopedUser = isOwner || isStaff;

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
          {/* Hide Search Bar for Owners & Staff */}
          {!isScopedUser && (
            <div className="w-full sm:w-64 shrink-0">
              <RestaurantSearch value={search} onSearch={setSearch} />
            </div>
          )}

          {/* Add Button - Admin Only */}
          {isAdmin && (
            <Button
              variant="primary"
              className="shrink-0 whitespace-nowrap"
              onClick={openCreateForm}
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

          {/* Pagination omitted for Owners and Staff */}
          {!isScopedUser && (
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