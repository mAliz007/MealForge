// frontend/src/views/dashboard/MenuItemsView.tsx
import { useState } from "react";
import { mockMenuItems } from "../../utils/mockData";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function MenuItemsView() {
  const [data, setData] = useState(mockMenuItems);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-sm text-gray-500">Configure catalog availability and listing matrices.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}>Simulate Loading</Button>
          <Button variant="danger" onClick={() => setData([])}>Clear Data</Button>
          <Button variant="primary" onClick={() => setData(mockMenuItems)}>Reset Data</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
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
                <th className="px-6 py-3">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4 font-mono">#{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    {item.description && <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.available ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                    }`}>
                      {item.available ? "In Stock" : "Unavailable"}
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