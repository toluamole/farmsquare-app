import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';

const initialState: AuthState = { signedIn: false, guest: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (_state, action: PayloadAction<{ name: string; phone?: string; email?: string; uid?: string }>) => ({
      signedIn: true,
      guest: false,
      name: action.payload.name,
      phone: action.payload.phone,
      email: action.payload.email,
      uid: action.payload.uid,
    }),
    signOut: () => ({ signedIn: false, guest: false }),
    browseAsGuest: () => ({ signedIn: false, guest: true }),
  },
});

export const { signIn, signOut, browseAsGuest } = authSlice.actions;
export default authSlice.reducer;
