// frontend/src/views/dashboard/RestaurantsView.tsx
import { useState } from "react";
import { mockRestaurants } from "../../utils/mockData";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { RestaurantForm } from "../../components/forms/RestaurantForm";
import { type RestaurantFormData } from "../../utils/schemas";
import { type Restaurant } from "../../types";

export default function RestaurantsView() {
  const [data, setData] = useState<Restaurant[]>(mockRestaurants);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>(undefined);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 600);
  };

  const handleFormSubmit = (formData: RestaurantFormData) => {
    if (editingRestaurant) {
      // Execute local EDIT mutation
      setData(prev => prev.map(item => item.id === editingRestaurant.id ? { ...item, ...formData } : item));
    } else {
      // Execute local CREATE mutation
      const newRestaurant: Restaurant = {
        id: data.length > 0 ? Math.max(...data.map(r => r.id)) + 1 : 1,
        ...formData
      };
      setData(prev => [...prev, newRestaurant]);
    }
    setIsFormOpen(false);
    setEditingRestaurant(undefined);
  };

  const startEdit = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500">Manage registered dining partners and operating statuses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => { setEditingRestaurant(undefined); setIsFormOpen(true); }}>
            + Add Restaurant
          </Button>
          <Button variant="secondary" onClick={simulateLoading}>Simulate Loading</Button>
          <Button variant="danger" onClick={() => setData([])}>Clear All</Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="max-w-xl border-blue-200 bg-blue-50/10">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {editingRestaurant ? `Modify: ${editingRestaurant.name}` : "Register New Dining Partner"}
          </h2>
          <RestaurantForm
            defaultValues={editingRestaurant}
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingRestaurant(undefined); }}
          />
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Syncing records...
        </div>
      ) : data.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No restaurants found.</p>
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
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono font-medium">#{res.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{res.name}</td>
                  <td className="px-6 py-4">{res.location}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${
                      res.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => startEdit(res)}>
                      Edit
                    </Button>
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