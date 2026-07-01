// frontend/src/views/dashboard/MenuItemsView.tsx
import { useState } from "react";
import { mockMenuItems } from "../../utils/mockData";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MenuItemForm } from "../../components/forms/MenuItemForm";
import { type MenuItemFormData } from "../../utils/schemas";
import { type MenuItem } from "../../types";

export default function MenuItemsView() {
  const [data, setData] = useState<MenuItem[]>(mockMenuItems);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>(undefined);

  const handleFormSubmit = (formData: MenuItemFormData) => {
    if (editingItem) {
      // Local edit mutation
      setData(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...formData } : item));
    } else {
      // Local create mutation
      const newItem: MenuItem = {
        id: data.length > 0 ? Math.max(...data.map(m => m.id)) + 1 : 101,
        available: true,
        ...formData
      };
      setData(prev => [...prev, newItem]);
    }
    setIsFormOpen(false);
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-sm text-gray-500">Configure catalog availability and listing matrices.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => { setEditingItem(undefined); setIsFormOpen(true); }}>
            + Add Menu Item
          </Button>
          <Button variant="secondary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 600); }}>Simulate Loading</Button>
          <Button variant="danger" onClick={() => setData([])}>Clear All</Button>
        </div>
      </div>

      {isFormOpen && (
        <Card className="max-w-xl border-blue-200 bg-blue-50/10">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {editingItem ? `Modify: ${editingItem.name}` : "Create New Menu Selection"}
          </h2>
          <MenuItemForm
            defaultValues={editingItem}
            onSubmitSuccess={handleFormSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingItem(undefined); }}
          />
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Mapping catalog references...
        </div>
      ) : data.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No menu selections found.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Item Details</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-mono">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400">Associated Restaurant ID: {item.restaurantId}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.available ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                    }`}>
                      {item.available ? "In Stock" : "Unavailable"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => { setEditingItem(item); setIsFormOpen(true); }}>
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