import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

import { notify } from '~/app/providers/notifications/notifications';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';
import { FormField } from '~/components/forms/form-field';
import { PasswordInput } from '~/components/forms/password-input';
import { TextInput } from '~/components/forms/text-input';
import { VerificationCodeInput } from '~/components/forms/verification-code-input';
import {
  useRequestEmailChangeMutation,
  useVerifyEmailCodeMutation,
} from '~/store/api/profile/profile-api';
import { logout } from '~/store/features/auth/auth-slice';
import type { RootState, AppDispatch } from '~/store/store';

import { changeEmailSchema } from './change-email.schema';

type ChangeEmailValues = z.infer<typeof changeEmailSchema>;

export const ChangeEmailSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentEmail = useSelector(
    (state: RootState) => state.user.currentUser?.email
  );
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const [requestEmailChange, { isLoading: isRequestLoading }] =
    useRequestEmailChangeMutation();
  const [verifyEmailCode, { isLoading: isVerifyLoading }] =
    useVerifyEmailCodeMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    trigger,
  } = useForm<ChangeEmailValues>({
    resolver: zodResolver(changeEmailSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const newEmail = watch('newEmail');
  const confirmEmail = watch('confirmEmail');

  useEffect(() => {
    if (newEmail && confirmEmail) {
      trigger('confirmEmail');
    }
  }, [newEmail, confirmEmail, trigger]);

  const handleRequestEmailChange = async (values: ChangeEmailValues) => {
    try {
      await requestEmailChange({
        newEmail: values.newEmail,
        password: values.currentPassword,
      }).unwrap();

      setPendingEmail(values.newEmail);
      setStep('verification');
      setVerificationCode('');
      setVerificationError('');

      notify({
        description: `Verification code sent to ${values.newEmail}`,
        type: 'success',
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      const message =
        typeof errorData?.data?.message === 'string'
          ? errorData.data.message
          : 'Failed to request email change';

      console.error('Failed to request email change:', error);
      notify({
        description: message,
        type: 'error',
      });
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError('Verification code is required');
      return;
    }

    try {
      await verifyEmailCode({
        verificationCode: verificationCode.trim(),
      }).unwrap();

      notify({
        description: 'Email verified successfully. Please log in again.',
        type: 'success',
      });

      // Log out user
      dispatch(logout());
      navigate(ROUTES_PATH.ROOT);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorData = error as any;
      const message =
        typeof errorData?.data?.message === 'string'
          ? errorData.data.message
          : 'Invalid verification code';

      console.error('Failed to verify email code:', error);
      setVerificationError(message);
    }
  };

  const handleResendCode = async () => {
    try {
      console.log('[MOCK] Resending verification code to:', pendingEmail);
      console.log('[MOCK] verification code for testing: 123456');
      setVerificationError('');
      notify({
        description: 'Verification code resent',
        type: 'success',
      });
    } catch (error) {
      console.error('Failed to resend code:', error);
      notify({
        description: 'Failed to resend verification code',
        type: 'error',
      });
    }
  };

  const handleWrongEmail = () => {
    setStep('form');
    setPendingEmail('');
    setVerificationCode('');
    setVerificationError('');
  };

  if (step === 'verification') {
    return (
      <div className="w-full rounded-[32px] border border-green-400 bg-white p-6">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-base text-black-700">
              We sent an email to{' '}
              <span className="font-semibold">{pendingEmail}</span> with a
              verification code. Please enter the code from the email.
            </p>
            <button
              type="button"
              onClick={handleWrongEmail}
              className="text-blue-600 underline hover:text-blue-700 text-sm mt-2"
            >
              Wrong email? Enter different email
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCode();
            }}
            className="flex flex-col gap-4 w-full max-w-[552px]"
          >
            <VerificationCodeInput
              value={verificationCode}
              onChange={(value) => {
                setVerificationCode(value);
                setVerificationError('');
              }}
              onResend={handleResendCode}
              error={verificationError}
              isLoading={isVerifyLoading}
              className="w-full max-w-[552px]"
            />

            <button
              type="submit"
              disabled={!verificationCode.trim() || isVerifyLoading}
              className="btn-regular-l"
            >
              {isVerifyLoading ? 'Verifying...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[32px] border border-green-400 bg-white p-6">
      <form
        onSubmit={handleSubmit(handleRequestEmailChange)}
        className="flex flex-col gap-4 w-full max-w-[552px]"
      >
        <div>
          <p className="text-body-m-bold">
            <span className="font-semibold">Current email:</span>{' '}
            <span className="text-body-m-regular">{currentEmail}</span>
          </p>
        </div>

        <FormField
          label="New Email"
          required
          htmlFor="new-email"
          className="w-full max-w-[552px]"
          error={
            touchedFields.newEmail && errors.newEmail
              ? errors.newEmail.message
              : undefined
          }
          hint="e.g. username@domain.com"
        >
          <TextInput
            id="new-email"
            placeholder="Enter your New Email"
            className="max-w-[552px]"
            {...register('newEmail')}
          />
        </FormField>

        <FormField
          label="Confirm New Email"
          required
          htmlFor="confirm-email"
          className="w-full max-w-[552px]"
          error={
            touchedFields.confirmEmail && errors.confirmEmail
              ? errors.confirmEmail.message
              : undefined
          }
          hint="e.g. username@domain.com"
        >
          <TextInput
            id="confirm-email"
            placeholder="Confirm your New Email"
            className="max-w-[552px]"
            {...register('confirmEmail')}
          />
        </FormField>

        <FormField
          label="Current Password"
          required
          htmlFor="current-password"
          className="w-full max-w-[552px]"
          error={
            touchedFields.currentPassword && errors.currentPassword
              ? errors.currentPassword.message
              : undefined
          }
          hint="Enter your password to confirm the change"
        >
          <PasswordInput
            id="current-password"
            placeholder="Enter your Password"
            className="max-w-[552px]"
            {...register('currentPassword')}
          />
        </FormField>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={!isValid || isRequestLoading}
            className="btn-regular-l"
          >
            {isRequestLoading ? 'Sending...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};
