import { Card } from "../ui/Card";

export function MenuItemLoading() {
  return (
    <div className="flex justify-center items-center h-48 text-gray-500">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
      Mapping catalog references...
    </div>
  );
}

export function MenuItemError({ message }: { message?: string }) {
  return (
    <Card className="border-red-200 bg-red-50 text-red-800 p-4">
      <h3 className="font-semibold text-sm">Failed to Sync Catalog References</h3>
      <p className="text-xs text-red-600 mt-1">{message || "An unexpected error occurred while communicating with the catalog service."}</p>
    </Card>
  );
}

export function MenuItemEmpty() {
  return (
    <Card className="text-center py-12 text-gray-500">
      <p className="text-lg font-medium">No menu selections found.</p>
      <p className="text-sm text-gray-400 mt-1">Try broadening your active filter parameters or check back later.</p>
    </Card>
  );
}