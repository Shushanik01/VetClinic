import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '~/__tests__';
import { BookAppointmentPage } from './book-appointment-page';
import type { AvailableSlotsSearchFormValues } from '~/components/appointment-available-slots/available-slots-search-schema';

const mockTriggerGetAvailableSlots = vi.hoisted(() => vi.fn());
const mockResolveClinicIdByAddress = vi.hoisted(() => vi.fn());
const mockFormReset = vi.hoisted(() => vi.fn());

const mockState = vi.hoisted(() => ({
  searchPayload: {
    specialty: 'Surgery',
    date: ' 2026-04-16 ',
    time: ' 10:30 ',
    location: ' clinic-1 ',
  } as AvailableSlotsSearchFormValues,
  registerReset: true,
  bookedPayload: {
    veterinarianId: 'vet-1',
    clinicId: 'clinic-1',
    date: '2026-04-16',
    time: '10:30',
  },
}));

vi.mock('~/store/api/appointments/appointment-api', () => ({
  useLazyGetAvailableSlotsQuery: () => [mockTriggerGetAvailableSlots] as const,
}));

vi.mock('~/constants/clinics-location', () => ({
  resolveClinicIdByAddress: mockResolveClinicIdByAddress,
}));

vi.mock(
  '~/components/appointment-available-slots/available-slots-search',
  () => ({
    AvailableSlotsSearch: ({
      onSearch,
      onResetRef,
    }: {
      onSearch: (values: AvailableSlotsSearchFormValues) => Promise<void>;
      onResetRef: (resetFn: () => void) => void;
    }) => {
      if (mockState.registerReset) {
        onResetRef(mockFormReset);
      }

      return (
        <div data-testid="available-slots-search-mock">
          <button
            data-testid="available-slots-search-submit"
            onClick={() => void onSearch(mockState.searchPayload)}
            type="button"
          >
            Search
          </button>
        </div>
      );
    },
  })
);

vi.mock('~/components/appointment-available-slots/appointment-list', () => ({
  AppointmentList: ({
    appointments,
    show,
    isLoading,
    onResetFilters,
    onBooked,
  }: {
    appointments: Array<{
      veterinarianName: string;
      clinicAddress: string;
      clinicId: string;
      veterinarianId: string;
      date: string;
      time: string;
    }>;
    show: boolean;
    isLoading: boolean;
    onResetFilters: () => void;
    onBooked: (booked: {
      veterinarianId: string;
      clinicId: string;
      date: string;
      time: string;
    }) => void;
  }) => (
    <div data-testid="appointment-list-mock">
      <div data-testid="appointment-list-show">{String(show)}</div>
      <div data-testid="appointment-list-loading">{String(isLoading)}</div>
      <div data-testid="appointment-list-count">{appointments.length}</div>
      <div data-testid="appointment-list-names">
        {appointments.map((item) => item.veterinarianName).join('|')}
      </div>
      <div data-testid="appointment-list-addresses">
        {appointments.map((item) => item.clinicAddress).join('|')}
      </div>
      <div data-testid="appointment-list-clinic-ids">
        {appointments.map((item) => item.clinicId).join('|')}
      </div>

      <button
        data-testid="appointment-list-reset"
        onClick={() => onResetFilters()}
        type="button"
      >
        Reset
      </button>
      <button
        data-testid="appointment-list-booked"
        onClick={() => onBooked(mockState.bookedPayload)}
        type="button"
      >
        Booked
      </button>
    </div>
  ),
}));

