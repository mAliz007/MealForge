import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '../../types'; // Adjust this path to your actual types location

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  restaurantId: number | null;
}

// Initial state reads directly from localStorage to keep your persistence intact
const getInitialState = (): CartState => {
  if (typeof window === 'undefined') return { cartItems: [], restaurantId: null };
  
  const savedCart = localStorage.getItem("food_delivery_cart");
  const savedId = localStorage.getItem("food_delivery_cart_restaurant_id");
  
  return {
    cartItems: savedCart ? JSON.parse(savedCart) : [],
    restaurantId: savedId ? Number(savedId) : null,
  };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: getInitialState(),
  reducers: {
    // Replaces local state changes. Handles initializing restaurantId or appending items
    addItem: (state, action: PayloadAction<{ item: MenuItem; quantity: number }>) => {
      const { item, quantity } = action.payload;
      
      if (state.restaurantId === null) {
        state.restaurantId = item.restaurantId;
      }

      const existingItem = state.cartItems.find((i) => i.menuItem.id === item.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ menuItem: item, quantity });
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((item) => item.menuItem.id !== action.payload);
      if (state.cartItems.length === 0) {
        state.restaurantId = null;
      }
    },

    // Handles absolute quantity updates from the context layer
    updateQuantityState: (state, action: PayloadAction<{ menuItemId: number; quantity: number }>) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.menuItem.id === menuItemId);
      
      if (item) {
        // Enforces Day 21 rule: quantity cannot go below 1
        item.quantity = quantity < 1 ? 1 : quantity;
      }
    },

    clearCartState: (state) => {
      state.cartItems = [];
      state.restaurantId = null;
    },

    // Used specifically when overriding the cart for a new restaurant selection
    replaceCartWithItem: (state, action: PayloadAction<{ item: MenuItem; quantity: number }>) => {
      const { item, quantity } = action.payload;
      state.restaurantId = item.restaurantId;
      state.cartItems = [{ menuItem: item, quantity }];
    }
  },
});

// Root state helper type (Adjust if your root store slice configuration differs)
export type RootState = { cart: CartState };

// --- Derived Totals (Selectors) ---
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartRestaurantId = (state: RootState) => state.cart.restaurantId;

export const selectCartTotal = (state: RootState) =>
  state.cart.cartItems.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);

export const selectCartCount = (state: RootState) =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

export const { 
  addItem, 
  removeItem, 
  updateQuantityState, 
  clearCartState, 
  replaceCartWithItem 
} = cartSlice.actions;

export default cartSlice.reducer;