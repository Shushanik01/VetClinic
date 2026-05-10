import type { SignInRequest, SignUpRequest } from '~/store/api/auth/auth-types';
import type { UserRole } from '~/store/features/user/user-types';
import { deepClone } from '~/mocks/data/utils';
import {
  buildUserName,
  createSessionToken,
  getUserByEmail,
  getUserById,
  getUsersByRole,
  sessionsByToken,
  users,
} from './data';

export const authEntity = {
  signUp: (
    payload: SignUpRequest
  ): { status: number; body: { message: string } } => {
    const existingUser = getUserByEmail(payload.email);

    if (existingUser) {
      return {
        status: 409,
        body: { message: 'User with this email already exists.' },
      };
    }

    users.push({
      userId: `user-${crypto.randomUUID().slice(0, 8)}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
      role: 'Client',
    });

    return {
      status: 201,
      body: { message: 'Account successfully created.' },
    };
  },

  signIn: (
    payload: SignInRequest
  ):
    | {
        status: 200;
        body: {
          message: string;
          idToken: string;
          userId: string;
          userName: string;
          email: string;
          phoneNumber: string;
          role: string;
          clinic?: {
            clinicId: string;
            clinicAddress: string;
          };
        };
      }
    | { status: 401; body: { message: string } } => {
    const user = getUserByEmail(payload.email);

    if (user?.password !== payload.password) {
      return {
        status: 401,
        body: { message: 'Invalid email or password.' },
      };
    }

    const token = createSessionToken(user);
    sessionsByToken.set(token, { token, userId: user.userId });

    return {
      status: 200,
      body: {
        message: 'Signed in successfully.',
        idToken: token,
        userId: user.userId,
        userName: buildUserName(user.firstName, user.lastName),
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        ...(user.role === 'Receptionist'
          ? {}
          : {
              clinic: {
                clinicId: '1a2b3c4d-5678-1234-9abc-def012345678',
                clinicAddress: '123 Main St, City Clinic',
              },
            }),
      },
    };
  },

  resolveUserByToken: (token: string) => {
    const session = sessionsByToken.get(token);

    if (!session) {
      return null;
    }

    return deepClone(getUserById(session.userId));
  },

  resolveUserById: (userId: string) => deepClone(getUserById(userId)),

  listUsersByRole: (role: UserRole) => deepClone(getUsersByRole(role)),

  updateUserProfile: (
    userId: string,
    profile: { firstName: string; lastName: string; phoneNumber: string }
  ) => {
    const user = getUserById(userId);

    if (!user) {
      return null;
    }

    user.firstName = profile.firstName;
    user.lastName = profile.lastName;
    user.phoneNumber = profile.phoneNumber;

    return deepClone(user);
  },

  changePassword: (
    userId: string,
    oldPassword: string,
    newPassword: string
  ): { status: number; body: { message: string } } => {
    const user = getUserById(userId);

    if (!user) {
      return { status: 404, body: { message: 'User not found.' } };
    }

    if (user.password !== oldPassword) {
      return { status: 400, body: { message: 'Old password is incorrect.' } };
    }

    user.password = newPassword;

    return {
      status: 200,
      body: { message: 'Password was successfully changed.' },
    };
  },
};
