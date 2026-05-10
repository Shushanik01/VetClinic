import { baseApi } from '~/store/api/base-api';
import { updateUser, USER_STORAGE_KEY } from '~/store/features/user/user-slice';
import { buildUserName } from '~/store/features/user/user-name';
import type {
  ProfileResponse,
  ProfileUpdateRequest,
  PasswordChangeRequest,
  PasswordChangeResponse,
  RequestEmailChangeRequest,
  RequestEmailChangeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
} from '~/store/api/profile/profile-types';

const MOCK_EMAIL_VERIFICATION_CODE = '123456';

const persistProfileToStorage = (profile: ProfileResponse) => {
  const storage = globalThis.localStorage;

  if (!storage) return;

  try {
    const raw = storage.getItem(USER_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const next = {
      ...parsed,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      email: profile.email ?? parsed.email,
    };

    storage.setItem(USER_STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn('Error updating profile data in localStorage', error);
  }
};

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: [{ type: 'Profile', id: 'ME' }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          persistProfileToStorage(data);
          dispatch(
            updateUser({
              firstName: data.firstName,
              lastName: data.lastName,
              userName: buildUserName(data.firstName, data.lastName),
              phoneNumber: data.phoneNumber,
              email: data.email,
            })
          );
        } catch (error) {
          console.error('getProfile Error:', error);
        }
      },
    }),

    updateProfile: builder.mutation<ProfileResponse, ProfileUpdateRequest>({
      query: (body) => ({
        url: '/profile',
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            profileApi.util.updateQueryData(
              'getProfile',
              undefined,
              (draft) => {
                draft.firstName = data.firstName;
                draft.lastName = data.lastName;
                draft.phoneNumber = data.phoneNumber;
                draft.email = data.email;
                draft.role = data.role;
              }
            )
          );
          persistProfileToStorage(data);
          dispatch(
            updateUser({
              firstName: data.firstName,
              lastName: data.lastName,
              userName: buildUserName(data.firstName, data.lastName),
              phoneNumber: data.phoneNumber,
              email: data.email,
            })
          );
        } catch (error) {
          console.error('updateProfile Error:', error);
        }
      },
    }),

    changePassword: builder.mutation<
      PasswordChangeResponse,
      PasswordChangeRequest
    >({
      query: (body) => ({
        url: '/profile/password',
        method: 'PUT',
        body,
      }),
    }),

    requestEmailChange: builder.mutation<
      RequestEmailChangeResponse,
      RequestEmailChangeRequest
    >({
      async queryFn(body) {
        console.log('[MOCK] requestEmailChange payload:', body);
        console.log(
          '[MOCK] verification code for testing:',
          MOCK_EMAIL_VERIFICATION_CODE
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        return {
          data: {
            message: `Verification code sent to ${body.newEmail} (mock)`,
          },
        };
      },
    }),

    verifyEmailCode: builder.mutation<
      VerifyEmailCodeResponse,
      VerifyEmailCodeRequest
    >({
      async queryFn(body) {
        console.log('[MOCK] verifyEmailCode payload:', body);

        await new Promise((resolve) => setTimeout(resolve, 500));

        if (body.verificationCode !== MOCK_EMAIL_VERIFICATION_CODE) {
          return {
            error: {
              status: 400,
              data: {
                message: 'Invalid or expired verification code.',
              },
            },
          };
        }

        return {
          data: {
            message: 'Email verified successfully (mock)',
          },
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useRequestEmailChangeMutation,
  useVerifyEmailCodeMutation,
} = profileApi;
