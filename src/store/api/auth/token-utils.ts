type TokenPayload = {
  sub?: unknown;
  phoneNumber?: unknown;
  phone_number?: unknown;
  phone?: unknown;
  [key: string]: unknown;
};

const toNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

export const parseIdTokenPayload = (idToken: string): TokenPayload | null => {
  try {
    const [, payload = ''] = idToken.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');

    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const parsed = JSON.parse(jsonPayload) as unknown;
    return parsed && typeof parsed === 'object'
      ? (parsed as TokenPayload)
      : null;
  } catch {
    return null;
  }
};

export const extractUserIdFromIdToken = (
  idToken: string,
  fallbackValue: string
): string => {
  const payload = parseIdTokenPayload(idToken);
  const sub = toNonEmptyString(payload?.sub);

  return sub ?? fallbackValue;
};

export const extractPhoneNumberFromIdToken = (
  idToken: string
): string | undefined => {
  const payload = parseIdTokenPayload(idToken);

  return (
    toNonEmptyString(payload?.phoneNumber) ||
    toNonEmptyString(payload?.phone_number) ||
    toNonEmptyString(payload?.phone)
  );
};
