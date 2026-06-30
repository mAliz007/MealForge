// frontend/src/views/dashboard/RestaurantsView.tsx
import { useState, useEffect } from "react";
import { mockRestaurants } from "../../utils/mockData";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function RestaurantsView() {
  const [data, setData] = useState(mockRestaurants);
  const [loading, setLoading] = useState(false);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500">Manage registered dining partners and operating statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={simulateLoading}>Simulate Loading</Button>
          <Button variant="danger" onClick={() => setData([])}>Clear Data (Empty State)</Button>
          <Button variant="primary" onClick={() => setData(mockRestaurants)}>Reset Data</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          Retrieving partner records...
        </div>
      ) : data.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No restaurants found.</p>
          <p className="text-sm mt-1">Try resetting the data using the controls above.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4 font-mono font-medium">#{res.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{res.name}</td>
                  <td className="px-6 py-4">{res.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      res.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}