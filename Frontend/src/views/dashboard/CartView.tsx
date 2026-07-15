import { useCart } from "../../context/CartContext";
import { useCreateOrder } from "../../hooks/useOrders";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export default function CartView() {
  const { 
    cartItems, 
    restaurantId, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartCount 
  } = useCart();

  const createOrderMutation = useCreateOrder();

  // 1. Resolve the Restaurant ID safely (checks context value, then falls back to item data)
  const rawId = Number(restaurantId);
  
  // Cast menuItem as any to safely check snake_case keys if they are delivered by raw JSON APIs
  const fallbackId = cartItems[0]?.menuItem?.restaurantId ?? (cartItems[0]?.menuItem as any)?.restaurant_id;
  const cleanRestaurantId = !isNaN(rawId) && rawId > 0 ? rawId : Number(fallbackId || 0);

  // Static delivery parameters
  const deliveryFee = cartItems.length > 0 ? 2.50 : 0.00;
  
  // Cast cartTotal safely to guarantee a number calculation
  const finalTotal = Number(cartTotal || 0) + deliveryFee;

  const handleCheckout = () => {
    // If we still can't find a valid Restaurant ID, block and warn the user
    if (!cleanRestaurantId || cleanRestaurantId === 0 || cartItems.length === 0) {
      alert("Checkout pipeline rejected: Unable to identify a valid Restaurant ID for this transaction.");
      return;
    }

    // Structure the precise structural schema your Rails backend expects
    const payload = {
      restaurant_id: cleanRestaurantId,
      order_items: cartItems.map(item => ({
        menu_item_id: item.menuItem.id,
        quantity: item.quantity
      }))
    };

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        alert("Transaction complete! Your order has been placed successfully.");
        clearCart(); // Flush local cache tray completely
      },
      onError: (err) => {
        alert(`Checkout pipeline rejected: ${err.message}`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Active Checkout Cart</h1>
        <p className="text-sm text-gray-500">Review pending checkout batches and transaction pipelines.</p>
      </div>

      {createOrderMutation.isPending ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
          Transmitting secure payment and manifest payload...
        </div>
      ) : cartItems.length === 0 ? (
        <Card className="text-center py-12 text-gray-500">
          <p className="text-lg font-medium">Your selection tray is empty.</p>
          <p className="text-sm text-gray-400 mt-1">Navigate to the menu catalog tab to select dishes.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Items Listing Bucket */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Reviewing {cartCount} Items (Source Hub #{cleanRestaurantId || "Pending"})
              </span>
              <button 
                onClick={clearCart} 
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Clear Tray
              </button>
            </div>

            {cartItems.map(({ menuItem, quantity }) => {
              // Explicitly convert string numeric prices coming from active databases
              const parsedPrice = Number(menuItem.price || 0);
              const rowValuation = parsedPrice * quantity;

              return (
                <Card key={menuItem.id} className="flex items-center justify-between p-4 bg-white shadow-sm">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900">{menuItem.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-blue-600">${parsedPrice.toFixed(2)} each</p>
                      <span className="text-xs text-gray-300">|</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm font-semibold w-6 text-center text-gray-800">
                          {quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-bold text-gray-900">${rowValuation.toFixed(2)}</p>
                    <button 
                      onClick={() => removeFromCart(menuItem.id)}
                      className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Checkout Accounting Sidebar */}
          <div>
            <Card className="space-y-4 bg-gray-50/50 border border-gray-200/60 p-5">
              <h2 className="text-lg font-bold text-gray-900">Order Estimation</h2>
              
              <div className="space-y-2 text-sm text-gray-600 border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">${Number(cartTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-900">${deliveryFee.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                <span>Total Due</span>
                <span className="text-lg text-emerald-600">${finalTotal.toFixed(2)}</span>
              </div>

              <Button 
                variant="primary" 
                className="w-full mt-2 py-2.5 text-sm font-semibold tracking-wide"
                onClick={handleCheckout}
                disabled={createOrderMutation.isPending}
              >
                Proceed to Payment Gateway
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}