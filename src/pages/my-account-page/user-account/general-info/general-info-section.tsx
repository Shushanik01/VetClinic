import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { notify } from '~/app/providers/notifications/notifications';
import {
  getUserFirstName,
  getUserLastName,
  buildUserName,
} from '~/store/features/user/user-name';
import { updateUser } from '~/store/features/user/user-slice';
import type { AppDispatch, RootState } from '~/store/store';
import { useUpdateProfileMutation } from '~/store/api/profile/profile-api';

import { UserCard } from '~/pages/my-account-page/user-account/general-info/user-card';
import type { UserFormValues } from '~/pages/my-account-page/user-account/general-info/user-form';

export const GeneralInfoSection = () => {
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const initialValues = useMemo<Partial<UserFormValues>>(() => {
    return {
      firstName: getUserFirstName(currentUser),
      lastName: getUserLastName(currentUser),
      phoneNumber: currentUser?.phoneNumber || '',
    };
  }, [currentUser]);

  const handleOpenUserForm = () => {
    setIsUserFormOpen(true);
  };

  const handleCloseUserForm = () => {
    setIsUserFormOpen(false);
  };

  const handleSubmitUserForm = async (values: UserFormValues) => {
    try {
      const updatedProfile = await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      }).unwrap();

      dispatch(
        updateUser({
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          userName: buildUserName(
            updatedProfile.firstName,
            updatedProfile.lastName,
            currentUser?.userName
          ),
          phoneNumber: updatedProfile.phoneNumber,
          email: updatedProfile.email,
        })
      );

      notify({
        description: 'Profile updated successfully.',
        type: 'success',
      });
      handleCloseUserForm();
    } catch (error) {
      const errorData = error as any;
      console.error('Failed to update profile:', {
        status: errorData?.status,
        error: errorData?.error,
        data: errorData?.data,
      });
      notify({
        description:
          errorData?.data?.message || 'Failed to update profile data.',
        type: 'error',
      });
    }
  };

  return (
    <UserCard
      onEdit={handleOpenUserForm}
      isEditing={isUserFormOpen}
      formInitialValues={initialValues}
      onCancelEdit={handleCloseUserForm}
      onSubmitEdit={handleSubmitUserForm}
      isSubmitting={isUpdating}
    />
  );
};
