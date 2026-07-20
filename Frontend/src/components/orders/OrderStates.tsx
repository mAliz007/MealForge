import { Card } from "../ui/Card";

export function OrderLoading() {
  return (
    <div className="flex justify-center items-center h-64 text-gray-500">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
      Syncing open receipts...
    </div>
  );
}

export function OrderError({ message }: { message?: string }) {
  return (
    <Card className="border-red-200 bg-red-50 text-red-800 p-4">
      <h3 className="font-semibold text-sm">Transactional Pipeline Failure</h3>
      <p className="text-xs text-red-600 mt-1">{message || "An unexpected error occurred while communicating with the order routing engine."}</p>
    </Card>
  );
}

export function OrderEmpty() {
  return (
    <Card className="text-center py-12 text-gray-500">
      <p className="text-lg font-medium">No order operations on record.</p>
      <p className="text-sm text-gray-400 mt-1">New transaction tickets will populate here when orders go down live.</p>
    </Card>
  );
}