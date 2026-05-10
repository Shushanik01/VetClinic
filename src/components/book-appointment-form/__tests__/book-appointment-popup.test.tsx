import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Controller } from 'react-hook-form';
import { fireEvent, renderWithProviders, screen, waitFor } from '~/__tests__';
import { BookAppointmentPopup } from '~/components/book-appointment-form/book-appointment-popup';
import { PETS_STORAGE_KEY, setPets } from '~/store/features/pets/pets-slice';

const { mockNotify, mockDispatch } = vi.hoisted(() => ({
  mockNotify: vi.fn(),
  mockDispatch: vi.fn(),
}));

const mockBookAppointment = vi.hoisted(() => vi.fn());
const mockRefetchPets = vi.hoisted(() => vi.fn());
const mockResolveClinicIdByAddress = vi.hoisted(() => vi.fn());
const mockUseGetVeterinarianByIdQuery = vi.hoisted(() => vi.fn());

class AppointmentApiError extends Error {
  status: number;
  data: { message: string };

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.data = { message };
  }
}

const mockState = vi.hoisted(() => ({
  currentUserId: 'client-1',
  pets: [
    {
      id: 'pet-1',
      petName: 'Milo',
      petBirthDate: '2020-01-01',
    },
  ],
  isPetsLoading: false,
  isPetsFetching: false,
  isBooking: false,
  veterinarianProfile: undefined as { clinicId?: string } | undefined,
}));

vi.mock('~/app/providers/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('~/constants/clinics-location', () => ({
  resolveClinicIdByAddress: mockResolveClinicIdByAddress,
}));

vi.mock('react-redux', async () => {
  const actual =
    await vi.importActual<typeof import('react-redux')>('react-redux');

  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: unknown) => unknown) =>
      selector({ user: { currentUser: { userId: mockState.currentUserId } } }),
  };
});

vi.mock('~/store/api/appointments/appointment-api', () => ({
  useBookAppointmentMutation: () =>
    [mockBookAppointment, { isLoading: mockState.isBooking }] as const,
}));

vi.mock('~/store/api/pets/pets-api', () => ({
  useGetMyPetsQuery: () => ({
    data: mockState.pets,
    isLoading: mockState.isPetsLoading,
    isFetching: mockState.isPetsFetching,
    refetch: mockRefetchPets,
  }),
}));

vi.mock('~/store/api/vets/vets-api', () => ({
  useGetVeterinarianByIdQuery: (...args: unknown[]) =>
    mockUseGetVeterinarianByIdQuery(...args),
}));

vi.mock('~/components/pop-up-window/popup-window', () => ({
  PopupWindow: ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => (
    <div data-testid="popup-window-mock">
      {children}
      <button data-testid="popup-close-shell" onClick={onClose} type="button">
        Close shell
      </button>
    </div>
  ),
}));

vi.mock(
  '~/components/appointment-available-slots/available-slot-details',
  () => ({
    AvailableSlotDetails: ({
      veterinarianName,
    }: {
      veterinarianName: string;
    }) => (
      <div data-testid="available-slot-details-mock">{veterinarianName}</div>
    ),
  })
);

vi.mock('~/components/forms/radio-input', () => ({
  RadioInput: ({
    value,
    onChange,
  }: {
    value: 'registered' | 'new';
    onChange: (value: string) => void;
  }) => (
    <div data-testid="pet-type-radio-mock">
      <div data-testid="pet-type-value">{value}</div>
      <button
        data-testid="switch-registered"
        onClick={() => onChange('registered')}
        type="button"
      >
        Registered
      </button>
      <button
        data-testid="switch-new"
        onClick={() => onChange('new')}
        type="button"
      >
        New
      </button>
    </div>
  ),
}));

