import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reservation } from '../types';

interface ReservationsState {
  reservations: Reservation[];
}

const initialState: ReservationsState = { reservations: [] };

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    addReservation: (state, action: PayloadAction<Reservation>) => {
      state.reservations.unshift(action.payload);
    },
  },
});

export const { addReservation } = reservationsSlice.actions;
export default reservationsSlice.reducer;
