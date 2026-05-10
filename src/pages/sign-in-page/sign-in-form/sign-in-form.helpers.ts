import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { UserRole } from '~/store/features/user/user-types';
import { isReceptionistRole } from '~/store/features/user/user-role';

const DEFAULT_LOCK_ERROR_MESSAGE =
  'Your account is temporary locked due to multiple failed login attempts. Please try again later.';

type SignInErrorData = {
  message?: unknown;
};

type SignInErrorLike = {
  status?: unknown;
  data?: SignInErrorData;
  error?: unknown;
};

export const getSuccessMessage = (message?: string): string => {
  return message || 'You have logged in successfully.';
};

export const resolvePostSignInRoute = (
  role: UserRole | null,
  from?: string
): string => {
  if (!role) {
    return ROUTES_PATH.ROOT;
  }

  const defaultRoute = isReceptionistRole(role)
    ? ROUTES_PATH.RECEPTIONIST_BOOKING
    : ROUTES_PATH.ROOT;

  return from || defaultRoute;
};

export const extractSignInErrorDetails = (error: unknown) => {
  const parsedError =
    error && typeof error === 'object' ? (error as SignInErrorLike) : undefined;
  const rawMessageFromData =
    typeof parsedError?.data?.message === 'string'
      ? parsedError.data.message
      : undefined;
  const rawMessageFromError =
    typeof parsedError?.error === 'string' ? parsedError.error : undefined;
  const rawMessage = rawMessageFromData || rawMessageFromError;
  const isLockError =
    parsedError?.status === 429 ||
    (typeof rawMessage === 'string' && /lock(ed)?|too many/i.test(rawMessage));

  return {
    rawMessage,
    isLockError,
  };
};

export const getLockErrorMessage = (rawMessage?: string): string => {
  return rawMessage || DEFAULT_LOCK_ERROR_MESSAGE;
};
