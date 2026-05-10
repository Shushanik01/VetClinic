import {
  isValidISODate,
  validatePetBirthDate,
} from '~/components/book-appointment-form/book-appointment-schema';
import type { PetFormValues } from '~/pages/my-account-page/user-account/pets/pet-form/pet-form-fields';

export type BookAppointmentFormValues = {
  petType: 'registered' | 'new';
  petId: string;
  visitReason: string;
  newPet: PetFormValues;
};

type PetSummary = {
  id: string;
  petName: string;
  petBirthDate?: string | null;
};

type BuildFormValidityParams = {
  petType: 'registered' | 'new';
  selectedPetId: string;
  hasPets: boolean;
  isPetsPending: boolean;
  isValid: boolean;
  visitReason: string;
  newPetName: string;
  newPetSpecies: string;
  newPetDateOfBirth: string;
};

type SubmitAppointmentParams = {
  petType: 'registered' | 'new';
  selectedPetId: string;
  newPetName: string;
  newPetSpecies: string;
  newPetDateOfBirth: string;
  commonPayload: {
    clientId: string;
    veterinarianId: string;
    date: string;
    time: string;
    clinicId: string;
    visitReason: string;
  };
  submitPayload: (payload: unknown) => Promise<void>;
  refetchPets: () => Promise<unknown>;
  onPetsRefetched: (pets: PetSummary[]) => void;
};

type RunBookingFlowParams = {
  petType: 'registered' | 'new';
  selectedPetId: string;
  newPetName: string;
  newPetSpecies: string;
  newPetDateOfBirth: string;
  resolvedClinicIdForBooking: string;
  currentUserId?: string;
  veterinarianId: string;
  date: string;
  time: string;
  visitReason: string;
  submitPayload: (payload: unknown) => Promise<void>;
  refetchPets: () => Promise<unknown>;
  onPetsRefetched: (pets: PetSummary[]) => void;
};

type ApiErrorData = {
  message?: string;
};

type ApiErrorLike = {
  status?: number;
  data?: ApiErrorData;
};

export const createValidators = (
  getValues: (field: 'petType') => 'registered' | 'new'
) => ({
  visitReason: (value: string) => {
    if (!value) return true;
    return value.trim().length > 0 || 'Please enter a reason for your visit';
  },
  newPetName: (value: string) => {
    if (getValues('petType') !== 'new') return true;
    if (!value) return true;
    return value.trim().length > 0 || 'Please enter pet name';
  },
  newPetSpecies: (value: string) => {
    if (getValues('petType') !== 'new') return true;
    if (!value) return true;
    return value.trim().length > 0 || 'Please select species';
  },
  newPetDateOfBirth: (value: string) => {
    if (getValues('petType') !== 'new') return true;
    return validatePetBirthDate(value);
  },
});

export const buildPetOptions = (
  pets: PetSummary[],
  isPetsPending: boolean,
  hasPets: boolean
) => {
  if (isPetsPending) {
    return [{ label: 'Loading pets...', value: '' }];
  }

  return hasPets
    ? pets.map((pet) => ({
        label: pet.petName,
        value: pet.id,
      }))
    : [{ label: "You don't have registered pets yet", value: '' }];
};

export const buildFormValidity = ({
  petType,
  selectedPetId,
  hasPets,
  isPetsPending,
  isValid,
  visitReason,
  newPetName,
  newPetSpecies,
  newPetDateOfBirth,
}: BuildFormValidityParams) => {
  const hasVisitReason = visitReason.trim().length > 0;

  if (petType === 'registered') {
    return (
      !isPetsPending &&
      hasPets &&
      selectedPetId.trim().length > 0 &&
      hasVisitReason &&
      isValid
    );
  }

  const hasName = newPetName.trim().length > 0;
  const hasSpecies = newPetSpecies.trim().length > 0;
  const hasDob = newPetDateOfBirth.trim().length > 0;
  const isDateOk = hasDob && validatePetBirthDate(newPetDateOfBirth) === true;

  return hasName && hasSpecies && isDateOk && hasVisitReason;
};

