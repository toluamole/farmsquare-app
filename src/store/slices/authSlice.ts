import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';

const initialState: AuthState = { signedIn: false, guest: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (_state, action: PayloadAction<{ name: string; phone?: string; email?: string; uid?: string; emailVerified?: boolean }>) => ({
      signedIn: true,
      guest: false,
      name: action.payload.name,
      phone: action.payload.phone,
      email: action.payload.email,
      uid: action.payload.uid,
      emailVerified: action.payload.emailVerified,
    }),
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.emailVerified = action.payload;
    },
    signOut: () => ({ signedIn: false, guest: false }),
    browseAsGuest: () => ({ signedIn: false, guest: true }),
  },
});

export const { signIn, setEmailVerified, signOut, browseAsGuest } = authSlice.actions;
export default authSlice.reducer;
