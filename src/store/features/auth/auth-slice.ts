import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';
import {
  logout as clearUser,
  USER_STORAGE_KEY,
} from '~/store/features/user/user-slice';
import { clearPets, PETS_STORAGE_KEY } from '~/store/features/pets/pets-slice';
import { baseApi } from '~/store/api/base-api';
import { clearTokenExpiryTimestamp } from '~/store/features/auth/token-expiration';

export interface AuthState {
  idToken: string | null;
  isAuthenticated: boolean;
}

export const AUTH_TOKEN_STORAGE_KEY = 'vetcare_idToken';

const initialState: AuthState = {
  idToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ idToken: string }>) {
      state.idToken = action.payload.idToken;
      state.isAuthenticated = true;
    },
    clearCredentials(state) {
      state.idToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const logout = () => (dispatch: Dispatch) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(PETS_STORAGE_KEY);
      clearTokenExpiryTimestamp();
    } catch (error) {
      console.warn('Error clearing auth token from localStorage', error);
    }
  }

  dispatch(clearCredentials());
  dispatch(clearUser());
  dispatch(clearPets());
  dispatch(baseApi.util.resetApiState());
};
