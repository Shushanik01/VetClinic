import type {
  BookAppointmentRequest,
  BookAppointmentResponse,
} from '~/store/api/appointments/appointment-types';
import type { Data } from '../table/table';

export type PopupCollectedData = Record<string, string>;

export const collectStepData = (form: HTMLFormElement): PopupCollectedData => {
  const formData = new FormData(form);

  return Object.fromEntries(
    [...formData.entries()].map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value];
      }

      return [key, value.name];
    })
  );
};

export const buildBookAppointmentRequest = (
  allData: PopupCollectedData
): BookAppointmentRequest => {
  const commonFields = {
    veterinarianId: allData.veterinarianId ?? '',
    date: allData.date ?? '',
    time: allData.time ?? '',
    clinicId: allData.clinicId ?? '',
    visitReason: allData.visitReason ?? '',
  };

  const petId = allData.petId || '';

  if (allData.clientId) {
    return {
      clientId: allData.clientId,
      ...commonFields,
      petId,
    };
  }

  return {
    firstName: allData.firstName ?? '',
    lastName: allData.lastName ?? '',
    phone: allData.phone ?? '',
    email: allData.email ?? '',
    ...commonFields,
    petId,
  };
};

export const buildClientName = (allData: PopupCollectedData): string => {
  if (allData.clientName) {
    return allData.clientName;
  }

  return `${allData.firstName ?? ''} ${allData.lastName ?? ''}`.trim();
};

export const buildFallbackPetName = (allData: PopupCollectedData): string => {
  return allData.petName || allData.newPetName || '';
};

export const buildPetAge = (dateOfBirth?: string): string => {
  if (!dateOfBirth) {
    return '';
  }

  const birth = new Date(dateOfBirth);
  const years = new Date().getFullYear() - birth.getFullYear();

  return years === 1 ? '1 year' : `${years} years`;
};

const isLegacyResponse = (
  response: BookAppointmentResponse
): response is Extract<BookAppointmentResponse, { appointment: unknown }> => {
  return 'appointment' in response;
};

type BuildNewAppointmentParams = {
  result: BookAppointmentResponse;
  allData: PopupCollectedData;
  clientName: string;
  fallbackPetName: string;
  petAge: string;
};

export const buildNewAppointment = ({
  result,
  allData,
  clientName,
  fallbackPetName,
  petAge,
}: BuildNewAppointmentParams): Data => {
  const appointmentId = isLegacyResponse(result)
    ? result.appointment.appointmentId
    : result.appointmentId;
  const petName = isLegacyResponse(result)
    ? result.appointment.petName
    : undefined;
  const date = isLegacyResponse(result)
    ? result.appointment.dateTimeStart
    : `${result.date}T${result.time}:00`;

  return {
    id: Date.now(),
    appointmentId,
    veterinarianId: allData.veterinarianId ?? '',
    clientName,
    petName: petName ?? fallbackPetName,
    petAge,
    vetName: allData.vetName ?? '',
    address: allData.location ?? '',
    specialty: allData.specialty ?? '',
    date,
    status: 'Scheduled',
  };
};

export const getSubmitButtonLabel = (
  isLastStep: boolean,
  isSubmitting: boolean
): string => {
  if (!isLastStep) {
    return 'Continue';
  }

  return isSubmitting ? 'Submitting...' : 'Submit';
};
