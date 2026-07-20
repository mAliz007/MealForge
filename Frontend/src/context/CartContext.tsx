import React, { createContext, useContext, useState, useEffect } from "react";
import type { MenuItem } from "../types";

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

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
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("food_delivery_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Track the active restaurant ID based on the first item added
  const [restaurantId, setRestaurantId] = useState<number | null>(() => {
    const saved = localStorage.getItem("food_delivery_cart_restaurant_id");
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem("food_delivery_cart", JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setRestaurantId(null);
      localStorage.removeItem("food_delivery_cart_restaurant_id");
    } else {
      localStorage.setItem("food_delivery_cart_restaurant_id", String(restaurantId));
    }
  }, [cartItems, restaurantId]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    // Cross-restaurant check
    if (restaurantId !== null && restaurantId !== item.restaurantId) {
      const confirmClear = window.confirm(
        "You have items from a different restaurant in your cart. Clear cart to add this item?"
      );
      if (!confirmClear) return;
      
      // Clear cart and initialize with new restaurant's item
      setRestaurantId(item.restaurantId);
      setCartItems([{ menuItem: item, quantity }]);
      return;
    }

    if (restaurantId === null) {
      setRestaurantId(item.restaurantId);
    }

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { menuItem: item, quantity }];
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.menuItem.id !== menuItemId));
  };

  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

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