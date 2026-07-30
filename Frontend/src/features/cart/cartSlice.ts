import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MenuItem } from '../../types'; // Adjust path to match your actual types location

export interface CartItem {
  id?: number;
  menuItem: MenuItem;
  quantity: number;
}

export interface CartState {
  cartItems: CartItem[];
  restaurantId: number | null;
}

const initialState: CartState = {
  cartItems: [],
  restaurantId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Primary action: Hydrates/Syncs Redux with the Rails server state
    setCartFromServer: (state, action: PayloadAction<{ cartItems: CartItem[]; restaurantId: number | null }>) => {
      state.cartItems = action.payload.cartItems;
      state.restaurantId = action.payload.restaurantId;
    },

    // In-memory updates for guest browsing or optimistic updates
    addItem: (state, action: PayloadAction<{ item: MenuItem; quantity: number }>) => {
      const { item, quantity } = action.payload;

      if (state.restaurantId === null) {
        state.restaurantId = item.restaurant_id;
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

    updateQuantityState: (state, action: PayloadAction<{ menuItemId: number; quantity: number }>) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i.menuItem.id === menuItemId);

      if (item) {
        item.quantity = quantity < 1 ? 1 : quantity;
      }
    },

    clearCartState: (state) => {
      state.cartItems = [];
      state.restaurantId = null;
    },

    replaceCartWithItem: (state, action: PayloadAction<{ item: MenuItem; quantity: number }>) => {
      const { item, quantity } = action.payload;
      state.restaurantId = item.restaurant_id;
      state.cartItems = [{ menuItem: item, quantity }];
    }
  },
});

// Root state helper type
export type RootState = { cart: CartState };

// --- Selectors ---
export const selectCartItems = (state: RootState) => state.cart.cartItems;
export const selectCartRestaurantId = (state: RootState) => state.cart.restaurantId;

export const selectCartTotal = (state: RootState) =>
  state.cart.cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);

export const selectCartCount = (state: RootState) =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

export const { 
  setCartFromServer,
  addItem, 
  removeItem, 
  updateQuantityState, 
  clearCartState, 
  replaceCartWithItem 
} = cartSlice.actions;

export default cartSlice.reducer;