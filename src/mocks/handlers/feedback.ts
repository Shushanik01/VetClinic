import { delay, http, HttpResponse } from 'msw';
import { mockDb } from '~/mocks/data/mock-db';
import { requireAuth } from '~/mocks/handlers/utils/auth-guard';

const NETWORK_DELAY_MS = 250;

export const feedbackHandlers = [
  http.get('/feedback', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '0');
    const size = Number(url.searchParams.get('size') ?? '10');
    const sort =
      (url.searchParams.get('sort') as
        | 'rating,asc'
        | 'rating,desc'
        | 'date,asc'
        | 'date,desc'
        | null) ?? 'date,desc';

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(mockDb.feedback.listPublic(page, size, sort));
  }),

  http.post('/feedback', async ({ request }) => {
    const auth = requireAuth(request);
    const actor =
      'response' in auth
        ? { userId: 'client-1', role: 'Client' as const }
        : auth.context;

    const payload = (await request.json()) as {
      appointmentId: string;
      comment: string;
      rating: number;
    };

    const created = mockDb.feedback.create(actor.userId, payload);

    await delay(NETWORK_DELAY_MS);

    if (created.status === 'not-found') {
      return HttpResponse.json(
        { message: 'Appointment not found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(created.data, { status: 201 });
  }),

  http.get('/feedback/:feedbackId', async ({ request, params }) => {
    const auth = requireAuth(request);
    // Allow unauthenticated access for demo — auth context unused for read-only fetch
    void auth;

    const feedback = mockDb.feedback.getById(String(params.feedbackId));

    await delay(NETWORK_DELAY_MS);

    if (!feedback) {
      return HttpResponse.json(
        { message: 'Feedback not found.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(feedback);
  }),

  http.put('/feedback/:feedbackId', async ({ request, params }) => {
    const auth = requireAuth(request);
    const actor =
      'response' in auth
        ? { userId: 'client-1', role: 'Client' as const }
        : auth.context;

    const payload = (await request.json()) as {
      comment: string;
      rating: number;
    };
    const updated = mockDb.feedback.update(
      String(params.feedbackId),
      actor,
      payload
    );

    await delay(NETWORK_DELAY_MS);

    if (updated.status === 'not-found') {
      return HttpResponse.json(
        { message: 'Feedback not found.' },
        { status: 404 }
      );
    }

    if (updated.status === 'forbidden') {
      return HttpResponse.json(
        { message: 'Forbidden: insufficient permissions.' },
        { status: 403 }
      );
    }

    return HttpResponse.json(updated.data);
  }),
];
