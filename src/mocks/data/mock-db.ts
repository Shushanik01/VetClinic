import { appointmentsEntity } from '~/mocks/data/store/appointments';
import { authEntity } from '~/mocks/data/store/auth';
import { clinicsEntity } from '~/mocks/data/store/clinics';
import { clientsEntity } from '~/mocks/data/store/clients';
import { feedbackEntity } from '~/mocks/data/store/feedback';
import { petsEntity } from '~/mocks/data/store/pets';
import { profileEntity } from '~/mocks/data/store/profile';
import { veterinariansEntity } from '~/mocks/data/store/veterinarians';

export const mockDb = {
  auth: authEntity,
  profile: profileEntity,
  pets: petsEntity,
  appointments: appointmentsEntity,
  veterinarians: veterinariansEntity,
  clinics: clinicsEntity,
  clients: clientsEntity,
  feedback: feedbackEntity,
};
