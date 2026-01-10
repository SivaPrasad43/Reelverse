import type { Course } from "@/shared/types/course";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: Course[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Course>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push(action.payload);
        state.total += action.payload.price || 0;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        state.total -= item.price || 0;
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
