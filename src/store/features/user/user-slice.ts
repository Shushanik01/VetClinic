import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '~/store/features/user/user-types';

export const USER_STORAGE_KEY = 'vetcare_user';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isLoggedIn = true;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    logout(state) {
      state.currentUser = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, updateUser, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
