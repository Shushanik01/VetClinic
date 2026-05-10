import { describe, expect, it } from 'vitest';
import { ROUTES_PATH } from '~/app/providers/router/routes-path';

describe('ROUTES_PATH', () => {
  it('contains expected route mappings', () => {
    expect(ROUTES_PATH).toMatchObject({
      ROOT: '/',
      SIGN_UP: '/sign-up',
      LOGIN: '/login',
      BOOK_APPOINTMENT: '/book-appointment',
      VETERINARIAN_PROFILE: '/veterinarian/:veterinarianId',
      RECEPTIONIST_BOOKING: '/appointments',
      MY_APPOINTMENTS: '/my-appointments',
      MY_ACCOUNT: '/my-account',
      NOT_FOUND: '*',
    });
  });
});
