import { Card } from "../ui/Card";

interface StateProps {
  message?: string;
}

export function RestaurantLoading() {
  return (
    <div className="flex justify-center items-center h-48 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
      Syncing records...
    </div>
  );
}

export function RestaurantError({ message }: StateProps) {
  return (
    <Card className="border-red-200 bg-red-50/50 p-6 text-center">
      <p className="text-sm font-semibold text-red-900">Failed to sync records</p>
      <p className="text-xs text-red-600 mt-1">{message || "Please check your authentication or server connectivity."}</p>
    </Card>
  );
}

export function RestaurantEmpty() {
  return (
    <Card className="text-center py-12 text-gray-500">
      <p className="text-lg font-medium">No restaurants found.</p>
      <p className="text-sm text-gray-400 mt-1">Get started by adding your first dining partner.</p>
    </Card>
  );
}