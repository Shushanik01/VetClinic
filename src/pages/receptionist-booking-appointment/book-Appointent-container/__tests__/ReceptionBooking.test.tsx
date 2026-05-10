import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReceptionBooking from '../book-appointment';

const { mockQueryResult, mockCancelMutation, mockRescheduleMutation, mockNotify } =
  vi.hoisted(() => ({
    mockQueryResult: {
      data: undefined as { appointments: ReturnType<typeof makeAppt>[] } | undefined,
    },
    mockCancelMutation: vi.fn(),
    mockRescheduleMutation: vi.fn(),
    mockNotify: vi.fn(),
  }));

vi.mock('~/store/api/appointments/appointment-api', () => ({
  useGetShceduledAppointmentsQuery: () => mockQueryResult,
  useCancelAppointmentMutation: () => [mockCancelMutation],
  useRescheduleAppointmentMutation: () => [mockRescheduleMutation],
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: mockNotify,
}));

vi.mock('../../table/table', () => ({
  default: ({
    data,
    onDeleteClick,
    onEditClick,
    setComponentType,
    onFilteredCountChange,
  }: {
    data: { id: number; clientName: string; status: string }[];
    onDeleteClick: (id: number) => void;
    onEditClick: (id: number) => void;
    setComponentType: (t: 'Cancel' | 'Reschedule') => void;
    onFilteredCountChange?: (n: number) => void;
  }) => {
    onFilteredCountChange?.(data.length);
    return (
      <div data-testid="table">
        {data.map((row) => (
          <div key={row.id}>
            <span>{row.clientName}</span>
            {row.status === 'Scheduled' && (
              <>
                <button
                  onClick={() => { onEditClick(row.id); setComponentType('Reschedule'); }}
                >
                  Edit
                </button>
                <button
                  onClick={() => { onDeleteClick(row.id); setComponentType('Cancel'); }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock('../../popUp/Popup', () => ({
  default: ({
    onClose,
    onConfirm,
    componentType,
    onReschedule,
    onCreateAppointment,
  }: {
    onClose: () => void;
    onConfirm?: () => void;
    componentType: string;
    onReschedule?: (date: string, time: string) => void;
    onCreateAppointment?: (appt: { id: number; appointmentId: string; veterinarianId: string; clientName: string; petName: string; petAge: string; vetName: string; address: string; specialty: string; date: string; status: string }) => void;
  }) => (
    <div data-testid="popup">
      <span data-testid="popup-type">{componentType}</span>
      <button onClick={onClose}>Close</button>
      {onConfirm && <button onClick={onConfirm}>Confirm</button>}
      {onReschedule && (
        <button onClick={() => onReschedule('2026-06-01', '10:00')}>Reschedule</button>
      )}
      {onCreateAppointment && (
        <button
          onClick={() =>
            onCreateAppointment({
              id: Date.now(),
              appointmentId: 'new-appt',
              veterinarianId: 'vet-1',
              clientName: 'New Client',
              petName: 'Cat',
              petAge: '1 year',
              vetName: 'Dr. New',
              address: '1 New St',
              specialty: 'General',
              date: '2026-06-01T10:00:00Z',
              status: 'Scheduled',
            })
          }
        >
          Create
        </button>
      )}
    </div>
  ),
}));

vi.mock('../book-appointment.module.css', () => ({ default: {} }));

const TODAY = new Date();
const todayStr = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`;

const makeAppt = (overrides = {}) => ({
  appointmentId: 'appt-1',
  veterinarianId: 'vet-1',
  status: 'Scheduled',
  dateTimeStart: `${todayStr}T10:00:00Z`,
  location: '123 Main St',
  veterinarianName: 'Dr. Smith',
  veterinarianSpecialty: 'Surgery',
  petBirthDate: null,
  petName: 'Buddy',
  clientFirstName: 'John',
  clientLastName: 'Doe',
  ...overrides,
});

describe('ReceptionBooking', () => {
  beforeEach(() => {
    mockQueryResult.data = undefined;
    mockCancelMutation.mockResolvedValue({ data: {} });
    mockRescheduleMutation.mockResolvedValue({ data: { message: 'Rescheduled successfully' } });
    mockNotify.mockClear();
  });

  // --- Rendering ---

  it('renders the Appointments heading', () => {
    render(<ReceptionBooking />);
    expect(screen.getByText('Appointments')).toBeInTheDocument();
  });

  it('renders "Create an Appointment" button', () => {
    render(<ReceptionBooking />);
    expect(screen.getByRole('button', { name: 'Create an Appointment' })).toBeInTheDocument();
  });

  it('renders the table', () => {
    render(<ReceptionBooking />);
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('renders booked appointments count from API data', () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    expect(screen.getByText(/1 booked appointments/)).toBeInTheDocument();
  });

  it('renders client name from API data in the table', () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  // --- Create popup ---

  it('opens popup with componentType "Create" when Create an Appointment is clicked', () => {
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Create an Appointment' }));

    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('popup-type').textContent).toBe('Create');
  });

  it('closes popup when Close is clicked', () => {
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Create an Appointment' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
  });

  it('adds new appointment to the table when Create is clicked in popup', () => {
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Create an Appointment' }));
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(screen.getByText('New Client')).toBeInTheDocument();
  });

  // --- Cancel popup ---

  it('opens popup with componentType "Cancel" when Delete is clicked on a row', () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('popup-type').textContent).toBe('Cancel');
  });

  it('calls cancelAppointment and shows success notify on Confirm', async () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockCancelMutation).toHaveBeenCalledWith('appt-1');
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Appointment cancelled', type: 'success' })
      );
    });
  });

  it('shows error notify when cancelAppointment fails', async () => {
    mockCancelMutation.mockResolvedValue({ error: { status: 500 } });
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Cancellation failed', type: 'error' })
      );
    });
  });

  // --- Reschedule popup ---

  it('opens popup with componentType "Reschedule" when Edit is clicked on a row', () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByTestId('popup')).toBeInTheDocument();
    expect(screen.getByTestId('popup-type').textContent).toBe('Reschedule');
  });

  it('calls rescheduleAppointment and shows success notify on Reschedule', async () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reschedule' }));

    await waitFor(() => {
      expect(mockRescheduleMutation).toHaveBeenCalledWith({
        appointmentId: 'appt-1',
        newDateTime: '2026-06-01T10:00:00Z',
      });
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Appointment rescheduled', type: 'success' })
      );
    });
  });

  it('shows error notify when rescheduleAppointment fails', async () => {
    mockRescheduleMutation.mockResolvedValue({ error: { status: 500 } });
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reschedule' }));

    await waitFor(() => {
      expect(mockNotify).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Reschedule failed', type: 'error' })
      );
    });
  });

  it('closes popup after reschedule', async () => {
    mockQueryResult.data = { appointments: [makeAppt()] };
    render(<ReceptionBooking />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reschedule' }));

    await waitFor(() => expect(screen.queryByTestId('popup')).not.toBeInTheDocument());
  });

  // --- Filtered count display ---

  it('displays "0 booked appointments" when table is empty', () => {
    render(<ReceptionBooking />);
    expect(screen.getByText(/0 booked appointments/)).toBeInTheDocument();
  });
});
