import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecentState {
  ids: string[];
}

const initialState: RecentState = { ids: [] };

const recentSlice = createSlice({
  name: 'recent',
  initialState,
  reducers: {
    viewProduct: (state, action: PayloadAction<string>) => {
      state.ids = [action.payload, ...state.ids.filter(r => r !== action.payload)].slice(0, 10);
    },
  },
});

export const { viewProduct } = recentSlice.actions;
export default recentSlice.reducer;