export const getPetBirthdayForValidation = (
  petType: 'registered' | 'new',
  pets: PetSummary[],
  selectedPetId: string,
  newPetDateOfBirth: string
) => {
  if (petType === 'new') {
    return newPetDateOfBirth;
  }

  return pets.find((pet) => pet.id === selectedPetId)?.petBirthDate;
};

export const hasAppointmentBeforePetBirthday = (
  date: string,
  time: string,
  petBirthday?: string | null
) => {
  if (!petBirthday || !isValidISODate(petBirthday)) {
    return false;
  }

  const appointmentDateTime = new Date(`${date}T${time}:00`);
  const petBirthdayDate = new Date(petBirthday);

  return appointmentDateTime <= petBirthdayDate;
};

export const submitAppointment = async ({
  petType,
  selectedPetId,
  newPetName,
  newPetSpecies,
  newPetDateOfBirth,
  commonPayload,
  submitPayload,
  refetchPets,
  onPetsRefetched,
}: SubmitAppointmentParams) => {
  if (petType === 'registered') {
    await submitPayload({
      ...commonPayload,
      petId: selectedPetId,
    });

    return;
  }

  await submitPayload({
    ...commonPayload,
    petName: newPetName.trim(),
    petSpecies: newPetSpecies.trim(),
    petBirthDate: newPetDateOfBirth,
  });

  const refreshedPetsResult = (await refetchPets()) as {
    data?: PetSummary[];
  };
  const refreshedPets = refreshedPetsResult.data;

  if (Array.isArray(refreshedPets)) {
    onPetsRefetched(refreshedPets);
  }
};

export const getBookingErrorMessage = (error: unknown) => {
  const apiError =
    error && typeof error === 'object' ? (error as ApiErrorLike) : undefined;
  const status =
    typeof apiError?.status === 'number' ? apiError.status : undefined;
  const rawMessage =
    typeof apiError?.data?.message === 'string' ? apiError.data.message : '';
  const normalizedMessage = rawMessage.toLowerCase();

  const isSlotUnavailable =
    status === 409 ||
    status === 404 ||
    normalizedMessage.includes('not_found') ||
    normalizedMessage.includes('not found') ||
    normalizedMessage.includes('already booked') ||
    normalizedMessage.includes('unavailable');

  if (isSlotUnavailable) {
    return 'This slot is unavailable. Please choose another slot and try again.';
  }

  if (rawMessage.trim().length > 0) {
    return rawMessage;
  }

  return 'Failed to book appointment. Please try again.';
};

export const getAppointmentDateTimeError = (
  rootError: unknown
): string | undefined => {
  if (!rootError || typeof rootError !== 'object') {
    return undefined;
  }

  const message = (rootError as { appointmentDateTime?: { message?: string } })
    .appointmentDateTime?.message;

  return typeof message === 'string' ? message : undefined;
};

export const runBookingFlow = async ({
  petType,
  selectedPetId,
  newPetName,
  newPetSpecies,
  newPetDateOfBirth,
  resolvedClinicIdForBooking,
  currentUserId,
  veterinarianId,
  date,
  time,
  visitReason,
  submitPayload,
  refetchPets,
  onPetsRefetched,
}: RunBookingFlowParams): Promise<string | null> => {
  if (!resolvedClinicIdForBooking) {
    return 'Unable to book appointment because clinic information is missing. Please try another veterinarian or contact support.';
  }

  const commonPayload = {
    clientId: currentUserId || '',
    veterinarianId,
    date,
    time,
    clinicId: resolvedClinicIdForBooking,
    visitReason,
  };

  try {
    await submitAppointment({
      petType,
      selectedPetId,
      newPetName,
      newPetSpecies,
      newPetDateOfBirth,
      commonPayload,
      submitPayload,
      refetchPets,
      onPetsRefetched,
    });
    return null;
  } catch (error: unknown) {
    return getBookingErrorMessage(error);
  }
};
