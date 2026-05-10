import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { FormField } from '~/components/forms/form-field';
import { TextInput } from '~/components/forms/text-input';

import { userFormSchema } from './user-form.schema';

export type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  initialValues?: Partial<UserFormValues>;
  onCancel?: () => void;
  onSubmit?: (values: UserFormValues) => void;
  isSubmitting?: boolean;
};

export const UserForm = ({
  initialValues,
  onCancel,
  onSubmit,
  isSubmitting = false,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
    },
  });

  useEffect(() => {
    reset({
      firstName: initialValues?.firstName ?? '',
      lastName: initialValues?.lastName ?? '',
      phoneNumber: initialValues?.phoneNumber ?? '',
    });
  }, [initialValues, reset]);

  const firstNameRegister = register('firstName');
  const lastNameRegister = register('lastName');
  const phoneRegister = register('phoneNumber');

  const handleValidSubmit = (values: UserFormValues) => {
    onSubmit?.(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleValidSubmit)}
      className="flex flex-col gap-4 w-full max-w-[552px]"
    >
      <FormField
        label="First Name"
        required
        className="w-full max-w-[552px]"
        error={errors.firstName?.message}
        hint="e.g. Johnson"
      >
        <TextInput
          id="edit-first-name"
          placeholder="Enter First Name"
          className="max-w-[552px]"
          {...firstNameRegister}
          onBlur={(event) => {
            const trimmed = event.target.value.trim();
            setValue('firstName', trimmed, {
              shouldDirty: true,
              shouldValidate: true,
            });
            firstNameRegister.onBlur(event);
          }}
          error={!!errors.firstName}
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
        className="w-full max-w-[552px]"
        error={errors.lastName?.message}
        hint="e.g. Doe"
      >
        <TextInput
          id="edit-last-name"
          placeholder="Enter Last Name"
          className="max-w-[552px]"
          {...lastNameRegister}
          onBlur={(event) => {
            const trimmed = event.target.value.trim();
            setValue('lastName', trimmed, {
              shouldDirty: true,
              shouldValidate: true,
            });
            lastNameRegister.onBlur(event);
          }}
          error={!!errors.lastName}
          autoComplete="family-name"
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
        className="w-full max-w-[552px]"
        error={errors.phoneNumber?.message}
      >
        <TextInput
          id="edit-phone-number"
          type="tel"
          placeholder="+38(___) ___-__-__"
          className="max-w-[552px]"
          {...phoneRegister}
          onBlur={(event) => {
            const trimmed = event.target.value.trim();
            setValue('phoneNumber', trimmed, {
              shouldDirty: true,
              shouldValidate: true,
            });
            phoneRegister.onBlur(event);
          }}
          error={!!errors.phoneNumber}
          autoComplete="tel"
        />
      </FormField>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="btn-white-l disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-regular-l disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid || isSubmitting}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
