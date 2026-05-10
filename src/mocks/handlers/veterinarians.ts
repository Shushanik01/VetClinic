import { delay, http, HttpResponse } from 'msw';
import { mockDb } from '~/mocks/data/mock-db';
import type { FeedbackSort } from '~/store/api/vets/vets-types';

const NETWORK_DELAY_MS = 250;

export const veterinarianHandlers = [
  http.get('/veterinarians', async () => {
    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json({ veterinarians: mockDb.veterinarians.getList() });
  }),

  http.get('/veterinarians/:veterinarianId', async ({ params }) => {
    const veterinarian = mockDb.veterinarians.getById(
      String(params.veterinarianId)
    );

    await delay(NETWORK_DELAY_MS);

    if (!veterinarian) {
      return HttpResponse.json(
        { message: 'Veterinarian not found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(veterinarian);
  }),

  http.get(
    '/veterinarians/:veterinarianId/feedback',
    async ({ request, params }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get('page') ?? '0');
      const size = Number(url.searchParams.get('size') ?? '10');
      const sort =
        (url.searchParams.get('sort') as FeedbackSort | null) ?? 'date,desc';

      const feedbackPage = mockDb.veterinarians.getFeedback(
        String(params.veterinarianId),
        page,
        size,
        sort
      );

      await delay(NETWORK_DELAY_MS);
      return HttpResponse.json(feedbackPage);
    }
  ),

  http.get(
    '/veterinarians/:veterinarianId/available-dates',
    async ({ params }) => {
      const dates = mockDb.veterinarians.getAvailableDatesByVet(
        String(params.veterinarianId)
      );
      await delay(NETWORK_DELAY_MS);
      return HttpResponse.json({ dates });
    }
  ),

  http.get(
    '/veterinarians/:veterinarianId/available-slots/:date',
    async ({ params }) => {
      const slots = mockDb.veterinarians.getAvailableSlotsByVetAndDate(
        String(params.veterinarianId),
        String(params.date)
      );

      await delay(NETWORK_DELAY_MS);
      return HttpResponse.json({ slots });
    }
  ),
];
