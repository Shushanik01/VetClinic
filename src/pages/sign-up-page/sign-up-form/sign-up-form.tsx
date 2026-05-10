import {
  useResendVerificationMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
} from '~/store/api/auth/auth-api';
import type { SignUpRequest } from '~/store/api/auth/auth-types';
import { signUpSchema } from './sign-up.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import type { z } from 'zod';
import { NavLink, useNavigate } from 'react-router-dom';
import { FormField } from '~/components/forms/form-field';
import { TextInput } from '~/components/forms/text-input';
import { RegisterPasswordInput } from './register-password-input';
import { ConfirmPasswordInput } from './confirm-password-input';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { notify } from '~/app/providers/notifications';
import { CaptchaInput } from '~/components/captcha/captcha-input';
import { SignUpVerificationStep } from './sign-up-verification-step';

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
  const [signUp, { isLoading }] = useSignUpMutation();
  const [verifyEmail, { isLoading: isVerifyingEmail }] =
    useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResendingVerification }] =
    useResendVerificationMutation();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');
  const phoneNumber = watch('phoneNumber');
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  useEffect(() => {
    if (password && confirmPassword) {
      trigger('confirmPassword');
    }
  }, [password, trigger, confirmPassword]);

  const firstNameRegister = register('firstName');
  const lastNameRegister = register('lastName');
  const emailRegister = register('email');
  const phoneRegister = register('phoneNumber');

  const navigate = useNavigate();

  const canVerify =
    verificationCode.trim().length > 0 &&
    !verificationCodeError &&
    !isVerifyingEmail;

  const onSubmit = async (data: SignUpFormData) => {
    const payload: SignUpRequest = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      captchaToken: captchaToken!,
    };

    try {
      await signUp(payload).unwrap();

      notify({
        description: 'Verification code sent to your email.',
        type: 'success',
      });
      setPendingEmail(data.email);
      setStep('verify');
      setVerificationCode('');
      setVerificationCodeError('');
    } catch (err: any) {
      const rawMessage =
        typeof err?.data?.message === 'string' ? err.data.message : '';
      const isEmailConflict =
        err?.status === 409 ||
        err?.originalStatus === 409 ||
        err?.data?.code === 'CONFLICT' ||
        rawMessage.toLowerCase().includes('already exists');
      const message = isEmailConflict
        ? 'A user with this email already exists.'
        : rawMessage || err?.error || 'Something went wrong';

      notify({
        description: message,
        type: 'error',
      });

      console.error('Sign up failed:', err);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      setVerificationCodeError('Verification code is required');
      return;
    }

    try {
      const response = await verifyEmail({
        email: pendingEmail,
        verificationCode: verificationCode.trim(),
      }).unwrap();

      notify({
        title: 'Success!',
        description: response.message || 'User registered successfully.',
        type: 'success',
      });

      navigate(ROUTES_PATH.LOGIN);
    } catch (err: any) {
      const message =
        typeof err?.data?.message === 'string'
          ? err.data.message
          : 'Invalid or expired verification code.';
      setVerificationCodeError(message);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification({ email: pendingEmail }).unwrap();
      setVerificationCodeError('');
      notify({
        description: 'Verification code resent successfully.',
        type: 'success',
      });
    } catch (err: any) {
      notify({
        description:
          typeof err?.data?.message === 'string'
            ? err.data.message
            : 'Failed to resend verification code.',
        type: 'error',
      });
    }
  };

  if (step === 'verify') {
    return (
      <SignUpVerificationStep
        email={pendingEmail}
        verificationCode={verificationCode}
        verificationCodeError={verificationCodeError}
        isLoading={isVerifyingEmail || isResendingVerification}
        canVerify={canVerify}
        onCodeChange={(value) => {
          setVerificationCode(value);
          setVerificationCodeError('');
        }}
        onResend={handleResendVerification}
        onSubmit={handleVerifyEmail}
        onChangeEmail={() => {
          setStep('register');
          setVerificationCode('');
          setVerificationCodeError('');
        }}
      />
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-8 md:p-10 lg:p-12 bg-neutral-0 rounded-4xl">
      <div className="flex flex-col gap-1 mb-6 w-full">
        <h1 className="text-[28px] font-medium text-black-900">
          Create Account
        </h1>
        <p className="text-base text-black-800">
          Fill in your information to get started
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col flex-1 justify-between gap-2.5 w-full"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            required
            error={firstName && errors.firstName?.message}
            hint="e.g. Johnson"
          >
            <TextInput
              id="first-name"
              placeholder="Enter First Name"
              {...firstNameRegister}
              onBlur={(event) => {
                const trimmed = event.target.value.trim();
                setValue('firstName', trimmed, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                firstNameRegister.onBlur(event);
              }}
              error={!!(firstName && errors.firstName)}
              autoComplete="given-name"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setFocus('lastName');
                }
              }}
            />
          </FormField>

          <FormField
            label="Last Name"
            required
            error={lastName && errors.lastName?.message}
            hint="e.g. Doe"
          >
            <TextInput
              id="last-name"
              placeholder="Enter Last Name"
              {...lastNameRegister}
              onBlur={(event) => {
                const trimmed = event.target.value.trim();
                setValue('lastName', trimmed, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                lastNameRegister.onBlur(event);
              }}
              error={!!(lastName && errors.lastName)}
              autoComplete="family-name"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setFocus('email');
                }
              }}
            />
          </FormField>
        </div>

        <FormField
          label="Email"
          required
          error={email && errors.email?.message}
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
            error={!!(email && errors.email)}
            autoComplete="email"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setFocus('phoneNumber');
              }
            }}
          />
        </FormField>

        <FormField
          label="Phone Number"
          required
          error={phoneNumber && errors.phoneNumber?.message}
        >
          <TextInput
            id="phone-number"
            type="tel"
            placeholder="+38(___) ___-__-__"
            {...phoneRegister}
            onBlur={(event) => {
              const trimmed = event.target.value.trim();
              setValue('phoneNumber', trimmed, {
                shouldDirty: true,
                shouldValidate: true,
              });
              phoneRegister.onBlur(event);
            }}
            error={!!(phoneNumber && errors.phoneNumber)}
            autoComplete="tel"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setFocus('password');
              }
            }}
          />
        </FormField>

        <FormField label="Password" required>
          <RegisterPasswordInput
            id="password"
            placeholder="Enter your Password"
            {...register('password')}
            error={!!(password && errors.password)}
            autoComplete="new-password"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setFocus('confirmPassword');
              }
            }}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          required
          error={confirmPassword && errors.confirmPassword?.message}
          hint="Confirm password must match your password"
        >
          <ConfirmPasswordInput
            id="confirm-password"
            placeholder="Confirm your Password"
            {...register('confirmPassword')}
            error={!!(confirmPassword && errors.confirmPassword)}
            autoComplete="new-password"
          />
        </FormField>

        <div>
          <CaptchaInput onVerify={setCaptchaToken}/>
          <button
            id="sign-up-submit"
            type="submit"
            disabled={isLoading || !isValid || !captchaToken}
            className="btn-regular-l w-full"
          >
            {isLoading ? 'Creating Account...' : 'Continue'}
          </button>

          <p className="text-caption text-start mt-2 text-black-900">
            Already have an account?{' '}
            <NavLink to={ROUTES_PATH.LOGIN} className="text-blue-600 underline">
              Sign in
            </NavLink>{' '}
            instead
          </p>
          
        </div>
      </form>
    </div>
  );
};
