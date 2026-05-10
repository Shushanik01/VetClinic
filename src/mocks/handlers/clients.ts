import { delay, http, HttpResponse } from 'msw';
import { mockDb } from '~/mocks/data/mock-db';

const NETWORK_DELAY_MS = 250;

export const clientsHandlers = [
  http.get(/\/clients(\?.*)?$/, async () => {
    await delay(NETWORK_DELAY_MS);
    return HttpResponse.json(mockDb.clients.getAllWithPets());
  }),
];
