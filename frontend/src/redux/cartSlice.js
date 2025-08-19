import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      const exists = state.items.find(
        (item) => item.code === action.payload.code
      );
      if (!exists) {
        state.items.push(action.payload);
      }
      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + item.discountedPrice, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.code !== action.payload);
      // Recalculate total
      state.total = state.items.reduce((sum, item) => sum + item.discountedPrice, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    updateItemQuantity: (state, action) => {
      const { code, quantity } = action.payload;
      const item = state.items.find(item => item.code === code);
      if (item) {
        item.quantity = Math.max(1, quantity);
        // Recalculate total
        state.total = state.items.reduce((sum, item) => sum + (item.discountedPrice * (item.quantity || 1)), 0);
      }
    },
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    clearCartError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  updateItemQuantity,
  setCartLoading,
  setCartError,
  clearCartError
} = cartSlice.actions;

export default cartSlice.reducer;
