import type { FC } from 'react';
import { useSelector } from 'react-redux';

import editIcon from '~/assets/svg/edit.svg';
import person2 from '~/assets/svg/icons/person2.svg';
import cameraIcon from '~/assets/svg/camera.svg';
import { extractPhoneNumberFromIdToken } from '~/store/api/auth/token-utils';
import { AUTH_TOKEN_STORAGE_KEY } from '~/store/features/auth/auth-slice';
import {
  getUserDisplayName,
  getUserFirstName,
  getUserLastName,
} from '~/store/features/user/user-name';
import type { RootState } from '~/store/store';
import { UserForm, type UserFormValues } from './user-form';

type UserCardProps = {
  onEdit?: () => void;
  isEditing?: boolean;
  formInitialValues?: Partial<UserFormValues>;
  onCancelEdit?: () => void;
  onSubmitEdit?: (values: UserFormValues) => void;
  isSubmitting?: boolean;
  allowEdit?: boolean;
  showPhotoAction?: boolean;
  extraFields?: { label: string; value?: string | null }[];
};

const formatValue = (value?: string | null) => {
  if (!value) return '-';
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : '-';
};

const getPhoneNumberFromToken = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  try {
    const rawToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!rawToken) return undefined;

    const parsedToken = JSON.parse(rawToken) as unknown;
    if (typeof parsedToken !== 'string') return undefined;

    return extractPhoneNumberFromIdToken(parsedToken);
  } catch {
    return undefined;
  }
};

export const UserCard: FC<UserCardProps> = ({
  onEdit,
  isEditing = false,
  formInitialValues,
  onCancelEdit,
  onSubmitEdit,
  isSubmitting = false,
  allowEdit = true,
  showPhotoAction = true,
  extraFields = [],
}) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const displayName = getUserDisplayName(currentUser);
  const firstNameValue = getUserFirstName(currentUser);
  const lastNameValue = getUserLastName(currentUser);
  const phoneNumberValue =
    currentUser?.phoneNumber ?? getPhoneNumberFromToken();

  const fields: { label: string; value: string }[] = [
    { label: 'First Name', value: formatValue(firstNameValue) },
    { label: 'Last Name', value: formatValue(lastNameValue) },
    { label: 'Phone Number', value: formatValue(phoneNumberValue) },
    ...extraFields.map((field) => ({
      label: field.label,
      value: formatValue(field.value),
    })),
  ];

  return (
    <div className="w-full rounded-[32px] border border-green-400 bg-neutral-0 p-4 sm:p-6 flex flex-col gap-3 shadow-sm min-h-fit">
      <div className="flex items-start justify-between gap-2">
        <h3
          className="text-h3 text-black-900 truncate flex-1"
          title={displayName || 'User'}
        >
          {displayName || 'User'}
        </h3>

        {allowEdit && !isEditing && (
          <button
            type="button"
            aria-label="Edit user"
            onClick={() => onEdit?.()}
            className="flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors flex-shrink-0 cursor-pointer w-8 h-8"
          >
            <img src={editIcon} alt="Edit" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:items-start">
        <div className="aspect-square w-24 sm:w-30 rounded-full bg-neutral-400 flex items-center justify-center overflow-visible flex-shrink-0 mx-auto sm:mx-0 relative">
          <img
            src={person2}
            alt="User placeholder"
            className="w-[58px] h-[58px] object-cover"
          />
          {showPhotoAction && (
            <button
              type="button"
              onClick={() => console.log('uploading photo handler')}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-neutral-0 border-2 border-green-400 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Upload user photo"
            >
              <img
                src={cameraIcon}
                alt="Upload user photo"
                className="w-5 h-5"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          {isEditing ? (
            <UserForm
              initialValues={formInitialValues}
              onCancel={onCancelEdit}
              onSubmit={onSubmitEdit}
              isSubmitting={isSubmitting}
            />
          ) : (
            fields.map((field) => (
              <div key={field.label} className="flex items-center gap-6">
                <span className="text-black-900 text-body-m-bold flex-shrink-0">
                  {field.label}
                </span>
                <span className="text-black-900 text-body-m-regular whitespace-nowrap overflow-hidden text-ellipsis">
                  {field.value}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
