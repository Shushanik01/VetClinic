import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { PopupWindow } from '~/components/pop-up-window/popup-window';
import { RadioInput } from '~/components/forms/radio-input';
import { useBookAppointmentMutation } from '~/store/api/appointments/appointment-api';
import { useGetVeterinarianByIdQuery } from '~/store/api/vets/vets-api';
import { useGetMyPetsQuery } from '~/store/api/pets/pets-api';
import { PETS_STORAGE_KEY, setPets } from '~/store/features/pets/pets-slice';
import { notify } from '~/app/providers/notifications';

import type { RootState } from '~/store/store';
import { RegisteredPetForm } from '~/components/book-appointment-form/registered-pet-form';
import { NewPetForm } from '~/components/book-appointment-form/new-pet-form';
import { AvailableSlotDetails } from '~/components/appointment-available-slots/available-slot-details';
import { resolveClinicIdByAddress } from '~/constants/clinics-location';
import {
  buildFormValidity,
  buildPetOptions,
  createValidators,
  getAppointmentDateTimeError,
  getPetBirthdayForValidation,
  hasAppointmentBeforePetBirthday,
  runBookingFlow,
  type BookAppointmentFormValues,
} from '~/components/book-appointment-form/book-appointment-popup.helpers';
import {
  PopupActions,
  PopupErrorAlert,
} from '~/components/book-appointment-form/book-appointment-popup-sections';

type BookAppointmentPopupProps = {
  veterinarianName: string;
  veterinarianSpecialty: string;
  date: string;
  time: string;
  clinicAddress: string;
  veterinarianId: string;
  clinicId: string;
  onClose: () => void;
  onBooked?: (booked: {
    veterinarianId: string;
    clinicId: string;
    date: string;
    time: string;
  }) => void;
};

