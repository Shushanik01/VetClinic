import { delay, http, HttpResponse } from '~/mocks/handlers/utils/base-http';
import { profileEntity } from '~/mocks/data/store/profile';
import { requireAuth } from '~/mocks/handlers/utils/auth-guard';
import type {
  PasswordChangeRequest,
  ProfileUpdateRequest,
} from '~/store/api/profile/profile-types';

const NETWORK_DELAY_MS = 250;

export const profileHandlers = [
  http.get('/profile', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const profile = profileEntity.getByUserId(auth.context.userId);

    await delay(NETWORK_DELAY_MS);

    if (!profile) {
      return HttpResponse.json(
        { message: 'Profile not found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(profile);
  }),

  http.patch('/profile', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const payload = (await request.json()) as ProfileUpdateRequest;
    const profile = profileEntity.updateByUserId(auth.context.userId, payload);

    await delay(NETWORK_DELAY_MS);

    if (!profile) {
      return HttpResponse.json(
        { message: 'Profile not found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(profile);
  }),

  http.put('/profile/password', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const payload = (await request.json()) as PasswordChangeRequest;
    const result = profileEntity.changePassword(auth.context.userId, payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(result.body, { status: result.status });
  }),
];
