import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../types';

const initialState: AuthState = { signedIn: false, guest: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{ name: string; phone?: string; email?: string; uid?: string; emailVerified?: boolean }>) => ({
      signedIn: true,
      guest: false,
      name: action.payload.name,
      // Phone is app-managed (edited on the Profile screen), not part of the
      // Firebase user — keep it across auth-state syncs that don't supply one.
      phone: action.payload.phone ?? state.phone,
      email: action.payload.email,
      uid: action.payload.uid,
      emailVerified: action.payload.emailVerified,
    }),
    updateAccount: (state, action: PayloadAction<{ name?: string; phone?: string }>) => {
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.phone !== undefined) state.phone = action.payload.phone;
    },
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      state.emailVerified = action.payload;
    },
    signOut: () => ({ signedIn: false, guest: false }),
    browseAsGuest: () => ({ signedIn: false, guest: true }),
  },
});

export const { signIn, setEmailVerified, updateAccount, signOut, browseAsGuest } = authSlice.actions;
export default authSlice.reducer;
