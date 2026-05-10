import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

import { baseApi } from '~/store/api/base-api';
import {
  AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY,
  saveTokenExpiryTimestamp,
} from '~/store/features/auth/token-expiration';
import { createTestStore } from '~/__tests__/test-store';
import { AUTH_TOKEN_STORAGE_KEY } from '~/store/features/auth/auth-slice';
import { USER_STORAGE_KEY } from '~/store/features/user/user-slice';
import { PETS_STORAGE_KEY } from '~/store/features/pets/pets-slice';

const createUnsignedJwtWithExp = (exp: number) => {
  const encode = (value: string) =>
    btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  const header = encode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ sub: 'user-1', exp }));

  return `${header}.${payload}.`;
};

const apiWithProbe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    probe: builder.query<{ ok: boolean }, void>({
      query: () => '/probe',
    }),
  }),
  overrideExisting: true,
});

describe('baseApi token expiry guard', () => {
  beforeEach(() => {
    const storage: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      writable: true,
      value: {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => {
          storage[key] = value;
        },
        removeItem: (key: string) => {
          delete storage[key];
        },
      },
    });

    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(PETS_STORAGE_KEY);
    mockNotify.mockReset();
  });

  it('clears session and reports token expiry before request when token is expired', async () => {
    const expiredToken = createUnsignedJwtWithExp(
      Math.floor(Date.now() / 1000) - 10
    );

    saveTokenExpiryTimestamp(expiredToken);

    const store = createTestStore({
      auth: {
        idToken: expiredToken,
        isAuthenticated: true,
      },
      user: {
        isLoggedIn: true,
        currentUser: {
          userId: 'user-1',
          userName: 'Jane Doe',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@vetcare.dev',
          role: 'Client' as const,
        },
      },
      pets: {
        pets: [
          {
            id: 'pet-1',
            petName: 'Milo',
            petSpecies: 'Dog',
          },
        ],
        isLoaded: true,
      },
    });

    const result = await store.dispatch(
      apiWithProbe.endpoints.probe.initiate()
    );

    expect(result).toMatchObject({
      error: {
        status: 401,
      },
    });

    const state = store.getState();

    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.idToken).toBeNull();
    expect(state.user.currentUser).toBeNull();
    expect(state.pets.pets).toEqual([]);

    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Token is expired',
        description: 'Please sign in again.',
        type: 'error',
      })
    );

    expect(window.location.pathname).toBe('/login');
  });
});
