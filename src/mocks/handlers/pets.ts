import { delay, http, HttpResponse } from 'msw';
import { petsEntity } from '~/mocks/data/store/pets';
import { requireAuth } from '~/mocks/handlers/utils/auth-guard';
import type {
  CreatePetRequest,
  UpdatePetRequest,
} from '~/store/api/pets/pets-types';

const NETWORK_DELAY_MS = 250;

export const petsHandlers = [
  http.get('/pets/mine', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(petsEntity.listByUserId(auth.context.userId));
  }),

  http.get('/pets/:id', async ({ request, params }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const pet = petsEntity.getById(auth.context.userId, String(params.id));

    await delay(NETWORK_DELAY_MS);

    if (!pet) {
      return HttpResponse.json({ message: 'Pet not found.' }, { status: 404 });
    }

    return HttpResponse.json(pet);
  }),

  http.post('/pets', async ({ request }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const payload = (await request.json()) as CreatePetRequest;
    const created = petsEntity.create(auth.context.userId, payload);

    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/pets/:id', async ({ request, params }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const payload = (await request.json()) as UpdatePetRequest;
    const updated = petsEntity.update(
      auth.context.userId,
      String(params.id),
      payload
    );

    await delay(NETWORK_DELAY_MS);

    if (!updated) {
      return HttpResponse.json({ message: 'Pet not found.' }, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  http.delete('/pets/:id', async ({ request, params }) => {
    const auth = requireAuth(request);

    if ('response' in auth) {
      return auth.response;
    }

    const removed = petsEntity.remove(auth.context.userId, String(params.id));

    await delay(NETWORK_DELAY_MS);

    if (!removed) {
      return HttpResponse.json({ message: 'Pet not found.' }, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
