import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

import {
  AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY,
  clearTokenExpiryTimestamp,
  extractTokenExpiryTimestamp,
  isTokenExpired,
  readTokenExpiryTimestamp,
  saveTokenExpiryTimestamp,
  showTokenExpiredNotification,
} from '~/store/features/auth/token-expiration';

const createUnsignedJwtWithExp = (exp: number) => {
  const encode = (value: string) =>
    btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');

  const header = encode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encode(JSON.stringify({ sub: 'user-1', exp }));

  return `${header}.${payload}.`;
};

describe('token-expiration', () => {
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

    localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
    mockNotify.mockReset();
  });

  it('extracts expiration timestamp from token exp claim', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = createUnsignedJwtWithExp(nowSec + 60);

    const expiresAt = extractTokenExpiryTimestamp(token);

    expect(typeof expiresAt).toBe('number');
    expect(expiresAt).toBe((nowSec + 60) * 1000);
  });

  it('persists and reads token expiration timestamp from localStorage', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = createUnsignedJwtWithExp(nowSec + 120);

    saveTokenExpiryTimestamp(token);

    const raw = localStorage.getItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
    expect(raw).not.toBeNull();
    expect(readTokenExpiryTimestamp()).toBe((nowSec + 120) * 1000);

    clearTokenExpiryTimestamp();
    expect(localStorage.getItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY)).toBeNull();
  });

  it('detects expired and non-expired token states', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const activeToken = createUnsignedJwtWithExp(nowSec + 120);
    const expiredToken = createUnsignedJwtWithExp(nowSec - 5);

    expect(isTokenExpired(activeToken, null, Date.now())).toBe(false);
    expect(isTokenExpired(expiredToken, null, Date.now())).toBe(true);
  });

  it('shows token-expired notification with required title and description', () => {
    showTokenExpiredNotification(1_000_000);

    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Token is expired',
        description: 'Please sign in again.',
        type: 'error',
      })
    );
  });
});
