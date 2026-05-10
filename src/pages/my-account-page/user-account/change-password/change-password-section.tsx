import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { notify } from '~/app/providers/notifications/notifications';
import { FormField } from '~/components/forms/form-field';
import { ConfirmPasswordInput } from '~/pages/sign-up-page/sign-up-form/confirm-password-input';
import { RegisterPasswordInput } from '~/pages/sign-up-page/sign-up-form/register-password-input';
import { useChangePasswordMutation } from '~/store/api/profile/profile-api';
import Eye from '~/assets/svg/eye-regular.svg?react';
import EyeOff from '~/assets/svg/eye-closed.svg?react';

import { changePasswordSchema } from './change-password.schema';

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const ChangePasswordSection = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [passwordInputsResetKey, setPasswordInputsResetKey] = useState(0);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const oldPasswordValue = watch('oldPassword');
  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (newPassword && confirmPassword) {
      trigger('confirmPassword');
    }
  }, [newPassword, confirmPassword, trigger]);

  const oldPasswordRegister = register('oldPassword');

  const handleValidSubmit = async (values: ChangePasswordValues) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();
      notify({
        description: 'Your password has been updated.',
        type: 'success',
      });
      reset({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowOldPassword(false);
      setPasswordInputsResetKey((prev) => prev + 1);
    } catch (error) {
      const errorData = error as any;
      const rawMessage =
        typeof errorData?.data?.message === 'string'
          ? errorData.data.message
          : '';
      const normalizedMessage = rawMessage.toLowerCase();
      const isWrongOldPassword =
        errorData?.status === 403 ||
        errorData?.status === 400 ||
        errorData?.originalStatus === 403 ||
        errorData?.originalStatus === 400 ||
        errorData?.data?.code === 'INVALID_PARAMETER' ||
        errorData?.data?.code === 'FORBIDDEN';
      const isOldPasswordMismatch =
        isWrongOldPassword ||
        normalizedMessage.includes('invalid parameter') ||
        normalizedMessage.includes('old password') ||
        normalizedMessage.includes('current password') ||
        normalizedMessage.includes('incorrect password');

      console.error('Failed to change password:', {
        status: errorData?.status,
        error: errorData?.error,
        data: errorData?.data,
      });
      notify({
        description: isOldPasswordMismatch
          ? 'Incorrect current password.'
          : rawMessage || 'Failed to update your password.',
        type: 'error',
      });
    }
  };

  return (
    <div className="w-full rounded-[32px] border border-green-400 bg-white p-6">
      <form
        onSubmit={handleSubmit(handleValidSubmit)}
        className="flex flex-col gap-3 w-full max-w-[552px]"
      >
        <FormField
          label="Old Password"
          required
          htmlFor="current-password"
          className="w-full max-w-[552px]"
          error={
            touchedFields.oldPassword && oldPasswordValue && errors.oldPassword
              ? errors.oldPassword.message
              : undefined
          }
        >
          <div className="relative">
            <input
              id="current-password"
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Enter current password"
              {...oldPasswordRegister}
              onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
                const trimmed = event.target.value.trim();
                setValue('oldPassword', trimmed, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                oldPasswordRegister.onBlur(event);
                trigger('oldPassword');
              }}
              autoComplete="current-password"
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter' || event.key === 'Tab') {
                  event.preventDefault();
                  setFocus('newPassword');
                }
              }}
              className={`w-full max-w-[552px] rounded-lg border bg-white px-3 py-2 text-base placeholder-gray-400 transition-colors focus:outline-none focus:ring-0 ${
                touchedFields.oldPassword &&
                oldPasswordValue &&
                errors.oldPassword
                  ? 'border-red-400'
                  : 'border-gray-300 focus:border-green-400'
              }`}
            />
            {oldPasswordValue && (
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center cursor-pointer text-black-700 hover:text-black-900"
              >
                {showOldPassword ? (
                  <EyeOff width={20} height={20} />
                ) : (
                  <Eye width={20} height={20} />
                )}
              </button>
            )}
          </div>
        </FormField>

        <FormField
          label="New Password"
          required
          htmlFor="new-password"
          className="w-full max-w-[552px]"
        >
          <RegisterPasswordInput
            key={`new-password-${passwordInputsResetKey}`}
            id="new-password"
            placeholder="Enter new password"
            className="max-w-[552px]"
            {...register('newPassword', {
              onBlur: () => trigger('newPassword'),
            })}
            error={
              !!(touchedFields.newPassword && newPassword && errors.newPassword)
            }
            autoComplete="new-password"
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                setFocus('confirmPassword');
              }
            }}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          required
          htmlFor="confirm-password"
          className="w-full max-w-[552px]"
          error={
            touchedFields.confirmPassword &&
            confirmPassword &&
            errors.confirmPassword
              ? errors.confirmPassword.message
              : undefined
          }
          hint="Confirm password must match your new password"
        >
          <ConfirmPasswordInput
            key={`confirm-password-${passwordInputsResetKey}`}
            id="confirm-password"
            placeholder="Confirm new password"
            className="max-w-[552px]"
            {...register('confirmPassword', {
              onBlur: () => trigger('confirmPassword'),
            })}
            error={
              !!(
                touchedFields.confirmPassword &&
                confirmPassword &&
                errors.confirmPassword
              )
            }
            autoComplete="new-password"
          />
        </FormField>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className="btn-regular-l"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
