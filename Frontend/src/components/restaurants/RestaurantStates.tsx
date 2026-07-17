import { Card } from "../ui/Card";

interface StateProps {
  message?: string;
}

export function RestaurantLoading() {
  return (
    /* Swapped text-gray-500 to text-muted */
    <div className="flex justify-center items-center h-48 text-muted">
      {/* Updated spinner track to utilize your electric blue accent token */}
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mr-2"></div>
      Syncing records...
    </div>
  );
}

export function RestaurantError({ message }: StateProps) {
  return (
    /* 
      Integrated custom Card base with red tint overrides.
      Using red opacity overlays keeps it looking balanced in both light and dark.
    */
    <Card className="border-red-500/30 bg-red-500/5 p-6 text-center">
      <p className="text-sm font-semibold text-red-500">Failed to sync records</p>
      <p className="text-xs text-red-400/80 mt-1">{message || "Please check your authentication or server connectivity."}</p>
    </Card>
  );
}

export function RestaurantEmpty() {
  return (
    /* Swapped text-gray-500 and text-gray-400 to text-main and text-muted */
    <Card className="text-center py-12">
      <p className="text-lg font-medium text-main">No restaurants found.</p>
      <p className="text-sm text-muted mt-1">Get started by adding your first dining partner.</p>
    </Card>
  );
}