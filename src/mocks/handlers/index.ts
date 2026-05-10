import { authHandlers } from '~/mocks/handlers/auth';
import { appointmentHandlers } from '~/mocks/handlers/appointments';
import { clinicHandlers } from '~/mocks/handlers/clinics';
import { clientsHandlers } from '~/mocks/handlers/clients';
import { feedbackHandlers } from '~/mocks/handlers/feedback';
import { petsHandlers } from '~/mocks/handlers/pets';
import { profileHandlers } from '~/mocks/handlers/profile';
import { veterinarianHandlers } from '~/mocks/handlers/veterinarians';

export const handlers = [
  ...authHandlers,
  ...appointmentHandlers,
  ...clinicHandlers,
  ...clientsHandlers,
  ...feedbackHandlers,
  ...petsHandlers,
  ...profileHandlers,
  ...veterinarianHandlers,
];
