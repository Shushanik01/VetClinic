export type SignInAttemptState = {
  count: number;
  blockedUntil: number; // timestamp in ms, 0 when not blocked
};

const SIGN_IN_ATTEMPTS_KEY = 'sign_in_attempts';
export const FAILED_ATTEMPT_LIMIT = 4;
export const BLOCK_DURATION_MS = 60_000; // 1 minute
export const TOO_MANY_ATTEMPTS_MESSAGE =
  'Too many failed sign in attempts. Please try again later.';

const DEFAULT_ATTEMPT_STATE: SignInAttemptState = {
  count: 0,
  blockedUntil: 0,
};

export const getSignInAttemptState = (): SignInAttemptState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SIGN_IN_ATTEMPTS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SignInAttemptState;
    if (
      typeof parsed.count === 'number' &&
      typeof parsed.blockedUntil === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const setSignInAttemptState = (state: SignInAttemptState | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!state) {
    window.localStorage.removeItem(SIGN_IN_ATTEMPTS_KEY);
    return;
  }

  window.localStorage.setItem(SIGN_IN_ATTEMPTS_KEY, JSON.stringify(state));
};

export const resetSignInAttempts = () => {
  setSignInAttemptState(DEFAULT_ATTEMPT_STATE);
};

/**
 * Check if sign in should currently be blocked.
 * If a previous block has expired, this will reset the stored state.
 */
export const isSignInBlocked = (now: number): boolean => {
  const state = getSignInAttemptState();
  if (!state) {
    return false;
  }

  if (state.blockedUntil > now) {
    return true;
  }

  if (state.blockedUntil > 0 && state.blockedUntil <= now) {
    // Block expired, reset attempts so user gets full tries again
    resetSignInAttempts();
  }

  return false;
};

/**
 * Record a failed attempt and update localStorage.
 * Returns true when this failure caused a new lock window to start.
 */
export const registerFailedSignInAttempt = (now: number): boolean => {
  const current = getSignInAttemptState() ?? DEFAULT_ATTEMPT_STATE;

  let next: SignInAttemptState = {
    count: current.count + 1,
    blockedUntil: current.blockedUntil,
  };

  let lockedNow = false;

  if (next.count >= FAILED_ATTEMPT_LIMIT) {
    // Start lock window and reset counter
    next = {
      count: 0,
      blockedUntil: now + BLOCK_DURATION_MS,
    };
    lockedNow = true;
  }

  setSignInAttemptState(next);

  return lockedNow;
};
