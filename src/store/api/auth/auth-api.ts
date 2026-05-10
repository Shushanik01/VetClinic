import { baseApi } from '~/store/api/base-api';
import type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  RequestPasswordRecoveryRequest,
  RequestPasswordRecoveryResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
  GoogleSignInRequest,
  FacebookSignInRequest,
} from '~/store/api/auth/auth-types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Sign In
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Sign Up
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (data) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: data,
      }),
    }),

    requestPasswordRecovery: builder.mutation<
      RequestPasswordRecoveryResponse,
      RequestPasswordRecoveryRequest
    >({
      query: (body) => ({
        url: '/auth/password-recovery/request',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: '/auth/password-recovery/reset',
        method: 'POST',
        body,
      }),
    }),

    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    resendVerification: builder.mutation<
      ResendVerificationResponse,
      ResendVerificationRequest
    >({
      query: (body) => ({
        url: '/auth/resend-verification',
        method: 'POST',
        body,
      }),
    }),

    googleSignIn: builder.mutation<SignInResponse, GoogleSignInRequest>({
      query: (body) => ({
        url: '/auth/sign-in/google',
        method: 'POST',
        body,
      }),
    }),

    facebookSignIn: builder.mutation<SignInResponse, FacebookSignInRequest>({
      query: (body) => ({
        url: '/auth/sign-in/facebook',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useRequestPasswordRecoveryMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useGoogleSignInMutation,
  useFacebookSignInMutation,
} = authApi;