describe('BookAppointmentPage', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    mockTriggerGetAvailableSlots.mockReset();
    mockResolveClinicIdByAddress.mockReset();
    mockResolveClinicIdByAddress.mockReturnValue('resolved-clinic-id');
    mockFormReset.mockReset();

    mockState.searchPayload = {
      specialty: 'Surgery',
      date: ' 2026-04-16 ',
      time: ' 10:30 ',
      location: ' clinic-1 ',
    };
    mockState.registerReset = true;
    mockState.bookedPayload = {
      veterinarianId: 'vet-1',
      clinicId: 'clinic-1',
      date: '2026-04-16',
      time: '10:30',
    };
  });

  it('renders heading, description and child sections', () => {
    renderWithProviders(<BookAppointmentPage />);

    expect(
      screen.getByRole('heading', { name: /book an appointment/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/fill in the details below to find and book/i)
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('available-slots-search-mock')
    ).toBeInTheDocument();
    expect(screen.getByTestId('appointment-list-mock')).toBeInTheDocument();
    expect(screen.getByTestId('appointment-list-show')).toHaveTextContent(
      'false'
    );
    expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
      'false'
    );
  });

  it('submits search with trimmed optional values and maps slots', async () => {
    mockResolveClinicIdByAddress
      .mockReturnValueOnce('resolved-address-d')
      .mockReturnValueOnce('resolved-empty-address');

    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => ({
        slots: [
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr One',
            veterinarianId: 'vet-1',
            date: '2026-04-16',
            time: '10:30',
            clinicAddress: 'Address A',
            clinicId: 'clinic-1',
          },
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr Two',
            veterinarianId: 'vet-2',
            date: '2026-04-17',
            time: '11:00',
            locationAddress: 'Address B',
            locationId: 'clinic-2',
          },
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr Three',
            veterinarianId: 'vet-3',
            date: '2026-04-18',
            time: '12:00',
            clinicLocation: 'Address C',
            clinicLocationId: 'clinic-3',
          },
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr Four',
            veterinarianId: 'vet-4',
            date: '2026-04-19',
            time: '12:30',
            location: 'Address D',
          },
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr Five',
            veterinarianId: 'vet-5',
            date: '2026-04-20',
            time: '13:00',
          },
        ],
      }),
    });

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    await waitFor(() => {
      expect(mockTriggerGetAvailableSlots).toHaveBeenCalledWith(
        {
          veterinarianSpecialty: 'Surgery',
          date: '2026-04-16',
          time: '10:30',
          clinicId: 'clinic-1',
        },
        true
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '5'
      );
    });

    expect(screen.getByTestId('appointment-list-show')).toHaveTextContent(
      'true'
    );
    expect(screen.getByTestId('appointment-list-names')).toHaveTextContent(
      'Dr One|Dr Two|Dr Three|Dr Four|Dr Five'
    );
    expect(screen.getByTestId('appointment-list-addresses')).toHaveTextContent(
      'Address A|Address B|Address C|Address D|'
    );
    expect(screen.getByTestId('appointment-list-clinic-ids')).toHaveTextContent(
      'clinic-1|clinic-2|clinic-3|resolved-address-d|resolved-empty-address'
    );
    expect(mockResolveClinicIdByAddress).toHaveBeenCalledWith('Address D');
    expect(mockResolveClinicIdByAddress).toHaveBeenCalledWith('');
  });

  it('omits empty optional fields when building request payload', async () => {
    mockState.searchPayload = {
      specialty: 'Dermatology',
      date: ' ',
      time: '',
      location: '  ',
    };

    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => ({ slots: [] }),
    });

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    await waitFor(() => {
      expect(mockTriggerGetAvailableSlots).toHaveBeenCalledWith(
        { veterinarianSpecialty: 'Dermatology' },
        true
      );
    });
  });

  it('keeps loading state visible for minimum duration', async () => {
    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => ({ slots: [] }),
    });

    renderWithProviders(<BookAppointmentPage />);

    const startedAt = Date.now();

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
      'true'
    );

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
        'false'
      );
      expect(Date.now() - startedAt).toBeGreaterThanOrEqual(390);
    });
  });

  it('handles request failure by clearing appointments and stopping loader', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => {
        throw new Error('fetch failed');
      },
    });

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '0'
      );
      expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
        'false'
      );
    });
  });

  it('removes only the booked slot from appointments list', async () => {
    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => ({
        slots: [
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr One',
            veterinarianId: 'vet-1',
            date: '2026-04-16',
            time: '10:30',
            clinicAddress: 'Address A',
            clinicId: 'clinic-1',
          },
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr Two',
            veterinarianId: 'vet-2',
            date: '2026-04-17',
            time: '11:00',
            clinicAddress: 'Address B',
            clinicId: 'clinic-2',
          },
        ],
      }),
    });

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '2'
      );
    });

    fireEvent.click(screen.getByTestId('appointment-list-booked'));

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '1'
      );
      expect(screen.getByTestId('appointment-list-names')).toHaveTextContent(
        'Dr Two'
      );
    });
  });

  it('resets filters, appointments and show state and calls provided reset callback', async () => {
    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    mockTriggerGetAvailableSlots.mockReturnValue({
      unwrap: async () => ({
        slots: [
          {
            veterinarianSpecialty: 'Surgery',
            veterinarianName: 'Dr One',
            veterinarianId: 'vet-1',
            date: '2026-04-16',
            time: '10:30',
            clinicAddress: 'Address A',
            clinicId: 'clinic-1',
          },
        ],
      }),
    });

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('available-slots-search-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('appointment-list-show')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '1'
      );
    });

    fireEvent.click(screen.getByTestId('appointment-list-reset'));

    await waitFor(() => {
      expect(mockFormReset).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('appointment-list-show')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '0'
      );
      expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
        'false'
      );
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('Filters reset');
  });

  it('resets safely when no reset callback was registered', async () => {
    mockState.registerReset = false;

    renderWithProviders(<BookAppointmentPage />);

    fireEvent.click(screen.getByTestId('appointment-list-reset'));

    await waitFor(() => {
      expect(mockFormReset).not.toHaveBeenCalled();
      expect(screen.getByTestId('appointment-list-show')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('appointment-list-count')).toHaveTextContent(
        '0'
      );
      expect(screen.getByTestId('appointment-list-loading')).toHaveTextContent(
        'false'
      );
    });
  });
});
