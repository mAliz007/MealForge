import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { MenuItem } from "../types";
import {
  addItem,
  removeItem,
  updateQuantityState,
  clearCartState,
  replaceCartWithItem,
  selectCartItems,
  selectCartRestaurantId,
  selectCartTotal,
  selectCartCount,
  type CartItem
} from "../features/cart/cartSlice";

interface CartContextType {
  cartItems: CartItem[];
  restaurantId: number | null;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  // Read data from Redux store via selectors
  const cartItems = useSelector(selectCartItems);
  const restaurantId = useSelector(selectCartRestaurantId);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  // Keep localStorage sync operational whenever Redux state changes
  useEffect(() => {
    localStorage.setItem("food_delivery_cart", JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      localStorage.removeItem("food_delivery_cart_restaurant_id");
    } else {
      localStorage.setItem("food_delivery_cart_restaurant_id", String(restaurantId));
    }
  }, [cartItems, restaurantId]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    // Cross-restaurant check rule
    if (restaurantId !== null && restaurantId !== item.restaurant_id) {
      const confirmClear = window.confirm(
        "You have items from a different restaurant in your cart. Clear cart to add this item?"
      );
      if (!confirmClear) return;

      dispatch(replaceCartWithItem({ item, quantity }));
      return;
    }

    dispatch(addItem({ item, quantity }));
  };

  const removeFromCart = (menuItemId: number) => {
    dispatch(removeItem(menuItemId));
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    // Rule: Quantity cannot go below 1
    if (quantity <= 0) {
      dispatch(removeItem(menuItemId));
      return;
    }
    dispatch(updateQuantityState({ menuItemId, quantity }));
  };

  const clearCart = () => {
    dispatch(clearCartState());
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}