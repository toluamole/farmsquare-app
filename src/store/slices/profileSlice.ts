import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../types';

interface ProfileState {
  profile: UserProfile;
  cropSetup: boolean;
}

const initialState: ProfileState = {
  profile: { state: 'Lagos', lga: 'Ikeja', crops: ['tomato'], types: ['Crop Farmer'], size: '' },
  cropSetup: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    finishSetup: state => { state.cropSetup = true; },
  },
});

export const { setProfile, finishSetup } = profileSlice.actions;
export default profileSlice.reducer;
