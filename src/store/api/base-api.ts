import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  clearCredentials,
  AUTH_TOKEN_STORAGE_KEY,
} from '~/store/features/auth/auth-slice';
import {
  AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY,
  handleExpiredTokenFlow,
  isTokenExpired,
  readTokenExpiryTimestamp,
} from '~/store/features/auth/token-expiration';
import {
  logout as clearUser,
  USER_STORAGE_KEY,
} from '~/store/features/user/user-slice';
import { clearPets, PETS_STORAGE_KEY } from '~/store/features/pets/pets-slice';

const apiBaseUrl =
  import.meta.env.VITE_API_URL || window.__APP_CONFIG__.API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { idToken?: string | null } };
    const token = state.auth?.idToken;

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');

    return headers;
  },
});

const clearSessionState = (dispatch: (action: unknown) => unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PETS_STORAGE_KEY);
  }

  dispatch(clearCredentials());
  dispatch(clearUser());
  dispatch(clearPets());
};

const baseQueryWithTokenExpiryGuard: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as { auth?: { idToken?: string | null } };
  const token = state.auth?.idToken;

  if (token) {
    const storedExpiresAt = readTokenExpiryTimestamp();

    if (isTokenExpired(token, storedExpiresAt)) {
      clearSessionState(api.dispatch);
      handleExpiredTokenFlow();

      return {
        error: {
          status: 401,
          data: { message: 'Token expired' },
        },
      };
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);

  if (token && result.error && Number(result.error.status) === 401) {
    clearSessionState(api.dispatch);
    handleExpiredTokenFlow();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithTokenExpiryGuard,
  // common tag types for cache invalidation across features

  tagTypes: [
    'AvailableSlots',
    'Pets',
    'Appointments',
    'Profile',
    'Feedback',
    'Veterinarians',
    'Veterinarian',
    'VeterinarianFeedback',
    'VeterinarianAvailableSlots',
  ],

  endpoints: () => ({}),
});
