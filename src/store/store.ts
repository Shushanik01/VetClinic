import { configureStore } from '@reduxjs/toolkit';
import {
  userReducer,
  USER_STORAGE_KEY,
  setUser,
  logout as clearUser,
} from '~/store/features/user/user-slice';
import {
  authReducer,
  AUTH_TOKEN_STORAGE_KEY,
  setCredentials,
  clearCredentials,
} from '~/store/features/auth/auth-slice';
import { extractPhoneNumberFromIdToken } from '~/store/api/auth/token-utils';
import {
  petsReducer,
  PETS_STORAGE_KEY,
  setPets,
  clearPets,
} from '~/store/features/pets/pets-slice';
import { baseApi } from '~/store/api/base-api';
import { isClientRole } from '~/store/features/user/user-role';
import { petsApi } from '~/store/api/pets/pets-api';
import {
  handleExpiredTokenFlow,
  AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY,
  isTokenExpired,
  readTokenExpiryTimestamp,
  saveTokenExpiryTimestamp,
  clearTokenExpiryTimestamp,
} from '~/store/features/auth/token-expiration';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    pets: petsReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

type StoreState = ReturnType<typeof store.getState>;

type PersistedStorageState = {
  token: string | null;
  user: unknown;
  pets: unknown;
};

type ParsedUserRecord = Record<string, unknown>;

const shouldFetchPetsForState = (state: StoreState) =>
  state.auth.isAuthenticated && isClientRole(state.user.currentUser?.role);

let petsSubscription: {
  unsubscribe: () => void;
} | null = null;

type PetsQueryHandle = {
  unwrap: () => Promise<unknown>;
  unsubscribe: () => void;
};

const removePetsFromStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PETS_STORAGE_KEY);
};

const persistPetsToStorage = (pets: unknown) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
};

const parseJsonFromStorage = (value: string | null): unknown => {
  if (!value) {
    return null;
  }

  return JSON.parse(value);
};

const parsePersistedStorageState = (): PersistedStorageState => {
  const tokenValue = parseJsonFromStorage(
    localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  );

  return {
    token: typeof tokenValue === 'string' ? tokenValue : null,
    user: parseJsonFromStorage(localStorage.getItem(USER_STORAGE_KEY)),
    pets: parseJsonFromStorage(localStorage.getItem(PETS_STORAGE_KEY)),
  };
};

const clearPersistedAuthStorage = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(PETS_STORAGE_KEY);
  clearTokenExpiryTimestamp();
};

const clearAuthenticatedState = () => {
  store.dispatch(clearCredentials());
  store.dispatch(clearUser());
  store.dispatch(clearPets());
};

const applyTokenState = (parsedToken: string | null): boolean => {
  if (!parsedToken) {
    store.dispatch(clearCredentials());
    clearTokenExpiryTimestamp();
    return false;
  }

  const storedExpiresAt = readTokenExpiryTimestamp();
  const expired = isTokenExpired(parsedToken, storedExpiresAt);

  if (expired) {
    clearPersistedAuthStorage();
    clearAuthenticatedState();
    handleExpiredTokenFlow();
    return true;
  }

  if (storedExpiresAt === null) {
    saveTokenExpiryTimestamp(parsedToken);
  }

  store.dispatch(setCredentials({ idToken: parsedToken }));
  return false;
};

const toUserRecord = (value: unknown): ParsedUserRecord | null => {
  return typeof value === 'object' && value !== null
    ? (value as ParsedUserRecord)
    : null;
};

const withPhoneNumberFromToken = (
  user: ParsedUserRecord,
  token: string | null
): ParsedUserRecord => {
  if (!token || 'phoneNumber' in user) {
    return user;
  }

  const phoneNumber = extractPhoneNumberFromIdToken(token);
  if (!phoneNumber) {
    return user;
  }

  return { ...user, phoneNumber };
};

const applyUserState = (
  parsedUser: unknown,
  parsedToken: string | null
): ParsedUserRecord | null => {
  const userRecord = toUserRecord(parsedUser);

  if (!userRecord) {
    store.dispatch(clearUser());
    return null;
  }

  const normalizedUser = withPhoneNumberFromToken(userRecord, parsedToken);
  store.dispatch(setUser(normalizedUser as never));
  return normalizedUser;
};

const applyPetsState = (
  parsedPets: unknown,
  userRecord: ParsedUserRecord | null
) => {
  const role = typeof userRecord?.role === 'string' ? userRecord.role : null;
  const shouldRestorePets =
    Array.isArray(parsedPets) && role !== null && isClientRole(role);

  if (shouldRestorePets) {
    store.dispatch(setPets(parsedPets as never));
    return;
  }

  store.dispatch(clearPets());
};

const syncPetsForCurrentSession = () => {
  const state = store.getState();
  const shouldFetchPets = shouldFetchPetsForState(state);

  if (!shouldFetchPets) {
    if (petsSubscription) {
      petsSubscription.unsubscribe();
      petsSubscription = null;
    }

    store.dispatch(clearPets());
    removePetsFromStorage();
    return;
  }

  if (petsSubscription) return;

  const subscription = store.dispatch(
    petsApi.endpoints.getMyPets.initiate(undefined, {
      subscribe: true,
    }) as never
  ) as unknown as PetsQueryHandle;

  petsSubscription = { unsubscribe: subscription.unsubscribe };

  subscription
    .unwrap()
    .then((pets) => {
      store.dispatch(setPets(pets as never));
      persistPetsToStorage(pets);
    })
    .catch((error) => {
      console.warn('Failed to initialize pets from API', error);
    });
};

const syncStateWithLocalStorage = () => {
  if (typeof window === 'undefined') return;

  try {
    const persistedState = parsePersistedStorageState();

    if (applyTokenState(persistedState.token)) {
      return;
    }

    const userRecord = applyUserState(
      persistedState.user,
      persistedState.token
    );
    applyPetsState(persistedState.pets, userRecord);
  } catch (error) {
    console.warn('Error initializing auth from localStorage', error);
  }
};

syncStateWithLocalStorage();
syncPetsForCurrentSession();

let previousShouldFetchPets = shouldFetchPetsForState(store.getState());

store.subscribe(() => {
  const currentShouldFetchPets = shouldFetchPetsForState(store.getState());

  if (currentShouldFetchPets === previousShouldFetchPets) {
    return;
  }

  previousShouldFetchPets = currentShouldFetchPets;
  syncPetsForCurrentSession();
});

const subscribeToAuthStorageChanges = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('storage', (event: StorageEvent) => {
    if (
      event.key === AUTH_TOKEN_STORAGE_KEY ||
      event.key === AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY ||
      event.key === USER_STORAGE_KEY ||
      event.key === PETS_STORAGE_KEY ||
      event.key === null
    ) {
      syncStateWithLocalStorage();
    }
  });
};

subscribeToAuthStorageChanges();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
