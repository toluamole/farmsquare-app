import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '../types';

interface AddressesState {
  addresses: Address[];
}

const initialState: AddressesState = {
  addresses: [
    { name: 'Adaobi Okeke', phone: '+234 803 555 0147', street: '14 Unity Road', city: 'Ikeja, Lagos' },
  ],
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
  },
});

export const { addAddress } = addressesSlice.actions;
export default addressesSlice.reducer;
