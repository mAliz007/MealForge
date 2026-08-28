import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAlertStore } from "../store/useAlertStore";
import type { MenuItem } from "../types";
import {
  addItem,
  removeItem,
  updateQuantityState,
  clearCartState,
  replaceCartWithItem,
  setCartFromServer,
  selectCartItems,
  selectCartRestaurantId,
  selectCartTotal,
  selectCartCount,
  type CartItem,
} from "../features/cart/cartSlice";
import {
  useCart as useCartQuery,
  useAddToCart,
  useUpdateCartQuantity,
  useRemoveCartItem,
  useClearCart,
} from "../hooks/useCartQuery";
import { useAuthUser } from "../hooks/useAuthUser";

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
  const { t } = useTranslation();
  const showAlert = useAlertStore((state) => state.showAlert);

  // Authenticated user state
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const isAuthenticated = Boolean(user);

  // Redux Selectors
  const cartItems = useSelector(selectCartItems);
  const restaurantId = useSelector(selectCartRestaurantId);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  // TanStack Query Hooks
  const { data: serverCartData } = useCartQuery(isAuthenticated && !isAuthLoading);
  const addToCartMutation = useAddToCart();
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  // Sync server cart into Redux when query data changes for logged-in user
  useEffect(() => {
    if (isAuthenticated && serverCartData) {
      dispatch(
        setCartFromServer({
          cartItems: serverCartData.cartItems,
          restaurantId: serverCartData.restaurantId,
        })
      );
    }
  }, [isAuthenticated, serverCartData, dispatch]);

  // Conflict Alert Prompt
  const triggerConflictAlert = (item: MenuItem, quantity: number) => {
    showAlert({
      title: t("cart.clearConflictTitle"),
      message: t("cart.clearConflictMessage"),
      confirmText: t("common.actions.confirm"),
      cancelText: t("common.actions.cancel"),
      variant: "warning",
      onConfirm: () => {
        if (isAuthenticated) {
          addToCartMutation.mutate({
            menu_item_id: item.id,
            quantity,
            replace_if_conflict: true,
          });
        } else {
          dispatch(replaceCartWithItem({ item, quantity }));
        }
      },
    });
  };

  // Handle Add To Cart
  const addToCart = (item: MenuItem, quantity = 1) => {
    const executeAdd = (replaceIfConflict = false) => {
      if (isAuthenticated) {
        addToCartMutation.mutate(
          {
            menu_item_id: item.id,
            quantity,
            replace_if_conflict: replaceIfConflict,
          },
          {
            onError: (err: any) => {
              if (err?.error === "restaurant_conflict") {
                triggerConflictAlert(item, quantity);
              }
            },
          }
        );
      } else {
        if (replaceIfConflict) {
          dispatch(replaceCartWithItem({ item, quantity }));
        } else {
          dispatch(addItem({ item, quantity }));
        }
      }
    };

    // Quick client-side restaurant conflict check
    if (restaurantId !== null && restaurantId !== item.restaurant_id) {
      triggerConflictAlert(item, quantity);
      return;
    }

    executeAdd(false);
  };

  // Remove single item
  const removeFromCart = (menuItemId: number) => {
    if (isAuthenticated) {
      removeCartItemMutation.mutate(menuItemId);
    }
    dispatch(removeItem(menuItemId));
  };

  // Update Item Quantity
  const updateQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    if (isAuthenticated) {
      updateQuantityMutation.mutate({ menuItemId, payload: { quantity } });
    }
    dispatch(updateQuantityState({ menuItemId, quantity }));
  };

  // Clear Entire Cart
  const clearCart = () => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
    }
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