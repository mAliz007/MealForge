
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "./useOrders";
import { useTranslation } from "react-i18next";

export function useCartView() {
  const { t } = useTranslation();
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

  // Resolve the Restaurant ID safely
  const rawId = Number(restaurantId);
  const fallbackId = cartItems[0]?.menuItem?.restaurant_id ?? (cartItems[0]?.menuItem as any)?.restaurant_id;
  const cleanRestaurantId = !isNaN(rawId) && rawId > 0 ? rawId : Number(fallbackId || 0);

  // Static delivery parameters
  const deliveryFee = cartItems.length > 0 ? 2.50 : 0.00;
  const finalTotal = Number(cartTotal || 0) + deliveryFee;

  const handleCheckout = () => {
    if (!cleanRestaurantId || cleanRestaurantId === 0 || cartItems.length === 0) {
      alert(t("cart.alerts.invalidHub"));
      return;
    }

    const payload = {
      restaurant_id: cleanRestaurantId,
      order_items: cartItems.map(item => ({
        menu_item_id: item.menuItem.id,
        quantity: item.quantity
      }))
    };

    createOrderMutation.mutate(payload, {
      onSuccess: () => {
        clearCart();
      },
      onError: (err) => {
        alert(t("cart.alerts.error", { message: err.message }));
      }
    });
  };

  return {
    t,
    cartItems,
    cartCount,
    cartTotal,
    deliveryFee,
    finalTotal,
    cleanRestaurantId,
    isPending: createOrderMutation.isPending,
    updateQuantity,
    removeFromCart,
    clearCart,
    handleCheckout,
  };
}