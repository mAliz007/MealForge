// frontend/src/views/dashboard/OrdersView.tsx
import { useState } from "react";
import { mockOrders } from "../../utils/mockData";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function OrdersView() {
  const [data, setData] = useState(mockOrders);
  const [loading, setLoading] = useState(false);

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fulfillment Queue</h1>
          <p className="text-sm text-gray-500">Live request processing ledger and transactional totals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}>Simulate Loading</Button>
          <Button variant="danger" onClick={() => setData([])}>Clear Data</Button>
          <Button variant="primary" onClick={() => setData(mockOrders)}>Reset Data</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          Syncing open receipts...
        </div>
      ) : data.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">No order operations on record.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-600">
                <th className="px-6 py-3">Invoice Code</th>
                <th className="px-6 py-3">Restaurant ID</th>
                <th className="px-6 py-3">Gross Total</th>
                <th className="px-6 py-3">Execution State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {data.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70">
                  <td className="px-6 py-4 font-mono font-medium">#{order.id}</td>
                  <td className="px-6 py-4 font-mono">Restaurant #{order.restaurantId}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${statusColors[order.status]}`}>
                      {order.status}
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