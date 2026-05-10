import type {
  PasswordChangeRequest,
  ProfileResponse,
  ProfileUpdateRequest,
} from '~/store/api/profile/profile-types';
import { authEntity } from '~/mocks/data/store/auth';

// Helper function
const mapUserToProfile = (user: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
}): ProfileResponse => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
});

export const profileEntity = {
  getByUserId: (userId: string): ProfileResponse | null => {
    const user = authEntity.resolveUserById(userId);

    if (!user) {
      return null;
    }

    return mapUserToProfile(user);
  },

  updateByUserId: (
    userId: string,
    payload: ProfileUpdateRequest
  ): ProfileResponse | null => {
    const user = authEntity.updateUserProfile(userId, payload);

    if (!user) {
      return null;
    }

    return mapUserToProfile(user);
  },

  changePassword: (
    userId: string,
    payload: PasswordChangeRequest
  ): { status: number; body: { message: string } } =>
    authEntity.changePassword(userId, payload.oldPassword, payload.newPassword),
};
