import { delay, http, HttpResponse } from 'msw';
import { mockDb } from '~/mocks/data/mock-db';

const NETWORK_DELAY_MS = 250;

export const clinicHandlers = [
  http.get('/clinics', async ({ request }) => {
    const url = new URL(request.url);
    const specialty = url.searchParams.get('specialty') ?? undefined;
    const date = url.searchParams.get('date') ?? undefined;
    const time = url.searchParams.get('time') ?? undefined;

    const clinics = mockDb.clinics.getByFilters({
      specialty,
      date,
      time,
    });

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(clinics);
  }),
];
