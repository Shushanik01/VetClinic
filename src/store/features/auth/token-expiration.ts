import { notify } from '~/app/providers/notifications';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { parseIdTokenPayload } from '~/store/api/auth/token-utils';

export const AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY = 'vetcare_idTokenExpiresAt';

let lastTokenExpiredNotificationAt = 0;

const NOTIFICATION_COOLDOWN_MS = 1500;

const parseStoredNumber = (rawValue: string | null): number | null => {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (typeof parsed === 'number' && Number.isFinite(parsed)) {
      return parsed;
    }
  } catch {
    const numeric = Number(rawValue);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  return null;
};

export const extractTokenExpiryTimestamp = (idToken: string): number | null => {
  const payload = parseIdTokenPayload(idToken);
  const expiresAtSeconds = payload?.exp;

  if (
    typeof expiresAtSeconds !== 'number' ||
    !Number.isFinite(expiresAtSeconds) ||
    expiresAtSeconds <= 0
  ) {
    return null;
  }

  return Math.trunc(expiresAtSeconds * 1000);
};

export const saveTokenExpiryTimestamp = (idToken: string) => {
  if (typeof window === 'undefined') return;

  const expiresAt = extractTokenExpiryTimestamp(idToken);

  if (typeof expiresAt === 'number') {
    localStorage.setItem(
      AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY,
      JSON.stringify(expiresAt)
    );
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
};

export const clearTokenExpiryTimestamp = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY);
};

export const readTokenExpiryTimestamp = (): number | null => {
  if (typeof window === 'undefined') return null;

  return parseStoredNumber(
    localStorage.getItem(AUTH_TOKEN_EXPIRES_AT_STORAGE_KEY)
  );
};

export const isExpiredTimestamp = (
  expiresAt: number | null,
  now = Date.now()
): boolean => {
  if (typeof expiresAt !== 'number') return false;
  return now >= expiresAt;
};

export const isTokenExpired = (
  idToken: string,
  storedExpiresAt: number | null = null,
  now = Date.now()
): boolean => {
  const expiresAt =
    typeof storedExpiresAt === 'number'
      ? storedExpiresAt
      : extractTokenExpiryTimestamp(idToken);

  return isExpiredTimestamp(expiresAt, now);
};

export const showTokenExpiredNotification = (now = Date.now()) => {
  if (now - lastTokenExpiredNotificationAt < NOTIFICATION_COOLDOWN_MS) {
    return;
  }

  lastTokenExpiredNotificationAt = now;

  notify({
    title: 'Token is expired',
    description: 'Please sign in again.',
    type: 'error',
  });
};

export const redirectToSignIn = () => {
  if (typeof window === 'undefined') return;

  if (window.location.pathname === ROUTES_PATH.LOGIN) {
    return;
  }

  window.history.replaceState({}, '', ROUTES_PATH.LOGIN);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const handleExpiredTokenFlow = () => {
  showTokenExpiredNotification();
  redirectToSignIn();
};
