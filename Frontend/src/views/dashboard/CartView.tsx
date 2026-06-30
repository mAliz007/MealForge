// frontend/src/views/dashboard/CartView.tsx
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function CartView() {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Checkout Cart</h1>
        <p className="text-sm text-gray-500">Review pending checkout batches and transaction pipelines.</p>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }}>Simulate Loading</Button>
        <Button variant="danger" onClick={() => setEmpty(prev => !prev)}>Toggle Empty/Populated State</Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          Calculating cart valuations...
        </div>
      ) : empty ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Your selection tray is empty.</p>
          <p className="text-sm text-gray-400 mt-1">Navigate to the menu catalog tab to select dishes.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Truffle Bacon Cheeseburger</h3>
                <p className="text-xs text-gray-500 mt-0.5">Quantity: 2</p>
              </div>
              <p className="font-medium text-gray-900">$29.98</p>
            </Card>
            <Card className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Garlic Parmesan Fries</h3>
                <p className="text-xs text-gray-500 mt-0.5">Quantity: 1</p>
              </div>
              <p className="font-medium text-gray-900">$5.49</p>
            </Card>
          </div>
          <div>
            <Card className="space-y-4 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Order Estimation</h2>
              <div className="space-y-2 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>$35.47</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>$2.50</span></div>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total Due</span>
                <span>$37.97</span>
              </div>
              <Button variant="primary" className="w-full mt-2">Proceed to Payment Gateway</Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}