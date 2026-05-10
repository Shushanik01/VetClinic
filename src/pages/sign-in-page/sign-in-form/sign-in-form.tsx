import { useEffect, useRef, useState } from 'react';
import {
  useGoogleSignInMutation,
  useFacebookSignInMutation,
  useRequestPasswordRecoveryMutation,
  useResetPasswordMutation,
  useSignInMutation,
} from '~/store/api/auth/auth-api';
import { useGetMyPetsQuery } from '~/store/api/pets/pets-api';
import type {
  SignInRequest,
  SignInResponse,
} from '~/store/api/auth/auth-types';
import { signInSchema } from './sign-in.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FormField } from '~/components/forms/form-field';
import { TextInput } from '~/components/forms/text-input';
import { PasswordInput } from '~/components/forms/password-input';
import { RegisterPasswordInput } from '~/pages/sign-up-page/sign-up-form/register-password-input';
import { ConfirmPasswordInput } from '~/pages/sign-up-page/sign-up-form/confirm-password-input';
import { VerificationCodeInput } from '~/components/forms/verification-code-input';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { notify } from '~/app/providers/notifications';
import { useDispatch } from 'react-redux';
import { setUser, USER_STORAGE_KEY } from '~/store/features/user/user-slice';
import {
  clearPets,
  PETS_STORAGE_KEY,
  setPets,
} from '~/store/features/pets/pets-slice';
import { UserRole } from '~/store/features/user/user-types';
import { getNameParts } from '~/store/features/user/user-name';
import {
  isClientRole,
  normalizeUserRole,
} from '~/store/features/user/user-role';
import {
  AUTH_TOKEN_STORAGE_KEY,
  setCredentials,
} from '~/store/features/auth/auth-slice';
import { saveTokenExpiryTimestamp } from '~/store/features/auth/token-expiration';
import { useLocalStorage } from '~/hooks/use-local-storage';
import {
  TOO_MANY_ATTEMPTS_MESSAGE,
  isSignInBlocked,
  registerFailedSignInAttempt,
  resetSignInAttempts,
} from './sign-in-attempts';
import {
  extractSignInErrorDetails,
  getLockErrorMessage,
  getSuccessMessage,
  resolvePostSignInRoute,
} from './sign-in-form.helpers';
import { resetPasswordSchema } from './password-recovery.schema';
import { GoogleLoginButton } from '~/components/google-login-button/google-login-button';
import { FacebookLoginButton } from '~/components/facebook-login-button/facebook-login-button';

type SignInFormData = z.infer<typeof signInSchema>;
type RequestRecoveryData = Pick<SignInFormData, 'email'>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
type RecoveryStep = 'request' | 'reset';

const CreateAccountHint = () => (
  <p className="text-caption text-start mt-2 text-black-900">
    Don&apos;t have an account?{' '}
    <NavLink
      to={ROUTES_PATH.SIGN_UP}
      className="text-blue-600 underline decoration-blue-600 cursor-pointer"
    >
      Create an account
    </NavLink>
    .
  </p>
);