export const BookAppointmentPopup = ({
  veterinarianName,
  veterinarianSpecialty,
  date,
  time,
  clinicAddress,
  veterinarianId,
  clinicId,
  onClose,
  onBooked,
}: BookAppointmentPopupProps) => {
  const popupContentRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const normalizedClinicId = (clinicId ?? '').trim();
  const {
    data: pets = [],
    isLoading: isPetsLoading,
    isFetching: isPetsFetching,
    refetch: refetchPets,
  } = useGetMyPetsQuery();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();
  const [bookingError, setBookingError] = useState<string | null>(null);
  const { data: veterinarianProfile } = useGetVeterinarianByIdQuery(
    veterinarianId,
    {
      skip: !veterinarianId || normalizedClinicId.length > 0,
    }
  );

  const isSubmitting = isBooking;

  const {
    control,
    watch,
    getValues,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookAppointmentFormValues>({
    mode: 'onChange',
    defaultValues: {
      petType: 'registered',
      petId: '',
      visitReason: '',
      newPet: {
        name: '',
        species: '',
        breed: '',
        dateOfBirth: '',
        sex: '',
      },
    },
  });

  const petType = watch('petType');
  const selectedPetId = watch('petId');
  const visitReason = watch('visitReason');
  const newPetName = watch('newPet.name') ?? '';
  const newPetSpecies = watch('newPet.species') ?? '';
  const newPetDateOfBirth = watch('newPet.dateOfBirth') ?? '';
  const resolvedClinicIdForBooking =
    normalizedClinicId ||
    veterinarianProfile?.clinicId?.trim() ||
    resolveClinicIdByAddress(clinicAddress);

  const validators = useMemo(() => createValidators(getValues), [getValues]);

  const hasPets = pets.length > 0;
  const isPetsPending = isPetsLoading || isPetsFetching;

  const petOptions = useMemo(
    () => buildPetOptions(pets, isPetsPending, hasPets),
    [pets, hasPets, isPetsPending]
  );

  const dateTimeError = getAppointmentDateTimeError(errors.root);

  const isFormValid = useMemo(
    () =>
      buildFormValidity({
        petType,
        selectedPetId,
        hasPets,
        isPetsPending,
        isValid,
        visitReason,
        newPetName,
        newPetSpecies,
        newPetDateOfBirth,
      }),
    [
      petType,
      selectedPetId,
      hasPets,
      isPetsPending,
      isValid,
      visitReason,
      newPetName,
      newPetSpecies,
      newPetDateOfBirth,
    ]
  );

  const syncPets = (updatedPets: typeof pets) => {
    dispatch(setPets(updatedPets));

    if (typeof globalThis !== 'undefined') {
      localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(updatedPets));
    }
  };

  useEffect(() => {
    if (pets.length > 0) {
      syncPets(pets);
    }
  }, [pets]);

  const onSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    clearErrors('root');
    setBookingError(null);

    const petBirthday = getPetBirthdayForValidation(
      petType,
      pets,
      selectedPetId,
      newPetDateOfBirth
    );

    if (hasAppointmentBeforePetBirthday(date, time, petBirthday)) {
      setError('root.appointmentDateTime', {
        type: 'validate',
        message: "Appointment must be scheduled after the pet's birthday",
      });
      return;
    }

    const bookingErrorMessage = await runBookingFlow({
      petType,
      selectedPetId,
      newPetName,
      newPetSpecies,
      newPetDateOfBirth,
      resolvedClinicIdForBooking,
      currentUserId: currentUser?.userId,
      veterinarianId,
      date,
      time,
      visitReason,
      submitPayload: async (payload) => {
        await bookAppointment(
          payload as Parameters<typeof bookAppointment>[0]
        ).unwrap();
      },
      refetchPets,
      onPetsRefetched: (updatedPets) => {
        syncPets(updatedPets as typeof pets);
      },
    });

    if (bookingErrorMessage) {
      setBookingError(bookingErrorMessage);
      return;
    }

    notify({
      description: 'The appointment has been booked successfully',
      type: 'success',
    });

    onBooked?.({
      veterinarianId,
      clinicId: resolvedClinicIdForBooking,
      date,
      time,
    });

    onClose();
  };

  useEffect(() => {
    clearErrors('root');
    setBookingError(null);
  }, [petType, selectedPetId, newPetDateOfBirth, date, time, clearErrors]);

  useEffect(() => {
    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;

      const target = event.target;
      if (!(target instanceof Node)) return;

      if (!popupContentRef.current?.contains(target)) {
        return;
      }

      // Keep Enter behavior for multiline textareas.
      if (target instanceof HTMLTextAreaElement) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isFormValid && !isSubmitting) {
        void handleSubmit(onSubmit)();
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [handleSubmit, isFormValid, isSubmitting, onSubmit]);

  return (
    <PopupWindow onClose={onClose}>
      <div
        ref={popupContentRef}
        className="bg-neutral-0 rounded-[16px] p-[24px] w-[92vw] sm:w-[80vw] md:w-[65vw] lg:w-[50vw] xl:w-[30vw] max-w-[720px] min-w-0 sm:min-w-[380px] max-h-[90vh] overflow-y-auto flex flex-col gap-[24px]"
      >
        <h2 className="text-h2 text-black-900">Book Appointment</h2>

        {/* Appointment Details */}
        <AvailableSlotDetails
          veterinarianSpecialty={veterinarianSpecialty}
          veterinarianName={veterinarianName}
          veterinarianId={veterinarianId}
          date={date}
          time={time}
          clinicAddress={clinicAddress}
        />

        <PopupErrorAlert message={dateTimeError} />
        <PopupErrorAlert message={bookingError ?? undefined} />

        {/* Pet Selection */}
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-h3 text-black-900">Pet details</h3>
          <Controller
            name="petType"
            control={control}
            render={({ field }) => (
              <RadioInput
                name={field.name}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value as 'registered' | 'new');
                  clearErrors();
                }}
                options={[
                  { label: 'Registered pet', value: 'registered' },
                  { label: 'New pet', value: 'new' },
                ]}
                horizontal
              />
            )}
          />
        </div>

        {/* Registered Pet Form */}
        {petType === 'registered' && (
          <RegisteredPetForm
            control={control}
            petOptions={petOptions}
            hasPets={hasPets}
            petIdError={errors.petId?.message}
            visitReasonError={errors.visitReason?.message}
            validateVisitReason={validators.visitReason}
          />
        )}

        {/* New Pet Form */}
        {petType === 'new' && (
          <NewPetForm
            control={control}
            nameError={errors.newPet?.name?.message}
            speciesError={errors.newPet?.species?.message}
            dateOfBirthError={errors.newPet?.dateOfBirth?.message}
            visitReasonError={errors.visitReason?.message}
            validateVisitReason={validators.visitReason}
            validateName={validators.newPetName}
            validateSpecies={validators.newPetSpecies}
            validateDateOfBirth={validators.newPetDateOfBirth}
          />
        )}

        {/* Actions */}
        <PopupActions
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          onClose={onClose}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    </PopupWindow>
  );
};
