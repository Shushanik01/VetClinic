// Request types
export type AvailableSlotsRequest = {
  veterinarianSpecialty: string;
  date?: string;
  time?: string;
  clinicId?: string;
};

type RegisteredClientBookingRequest = {
  clientId: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicId: string;
  visitReason: string;
};

type GuestClientBookingRequest = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicId: string;
  visitReason: string;
};

type ExistingPetSelection = {
  petId: string;
  petName?: never;
  petSpecies?: never;
  petBirthDate?: never;
};

type NewPetSelection = {
  petId?: never;
  petName: string;
  petSpecies: string;
  petBirthDate: string;
};

export type BookAppointmentRequest =
  | (RegisteredClientBookingRequest & (ExistingPetSelection | NewPetSelection))
  | (GuestClientBookingRequest & (ExistingPetSelection | NewPetSelection));

// Response types
export type AppointmentSlot = {
  veterinarianSpecialty: string;
  veterinarianName: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicId: string;
  clinicAddress: string;
  bookAppointmentAvailable: boolean;
};

export type AvailableSlotsResponse = {
  slots: AppointmentSlot[];
};

export type BookAppointmentResponseV2 = {
  appointmentId: string;
  veterinarianId: string;
  date: string;
  time: string;
  clinicId: string;
  clinicAddress: string;
  petId: string;
  visitReason: string;
  status: AppointmentStatus;
  confirmationMessage: string;
};

export type LegacyBookAppointmentResponse = {
  appointment: AppointmentSummary;
  confirmationMessage: string;
};

export type BookAppointmentResponse =
  | BookAppointmentResponseV2
  | LegacyBookAppointmentResponse;

// appointment statuses for receptionist booking
export type AppointmentStatus =
  | 'Scheduled'
  | 'Service provided'
  | 'Canceled'
  | 'Finished';

// response for receptionist booking
export type AppointmentSummary = {
  appointmentId: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  clientId: string;
  clientFirstName?: string;
  clientLastName?: string;
  veterinarianSpecialty?: string;
  veterinarianId: string;
  veterinarianName?: string;
  location: string;
  petId: string;
  petSpecies?: string;
  petName?: string;
  petBirthDate?: string;
  visitReason: string;
  status: AppointmentStatus;
  veterinarianRecommendations?: string;
  feedbackId?: string;
  feedback?: {
    id: string;
    rating: number;
    comment: string;
    date: string;
  };
};

// response type for receptionist booking
export type AppointmentsListResponse = {
  appointments: AppointmentSummary[];
};

export type AppointmentCancelResponse = {
  message: string;
};

export type AppointmentRescheduleRequest = {
  newDateTime: string;
};

export type AppointmentRescheduleResponse = {
  message: string;
};
