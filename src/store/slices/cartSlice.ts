import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Resolved CartItem is built in the useApp shim (product/deal lookup lives there).
    addItem: (state, action: PayloadAction<{ item: CartItem; mergeQty?: boolean }>) => {
      const { item, mergeQty } = action.payload;
      const existing = state.items.find(i =>
        item.gb ? i.deal?.id === item.deal?.id : i.productId === item.productId && !i.gb,
      );
      if (existing) {
        existing.qty = mergeQty ? existing.qty + item.qty : item.qty;
      } else {
        state.items.push(item);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.key !== action.payload);
    },
    setItemQty: (state, action: PayloadAction<{ key: string; qty: number }>) => {
      const { key, qty } = action.payload;
      if (qty <= 0) {
        state.items = state.items.filter(i => i.key !== key);
        return;
      }
      const it = state.items.find(i => i.key === key);
      if (it) it.qty = qty;
    },
    clearCart: state => { state.items = []; },
  },
});

export const { addItem, removeItem, setItemQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