vi.mock('~/components/book-appointment-form/registered-pet-form', () => ({
  RegisteredPetForm: ({
    control,
    hasPets,
  }: {
    control: unknown;
    hasPets: boolean;
  }) => (
    <div data-testid="registered-pet-form-mock">
      <div data-testid="registered-has-pets">{String(hasPets)}</div>
      <Controller
        name="petId"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="registered-pet-id"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="visitReason"
        control={control as never}
        render={({ field }) => (
          <textarea
            data-testid="registered-visit-reason"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  ),
}));

vi.mock('~/components/book-appointment-form/new-pet-form', () => ({
  NewPetForm: ({ control }: { control: unknown }) => (
    <div data-testid="new-pet-form-mock">
      <Controller
        name="newPet.name"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="new-pet-name"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="newPet.species"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="new-pet-species"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="newPet.breed"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="new-pet-breed"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="newPet.dateOfBirth"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="new-pet-date-of-birth"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="newPet.sex"
        control={control as never}
        render={({ field }) => (
          <input
            data-testid="new-pet-sex"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <Controller
        name="visitReason"
        control={control as never}
        render={({ field }) => (
          <textarea
            data-testid="new-pet-visit-reason"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  ),
}));

describe('BookAppointmentPopup', () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };

  beforeEach(() => {
    mockNotify.mockReset();
    mockDispatch.mockReset();
    mockBookAppointment.mockReset();
    mockRefetchPets.mockReset();
    mockResolveClinicIdByAddress.mockReset();
    mockUseGetVeterinarianByIdQuery.mockReset();

    mockState.currentUserId = 'client-1';
    mockState.pets = [
      {
        id: 'pet-1',
        petName: 'Milo',
        petBirthDate: '2020-01-01',
      },
    ];
    mockState.isPetsLoading = false;
    mockState.isPetsFetching = false;
    mockState.isBooking = false;
    mockState.veterinarianProfile = undefined;

    mockResolveClinicIdByAddress.mockReturnValue('resolved-clinic-id');
    mockUseGetVeterinarianByIdQuery.mockImplementation(() => ({
      data: mockState.veterinarianProfile,
    }));

    mockBookAppointment.mockReturnValue({
      unwrap: async () => ({ id: 'appointment-1' }),
    });
    mockRefetchPets.mockResolvedValue({ data: mockState.pets });

    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
    localStorageMock.clear.mockReset();

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      configurable: true,
    });
  });

  it('renders popup content and uses registered flow by default', () => {
    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Kyiv clinic"
        clinicId="clinic-1"
        onClose={vi.fn()}
      />
    );

    expect(screen.getByTestId('popup-window-mock')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Book Appointment' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('available-slot-details-mock')).toHaveTextContent(
      'Dr Jane'
    );
    expect(screen.getByTestId('registered-pet-form-mock')).toBeInTheDocument();
    expect(screen.getByTestId('pet-type-value')).toHaveTextContent(
      'registered'
    );

    expect(mockDispatch).toHaveBeenCalledWith(setPets(mockState.pets as never));
    expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
      PETS_STORAGE_KEY,
      JSON.stringify(mockState.pets)
    );

    expect(mockUseGetVeterinarianByIdQuery).toHaveBeenCalledWith('vet-1', {
      skip: true,
    });
  });

  it('books appointment for registered pet and triggers callbacks', async () => {
    const onClose = vi.fn();
    const onBooked = vi.fn();

    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Kyiv clinic"
        clinicId=" clinic-1 "
        onClose={onClose}
        onBooked={onBooked}
      />
    );

    fireEvent.change(screen.getByTestId('registered-pet-id'), {
      target: { value: 'pet-1' },
    });
    fireEvent.change(screen.getByTestId('registered-visit-reason'), {
      target: { value: 'Routine checkup' },
    });

    const submitButton = screen.getByRole('button', {
      name: 'Book Appointment',
    });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockBookAppointment).toHaveBeenCalledWith({
        clientId: 'client-1',
        veterinarianId: 'vet-1',
        date: '2026-06-10',
        time: '10:30',
        clinicId: 'clinic-1',
        petId: 'pet-1',
        visitReason: 'Routine checkup',
      });
    });

    expect(mockNotify).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
      })
    );

    expect(onBooked).toHaveBeenCalledWith({
      veterinarianId: 'vet-1',
      clinicId: 'clinic-1',
      date: '2026-06-10',
      time: '10:30',
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('books with new pet payload in one request and resolved clinic from veterinarian profile', async () => {
    mockState.veterinarianProfile = { clinicId: 'vet-clinic-2' };
    const refreshedPets = [
      {
        id: 'pet-1',
        petName: 'Garfield',
        petBirthDate: '2003-04-20',
      },
      {
        id: 'cdc89b91-d59a-4232-91ae-090d71151d6f',
        petName: 'Tom',
        petBirthDate: '2003-04-20',
      },
    ];
    mockRefetchPets.mockResolvedValue({ data: refreshedPets });

    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr New"
        veterinarianSpecialty="Dermatology"
        veterinarianId="vet-2"
        date="2026-06-11"
        time="12:00"
        clinicAddress="Lviv clinic"
        clinicId=""
        onClose={vi.fn()}
      />
    );

    fireEvent.click(screen.getByTestId('switch-new'));

    fireEvent.change(screen.getByTestId('new-pet-name'), {
      target: { value: 'Nova' },
    });
    fireEvent.change(screen.getByTestId('new-pet-species'), {
      target: { value: 'dog' },
    });
    fireEvent.change(screen.getByTestId('new-pet-date-of-birth'), {
      target: { value: '2020-01-01' },
    });
    fireEvent.change(screen.getByTestId('new-pet-sex'), {
      target: { value: 'female' },
    });
    fireEvent.change(screen.getByTestId('new-pet-visit-reason'), {
      target: { value: 'Vaccination' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));

    await waitFor(() => {
      expect(mockBookAppointment).toHaveBeenCalledWith({
        clientId: 'client-1',
        veterinarianId: 'vet-2',
        date: '2026-06-11',
        time: '12:00',
        clinicId: 'vet-clinic-2',
        petName: 'Nova',
        petSpecies: 'dog',
        petBirthDate: '2020-01-01',
        visitReason: 'Vaccination',
      });
      expect(mockRefetchPets).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        setPets(refreshedPets as never)
      );
      expect(globalThis.localStorage.setItem).toHaveBeenCalledWith(
        PETS_STORAGE_KEY,
        JSON.stringify(refreshedPets)
      );
    });

    expect(mockUseGetVeterinarianByIdQuery).toHaveBeenCalledWith('vet-2', {
      skip: false,
    });
  });

  it('shows date-time validation error when appointment is on or before pet birthday', async () => {
    mockState.pets = [
      {
        id: 'pet-1',
        petName: 'Milo',
        petBirthDate: '2027-01-01',
      },
    ];

    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Kyiv clinic"
        clinicId="clinic-1"
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByTestId('registered-pet-id'), {
      target: { value: 'pet-1' },
    });
    fireEvent.change(screen.getByTestId('registered-visit-reason'), {
      target: { value: 'Reason' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Book Appointment' })
      ).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Appointment must be scheduled after the pet's birthday"
        )
      ).toBeInTheDocument();
      expect(mockBookAppointment).not.toHaveBeenCalled();
    });
  });

  it('shows booking error when clinic id cannot be resolved', async () => {
    mockState.veterinarianProfile = undefined;
    mockResolveClinicIdByAddress.mockReturnValue('');

    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Unknown clinic"
        clinicId=""
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByTestId('registered-pet-id'), {
      target: { value: 'pet-1' },
    });
    fireEvent.change(screen.getByTestId('registered-visit-reason'), {
      target: { value: 'Reason' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Book Appointment' })
      ).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Unable to book appointment because clinic information is missing/i
        )
      ).toBeInTheDocument();
      expect(mockBookAppointment).not.toHaveBeenCalled();
    });
  });

  it('shows API error message when booking fails', async () => {
    mockBookAppointment.mockReturnValue({
      unwrap: async () => {
        throw new AppointmentApiError(404, 'NOT_FOUND');
      },
    });

    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Kyiv clinic"
        clinicId="clinic-1"
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByTestId('registered-pet-id'), {
      target: { value: 'pet-1' },
    });
    fireEvent.change(screen.getByTestId('registered-visit-reason'), {
      target: { value: 'Reason' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Book Appointment' })
      ).toBeEnabled();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'This slot is unavailable. Please choose another slot and try again.'
        )
      ).toBeInTheDocument();
    });
  });

  it('submits on Enter from input, but not from textarea', async () => {
    renderWithProviders(
      <BookAppointmentPopup
        veterinarianName="Dr Jane"
        veterinarianSpecialty="Surgery"
        veterinarianId="vet-1"
        date="2026-06-10"
        time="10:30"
        clinicAddress="Kyiv clinic"
        clinicId="clinic-1"
        onClose={vi.fn()}
      />
    );

    fireEvent.change(screen.getByTestId('registered-pet-id'), {
      target: { value: 'pet-1' },
    });
    fireEvent.change(screen.getByTestId('registered-visit-reason'), {
      target: { value: 'Reason' },
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Book Appointment' })
      ).toBeEnabled();
    });

    fireEvent.keyDown(screen.getByTestId('registered-pet-id'), {
      key: 'Enter',
      code: 'Enter',
    });

    await waitFor(() => {
      expect(mockBookAppointment).toHaveBeenCalledTimes(1);
    });

    mockBookAppointment.mockClear();

    fireEvent.keyDown(screen.getByTestId('registered-visit-reason'), {
      key: 'Enter',
      code: 'Enter',
    });

    await waitFor(() => {
      expect(mockBookAppointment).not.toHaveBeenCalled();
    });
  });
});
