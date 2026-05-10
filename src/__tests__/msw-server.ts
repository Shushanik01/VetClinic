import { setupServer } from 'msw/node';
import { authHandlers } from '~/mocks/handlers/auth';

export const mswServer = setupServer(...authHandlers);