export const SignInForm = () => {
  const [signIn, { isLoading }] = useSignInMutation();
  const [googleSignIn, { isLoading: isGoogleLoading }] = useGoogleSignInMutation();
  const [facebookSignIn, { isLoading: isFacebookLoading }] = useFacebookSignInMutation();
  const [requestRecovery, { isLoading: isRequestRecoveryLoading }] =
    useRequestPasswordRecoveryMutation();
  const [resetPassword, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const [isLocked, setIsLocked] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep | null>(null);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [recoveryCodeError, setRecoveryCodeError] = useState('');
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dispatch = useDispatch();
  const { setValue: setTokenInStorage } = useLocalStorage<string>(
    AUTH_TOKEN_STORAGE_KEY
  );
  const { setValue: setUserInStorage } = useLocalStorage(USER_STORAGE_KEY);
  const { setValue: setPetsInStorage, removeValue: removePetsFromStorage } =
    useLocalStorage(PETS_STORAGE_KEY);

  // Query hook for fetching pets - skip initially, enable after login
  const { refetch: refetchPets } = useGetMyPetsQuery(undefined, {
    skip: true,
  });

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    setError,
    watch,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const isSubmitDisabled =
    isLoading ||
    isCooldown ||
    !emailValue?.trim() ||
    !passwordValue?.trim() ||
    !isValid;

  const navigate = useNavigate();
  const location = useLocation();
  const emailRegister = register('email');

  const {
    register: registerRecovery,
    handleSubmit: handleSubmitRecovery,
    setValue: setRecoveryValue,
    formState: { errors: recoveryErrors, isValid: isRecoveryValid },
  } = useForm<RequestRecoveryData>({
    resolver: zodResolver(signInSchema.pick({ email: true })),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    trigger: triggerReset,
    formState: {
      errors: resetErrors,
      isValid: isResetValid,
      touchedFields: resetTouched,
    },
    reset: resetResetForm,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const newPassword = watchReset('newPassword');
  const confirmPassword = watchReset('confirmPassword');

  useEffect(() => {
    if (newPassword && confirmPassword) {
      triggerReset('confirmPassword');
    }
  }, [newPassword, confirmPassword, triggerReset]);

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current !== null) {
        globalThis.clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const startCooldown = (durationMs: number) => {
    setIsCooldown(true);
    if (cooldownTimeoutRef.current !== null) {
      globalThis.clearTimeout(cooldownTimeoutRef.current);
    }
    cooldownTimeoutRef.current = globalThis.setTimeout(() => {
      setIsCooldown(false);
      cooldownTimeoutRef.current = null;
    }, durationMs);
  };

  const finalizeSuccessfulSignIn = (
    message: string | undefined,
    role: UserRole | null
  ) => {
    notify({
      description: getSuccessMessage(message),
      type: 'success',
    });
    setIsLocked(false);
    resetSignInAttempts();

    const from = (location.state as { from?: string } | null)?.from;
    navigate(resolvePostSignInRoute(role, from));
  };

  const syncAuthenticatedClientPets = async (role: UserRole) => {
    if (!isClientRole(role)) {
      dispatch(clearPets());
      removePetsFromStorage();
      return;
    }

    // Fetch pets only for client accounts.
    try {
      const petsResult = await refetchPets().unwrap();

      if (Array.isArray(petsResult)) {
        dispatch(setPets(petsResult));
        setPetsInStorage(petsResult);
      }
    } catch (petsError) {
      console.error('Failed to fetch pets:', petsError);
      // Don't fail the login if pets fetch fails
    }
  };

  const handleSuccessfulResponse = async (response: SignInResponse) => {
    if (response.idToken) {
      setTokenInStorage(response.idToken);
      saveTokenExpiryTimestamp(response.idToken);
      dispatch(setCredentials({ idToken: response.idToken }));
    }

    if (!(response.userName && response.role && response.idToken)) {
      finalizeSuccessfulSignIn(response.message, null);
      return;
    }

    const role = normalizeUserRole(response.role) ?? UserRole.CLIENT;
    const { firstName, lastName } = getNameParts(response.userName);

    const userPayload = {
      userId: response.userId,
      userName: response.userName,
      firstName,
      lastName,
      email: response.email,
      role,
      phoneNumber: response.phoneNumber,
      clinic: response.clinic ?? undefined,
    };

    dispatch(setUser(userPayload));
    setUserInStorage(userPayload);

    await syncAuthenticatedClientPets(role);
    finalizeSuccessfulSignIn(response.message, role);
  };

  const handleSignInFailure = (error: unknown) => {
    const { rawMessage, isLockError } = extractSignInErrorDetails(error);

    if (isLockError) {
      setIsLocked(true);
      notify({
        description: getLockErrorMessage(rawMessage),
        type: 'error',
      });

      startCooldown(2000);
      return;
    }

    setIsLocked(false);

    const message =
      'Incorrect email or password. Try again or create an account.';

    setError('email', { type: 'manual', message });
    setError('password', { type: 'manual', message });

    notify({
      description: message,
      type: 'error',
    });

    const lockedNow = registerFailedSignInAttempt(Date.now());
    if (lockedNow) {
      setIsLocked(true);
      notify({
        description: TOO_MANY_ATTEMPTS_MESSAGE,
        type: 'error',
      });
    }

    startCooldown(2000);
  };

  const onSubmit = async (data: SignInFormData) => {
    if (isSignInBlocked(Date.now())) {
      setIsLocked(true);
      startCooldown(500);
      notify({
        description: TOO_MANY_ATTEMPTS_MESSAGE,
        type: 'error',
      });
      return;
    }

    const payload: SignInRequest = {
      email: data.email,
      password: data.password,
    };

    try {
      const response: SignInResponse = await signIn(payload).unwrap();
      await handleSuccessfulResponse(response);
    } catch (error: unknown) {
      handleSignInFailure(error);
    }
  };

  const goToRecoveryRequest = () => {
    setRecoveryStep('request');
    setRecoveryCode('');
    setRecoveryCodeError('');
  };

  const handleRecoveryEmailSubmit = async (values: RequestRecoveryData) => {
    try {
      await requestRecovery({ email: values.email }).unwrap();
      setRecoveryEmail(values.email);
      setRecoveryStep('reset');
      setRecoveryCode('');
      setRecoveryCodeError('');
      notify({
        description: 'Verification code sent successfully.',
        type: 'success',
      });
    } catch (error) {
      const parsedError = error as {
        data?: { message?: string };
      };
      notify({
        type: 'error',
        description:
          parsedError?.data?.message || 'Failed to request verification code.',
      });
    }
  };

  const handleResendRecoveryCode = async () => {
    try {
      await requestRecovery({ email: recoveryEmail }).unwrap();
      setRecoveryCodeError('');
      notify({
        description: 'Verification code resent.',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to resend verification code:', error);
      notify({
        description: 'Failed to resend verification code.',
        type: 'error',
      });
    }
  };

  const handleResetPasswordSubmit = async (values: ResetPasswordData) => {
    const payload = {
      email: recoveryEmail,
      verificationCode: recoveryCode.trim(),
      newPassword: values.newPassword,
    };

    try {
      await resetPassword(payload).unwrap();
      notify({
        title: 'Success!',
        description: 'Your password has been changed successfully.',
        type: 'success',
      });
      setRecoveryStep(null);
      setRecoveryEmail('');
      setRecoveryCode('');
      setRecoveryCodeError('');
      resetResetForm({
        newPassword: '',
        confirmPassword: '',
      });
      navigate(ROUTES_PATH.LOGIN);
    } catch (error) {
      const parsedError = error as {
        data?: { message?: string };
      };
      notify({
        description:
          parsedError?.data?.message || 'Failed to reset your password.',
        type: 'error',
      });
    }
  };

  if (recoveryStep === 'request') {
    const recoveryEmailRegister = registerRecovery('email');

    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 bg-neutral-0 rounded-4xl">
        <div className="flex flex-col gap-1 mb-6 w-full">
          <h1 className="text-[28px] font-medium text-black-900">
            Reset password
          </h1>
        </div>

        <form
          onSubmit={handleSubmitRecovery(handleRecoveryEmailSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <FormField
            label="Email"
            required
            error={recoveryErrors.email?.message}
            hint="e.g. username@domain.com"
          >
            <TextInput
              id="password-recovery-email"
              type="email"
              placeholder="Enter your Email"
              {...recoveryEmailRegister}
              onBlur={(event) => {
                const trimmed = event.target.value.trim();
                setRecoveryValue('email', trimmed, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                recoveryEmailRegister.onBlur(event);
              }}
              error={!!recoveryErrors.email}
              autoComplete="email"
            />
          </FormField>

          <div>
            <button
              type="submit"
              disabled={isRequestRecoveryLoading || !isRecoveryValid}
              className="btn-regular-l w-full"
            >
              {isRequestRecoveryLoading
                ? 'Requesting...'
                : 'Request Verification Code'}
            </button>

            <CreateAccountHint />
          </div>
        </form>
      </div>
    );
  }

  if (recoveryStep === 'reset') {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 bg-neutral-0 rounded-4xl">
        <div className="flex flex-col gap-1 mb-6 w-full">
          <h1 className="text-[28px] font-medium text-black-900">
            Reset password
          </h1>
          <p className="text-base text-black-800">
            If an account is associated with{' '}
            <span className="font-semibold">[{recoveryEmail}]</span>, you will
            receive a verification code shortly. Please check your spam folder
            if you don&apos;t see it within a few minutes.
          </p>
          <button
            type="button"
            className="text-blue-600 underline decoration-blue-600 cursor-pointer w-fit mt-2"
            onClick={() => {
              setRecoveryStep('request');
              setRecoveryCode('');
              setRecoveryCodeError('');
            }}
          >
            Change email
          </button>
        </div>

        <form
          onSubmit={handleSubmitReset(handleResetPasswordSubmit)}
          className="flex flex-col gap-6 w-full"
        >
          <VerificationCodeInput
            value={recoveryCode}
            onChange={(value) => {
              setRecoveryCode(value);
              setRecoveryCodeError('');
            }}
            onResend={handleResendRecoveryCode}
            error={recoveryCodeError}
            isLoading={isResetPasswordLoading}
          />

          <FormField label="New Password" required htmlFor="new-password">
            <RegisterPasswordInput
              id="new-password"
              placeholder="Enter new password"
              {...registerReset('newPassword', {
                onBlur: () => triggerReset('newPassword'),
              })}
              error={!!(resetTouched.newPassword && resetErrors.newPassword)}
              autoComplete="new-password"
            />
          </FormField>

          <FormField
            label="Confirm Password"
            required
            htmlFor="confirm-password"
            error={
              resetTouched.confirmPassword &&
              confirmPassword &&
              resetErrors.confirmPassword
                ? resetErrors.confirmPassword.message
                : undefined
            }
            hint="Confirm password must match your new password"
          >
            <ConfirmPasswordInput
              id="confirm-password"
              placeholder="Confirm new password"
              {...registerReset('confirmPassword', {
                onBlur: () => triggerReset('confirmPassword'),
              })}
              error={
                !!(
                  resetTouched.confirmPassword &&
                  confirmPassword &&
                  resetErrors.confirmPassword
                )
              }
              autoComplete="new-password"
            />
          </FormField>

          <div>
            <button
              type="submit"
              disabled={
                !isResetValid ||
                !recoveryCode.trim() ||
                !!recoveryCodeError ||
                isResetPasswordLoading
              }
              className="btn-regular-l w-full"
            >
              {isResetPasswordLoading ? 'Resetting...' : 'Reset'}
            </button>

            <CreateAccountHint />
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 bg-neutral-0 rounded-4xl">
      <div className="flex flex-col gap-1 mb-6 w-full">
        <h1 className="text-[28px] font-medium text-black-900">Sign In</h1>
        <p className="text-base text-black-800">
          Fill in your information to get started
        </p>
      </div>

      {isLocked && (
        <div
          id="sign-in-locked-alert"
          data-testid="sign-in-locked-alert"
          role="alert"
          className="mb-4 w-full max-w-[552px] rounded-[4px] border border-[#E30404] bg-red-100 p-3"
        >
          <p className="text-body-m-regular text-black-900">
            Your account is temporary locked due to multiple failed login
            attempts. Please try again later.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="sign-in-form"
        className="flex flex-col gap-6 w-full"
      >
        <FormField
          label="Email"
          required
          error={errors.email?.message}
          hint="e.g. username@domain.com"
        >
          <TextInput
            id="email"
            type="email"
            placeholder="Enter your Email"
            {...emailRegister}
            onBlur={(event) => {
              const trimmed = event.target.value.trim();
              setValue('email', trimmed, {
                shouldDirty: true,
                shouldValidate: true,
              });
              emailRegister.onBlur(event);
            }}
            error={!!errors.email}
            autoComplete="email"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setFocus('password');
              }
            }}
          />
        </FormField>

        <div className="min-h-[6rem]">
          <FormField label="Password" required error={errors.password?.message}>
            <PasswordInput
              id="password"
              placeholder="Enter your Password"
              {...register('password')}
              error={!!errors.password}
              autoComplete="current-password"
            />
          </FormField>

          <button
            type="button"
            className="mt-2 text-blue-600 underline decoration-blue-600 cursor-pointer text-caption"
            onClick={goToRecoveryRequest}
          >
            Forgot password?
          </button>
        </div>

        <div>
          <button
            id="sign-in-submit"
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-regular-l w-full"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <CreateAccountHint />

          <div className="flex items-center gap-3 my-2">
            <hr className="flex-1 border-neutral-300" />
            <span className="text-xs text-black-600">or</span>
            <hr className="flex-1 border-neutral-300" />
          </div>

          <p className="text-xs text-black-600 text-center mb-2">
            By continuing, the system will retrieve your name and email address from your social account.
          </p>

          <div className="flex flex-col gap-2">
            <GoogleLoginButton
              disabled={isGoogleLoading}
              onSuccess={async (accessToken) => {
                try {
                  const response = await googleSignIn({ accessToken }).unwrap();
                  await handleSuccessfulResponse(response);
                } catch (error) {
                  notify({
                    description: 'Google sign-in failed. Please try again.',
                    type: 'error',
                  });
                }
              }}
              onError={(message) => {
                notify({ description: message, type: 'error' });
              }}
            />
            <FacebookLoginButton
              disabled={isFacebookLoading}
              onSuccess={async (accessToken) => {
                try {
                  const response = await facebookSignIn({ accessToken }).unwrap();
                  await handleSuccessfulResponse(response);
                } catch (error) {
                  notify({
                    description: 'Facebook sign-in failed. Please try again.',
                    type: 'error',
                  });
                }
              }}
              onError={(message) => {
                notify({ description: message, type: 'error' });
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
