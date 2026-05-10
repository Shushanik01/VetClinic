import type { UserRole } from '~/store/features/user/user-types';

// Sign Up
export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  captchaToken: string;
}

export interface SignUpResponse {
  message: string;
}

// Sign In
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInClinic {
  clinicId?: string;
  clinicAddress?: string;
}

export interface SignInResponse {
  message: string;
  idToken: string;
  userId: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole | (string & {});
  clinic?: SignInClinic | null;
}

export interface RequestPasswordRecoveryRequest {
  email: string;
}

export interface RequestPasswordRecoveryResponse {
  message: string;
  expiresInMinutes?: number;
}

export interface ResetPasswordRequest {
  email: string;
  verificationCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  timestamp?: string;
}

export interface VerifyEmailRequest {
  email: string;
  verificationCode: string;
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

// Google Sign In
export interface GoogleSignInRequest {
  accessToken: string;
}

// Facebook Sign In
export interface FacebookSignInRequest {
  accessToken: string;
}
