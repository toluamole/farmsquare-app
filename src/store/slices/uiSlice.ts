import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  toastMessage: string | null;
  doneToday: boolean;
  /** Session start timestamp, used for countdown timers. */
  t0: number;
}

const initialState: UiState = {
  toastMessage: null,
  doneToday: false,
  t0: Date.now(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setToast: (state, action: PayloadAction<string>) => { state.toastMessage = action.payload; },
    clearToast: state => { state.toastMessage = null; },
    markDoneToday: state => { state.doneToday = true; },
  },
});

export const { setToast, clearToast, markDoneToday } = uiSlice.actions;
export default uiSlice.reducer;
