import { delay, http, HttpResponse } from '~/mocks/handlers/utils/base-http';
import { authEntity } from '~/mocks/data/store/auth';
import type {
  SignInRequest,
  SignUpRequest,
  GoogleSignInRequest,
  FacebookSignInRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  RequestPasswordRecoveryRequest,
  ResetPasswordRequest,
} from '~/store/api/auth/auth-types';
import {
  buildUserName,
  createSessionToken,
  users,
} from '~/mocks/data/store/auth/data';

const NETWORK_DELAY_MS = 250;

const MOCK_OAUTH_USER = users[0]; // Taylor Green — Client

export const authHandlers = [
  http.post('/auth/sign-up', async ({ request }) => {
    const payload = (await request.json()) as SignUpRequest;
    const result = authEntity.signUp(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),

  http.post('/auth/sign-in', async ({ request }) => {
    const payload = (await request.json()) as SignInRequest;
    const result = authEntity.signIn(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),

  http.post('/auth/sign-in/google', async ({ request }) => {
    const payload = (await request.json()) as GoogleSignInRequest;

    await delay(NETWORK_DELAY_MS);

    if (!payload.accessToken) {
      return HttpResponse.json(
        { message: 'Missing access token' },
        { status: 400 }
      );
    }

    const token = createSessionToken(MOCK_OAUTH_USER);
    return HttpResponse.json({
      message: 'Signed in successfully.',
      idToken: token,
      userId: MOCK_OAUTH_USER.userId,
      userName: buildUserName(
        MOCK_OAUTH_USER.firstName,
        MOCK_OAUTH_USER.lastName
      ),
      email: MOCK_OAUTH_USER.email,
      phoneNumber: MOCK_OAUTH_USER.phoneNumber,
      role: MOCK_OAUTH_USER.role,
    });
  }),

  http.post('/auth/sign-in/facebook', async ({ request }) => {
    const payload = (await request.json()) as FacebookSignInRequest;

    await delay(NETWORK_DELAY_MS);

    if (!payload.accessToken) {
      return HttpResponse.json(
        { message: 'Missing access token' },
        { status: 400 }
      );
    }

    const token = createSessionToken(MOCK_OAUTH_USER);
    return HttpResponse.json({
      message: 'Signed in successfully.',
      idToken: token,
      userId: MOCK_OAUTH_USER.userId,
      userName: buildUserName(
        MOCK_OAUTH_USER.firstName,
        MOCK_OAUTH_USER.lastName
      ),
      email: MOCK_OAUTH_USER.email,
      phoneNumber: MOCK_OAUTH_USER.phoneNumber,
      role: MOCK_OAUTH_USER.role,
    });
  }),

  http.post('/auth/verify-email', async ({ request }) => {
    const payload = (await request.json()) as VerifyEmailRequest;
    const result = authEntity.verifyEmail(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),

  http.post('/auth/resend-verification', async ({ request }) => {
    const payload = (await request.json()) as ResendVerificationRequest;
    const result = authEntity.resendVerification(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),

  http.post('/auth/password-recovery/request', async ({ request }) => {
    const payload = (await request.json()) as RequestPasswordRecoveryRequest;
    const result = authEntity.requestPasswordRecovery(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),

  http.post('/auth/password-recovery/reset', async ({ request }) => {
    const payload = (await request.json()) as ResetPasswordRequest;
    const result = authEntity.resetPassword(payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),
];
