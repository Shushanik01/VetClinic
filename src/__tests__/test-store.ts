import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '~/store/features/auth/auth-slice';
import { petsReducer } from '~/store/features/pets/pets-slice';
import { userReducer } from '~/store/features/user/user-slice';
import { baseApi } from '~/store/api/base-api';

const rootReducer = {
  user: userReducer,
  auth: authReducer,
  pets: petsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const createTestStore = (preloadedState?: unknown) =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState,
  });

export type TestStore = ReturnType<typeof createTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
