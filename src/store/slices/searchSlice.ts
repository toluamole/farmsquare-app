import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  recent: string[];
}

const initialState: SearchState = { recent: [] };

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const term = action.payload.trim();
      if (!term) return;
      state.recent = [term, ...state.recent.filter(r => r.toLowerCase() !== term.toLowerCase())].slice(0, 8);
    },
    clearRecentSearches: state => {
      state.recent = [];
    },
  },
});

export const { addRecentSearch, clearRecentSearches } = searchSlice.actions;
export default searchSlice.reducer;
