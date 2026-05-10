import type {
  AppointmentSummary,
  BookAppointmentRequest,
} from '~/store/api/appointments/appointment-types';
import type { UserRole } from '~/store/features/user/user-types';

export const DEFAULT_SLOT_DURATION_MINUTES = 30;
export const DEFAULT_CLINIC_ADDRESS = '123 Main Street, New York, NY 10001';

export const appointments: AppointmentSummary[] = [
  {
    appointmentId: 'apt-1001',
    dateTimeStart: '2026-03-19T09:00:00',
    dateTimeEnd: '2026-03-19T09:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'General',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    veterinarianName: 'Dr. Sarah Wilson',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Annual check-up',
    status: 'Scheduled',
  },
  {
    appointmentId: 'apt-1002',
    dateTimeStart: '2026-04-02T14:00:00',
    dateTimeEnd: '2026-04-02T14:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'Surgery',
    veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    veterinarianName: 'Dr. Jennifer Lee',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Pre-surgery consultation for a knee injury',
    status: 'Scheduled',
  },
  {
    appointmentId: 'apt-1003',
    dateTimeStart: '2026-02-12T10:00:00',
    dateTimeEnd: '2026-02-12T10:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'General',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    veterinarianName: 'Dr. Sarah Wilson',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Follow-up after stomach upset',
    status: 'Service provided',
    veterinarianRecommendations:
      'Symptoms resolved well. Continue a bland diet for two days and keep hydration up.',
  },
  {
    appointmentId: 'apt-1004',
    dateTimeStart: '2026-01-28T16:00:00',
    dateTimeEnd: '2026-01-28T16:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'Dentistry',
    veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    veterinarianName: 'Dr. James Brown',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Dental cleaning and oral health check',
    status: 'Service provided',
    veterinarianRecommendations:
      'Teeth were cleaned successfully. Start dental chews and brush teeth three times per week.',
  },
  {
    appointmentId: 'apt-1005',
    dateTimeStart: '2026-03-05T11:00:00',
    dateTimeEnd: '2026-03-05T11:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'Surgery',
    veterinarianId: 'f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u',
    veterinarianName: 'Dr. Jennifer Lee',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Mass removal consultation',
    status: 'Canceled',
  },
  {
    appointmentId: 'apt-1006',
    dateTimeStart: '2026-02-25T15:30:00',
    dateTimeEnd: '2026-02-25T16:00:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'General',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    veterinarianName: 'Dr. Sarah Wilson',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Vaccination booster appointment',
    status: 'Canceled',
  },
  {
    appointmentId: 'apt-1007',
    dateTimeStart: '2026-01-10T09:30:00',
    dateTimeEnd: '2026-01-10T10:00:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'General',
    veterinarianId: 'c1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    veterinarianName: 'Dr. Sarah Wilson',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Recovery check after minor paw injury',
    status: 'Finished',
    veterinarianRecommendations:
      'Recovery is complete. Resume normal walks gradually over the next week.',
  },
  {
    appointmentId: 'apt-1008',
    dateTimeStart: '2025-12-18T13:00:00',
    dateTimeEnd: '2025-12-18T13:30:00',
    clientId: 'client-1',
    clientFirstName: 'Taylor',
    clientLastName: 'Green',
    veterinarianSpecialty: 'Dentistry',
    veterinarianId: 'd5e6f7g8-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
    veterinarianName: 'Dr. James Brown',
    location: DEFAULT_CLINIC_ADDRESS,
    petId: 'pet-1',
    petSpecies: 'Dog',
    petName: 'Buddy',
    petBirthDate: '2022-01-10',
    visitReason: 'Post-treatment review for gum inflammation',
    status: 'Finished',
    veterinarianRecommendations:
      'Gums healed well. Keep using the prescribed oral rinse for one more week.',
  },
];

// Helper types and functions
export type AppointmentActor = {
  userId: string;
  role: UserRole;
};

export type MutationResult<T> =
  | { status: 'ok'; data: T }
  | { status: 'not-found' }
  | { status: 'forbidden' }
  | { status: 'conflict' };

export const resolveClientId = (payload: BookAppointmentRequest): string =>
  'clientId' in payload
    ? payload.clientId
    : `guest-${crypto.randomUUID().slice(0, 8)}`;

export const resolveClientFirstName = (
  payload: BookAppointmentRequest
): string | undefined =>
  'firstName' in payload ? payload.firstName : undefined;

export const resolveClientLastName = (
  payload: BookAppointmentRequest
): string | undefined => ('lastName' in payload ? payload.lastName : undefined);

export const isStaffRole = (role: UserRole): boolean =>
  role === 'Receptionist' || role === 'Admin';

export const isClientAppointmentOwner = (
  appointment: AppointmentSummary,
  actor: AppointmentActor
): boolean => actor.role === 'Client' && appointment.clientId === actor.userId;

export const canManageAppointment = (
  appointment: AppointmentSummary,
  actor: AppointmentActor
): boolean =>
  isStaffRole(actor.role) || isClientAppointmentOwner(appointment, actor);

export const findById = (appointmentId: string): AppointmentSummary | null =>
  appointments.find((item) => item.appointmentId === appointmentId) ?? null;
