import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientAppointments } from '../ClientAppoint';


const { mockNavigate, mockQueryResult, mockCancelMutation, mockRescheduleMutation } =
  vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockQueryResult: {
      data: undefined as
        | { appointments: ReturnType<typeof makeAppointment>[] }
        | undefined,
      isLoading: false,
      isError: false,
    },
    mockCancelMutation: vi.fn().mockResolvedValue({}),
    mockRescheduleMutation: vi.fn().mockResolvedValue({ data: { message: 'Rescheduled' } }),
  }));


vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
      <a href={to} className={className}>{children}</a>
    ),
  };
});

vi.mock('~/store/api/appointments/appointment-api', () => ({
  useGetShceduledAppointmentsQuery: () => mockQueryResult,
  useCancelAppointmentMutation: () => [mockCancelMutation],
  useRescheduleAppointmentMutation: () => [mockRescheduleMutation],
}));

vi.mock('~/app/providers/notifications/notifications', () => ({
  notify: vi.fn(),
}));

vi.mock('../../feedback/feedback', () => ({
  Feedback: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="feedback-modal">
      <button onClick={onClose}>Close Feedback</button>
    </div>
  ),
}));

vi.mock(
  '../../receptionist-booking-appointment/CancelAppointment/CancelAppointmant',
  () => ({
    default: ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => (
      <div data-testid="cancel-modal">
        <button onClick={onClose}>Close Cancel</button>
        <button onClick={onConfirm}>Confirm Cancel</button>
      </div>
    ),
  })
);

vi.mock(
  '../../receptionist-booking-appointment/ResceduleAppointment/RescheduleAppointment',
  () => ({
    default: ({ onClose }: { onClose: () => void }) => (
      <div data-testid="reschedule-modal">
        <button onClick={onClose}>Close Reschedule</button>
      </div>
    ),
  })
);

// SVG imports
vi.mock('~/assets/svg/date.svg', () => ({ default: 'date.svg' }));
vi.mock('~/assets/svg/Time.svg', () => ({ default: 'time.svg' }));
vi.mock('~/assets/svg/adress.svg', () => ({ default: 'address.svg' }));
vi.mock('~/assets/svg/doctoricon.svg', () => ({ default: 'doctoricon.svg' }));
vi.mock('~/assets/svg/Icon.svg', () => ({ default: 'icon.svg' }));
vi.mock('~/assets/svg/comment.svg', () => ({ default: 'comment.svg' }));
vi.mock('./appointment.module.css', () => ({ default: {} }));
vi.mock('../appointment.module.css', () => ({ default: {} }));


const makeAppointment = (overrides: Record<string, unknown> = {}) => ({
  appointmentId: 'appt-1',
  veterinarianId: 'vet-1',
  status: 'Scheduled',
  dateTimeStart: '2025-06-15T10:00:00Z',
  location: '123 Main St',
  veterinarianName: 'Dr. Smith',
  veterinarianSpecialty: 'Surgery',
  veterinarianRecommendations: 'Rest for 2 days',
  petBirthDate: null,
  petName: 'Buddy',
  clientFirstName: 'John',
  clientLastName: 'Doe',
  feedbackId: undefined,
  feedback: undefined,
  ...overrides,
});


describe('ClientAppointments', () => {
  beforeEach(() => {
    mockQueryResult.data = undefined;
    mockQueryResult.isLoading = false;
    mockQueryResult.isError = false;
    mockNavigate.mockClear();
  });


  it('shows loading message while data is being fetched', () => {
    mockQueryResult.isLoading = true;

    render(<ClientAppointments />);

    expect(screen.getByText('Loading appointments...')).toBeInTheDocument();
  });

  it('shows error message when the query fails', () => {
    mockQueryResult.isError = true;

    render(<ClientAppointments />);

    expect(
      screen.getByText('Failed to load appointments. Please try again later.')
    ).toBeInTheDocument();
  });

  it('renders the page title in all states', () => {
    render(<ClientAppointments />);

    expect(screen.getByText('My Appointments')).toBeInTheDocument();
  });


  it('renders no appointment cards when appointments list is empty', () => {
    mockQueryResult.data = { appointments: [] };

    render(<ClientAppointments />);

    expect(screen.queryByText('Scheduled')).not.toBeInTheDocument();
  });


  it('renders appointment date, time, address, doctor and specialty', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Surgery')).toBeInTheDocument();
  });

  it('renders the status badge with correct text', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);

    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  it('renders doctor name as a link to veterinarian profile', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);

    const link = screen.getByRole('link', { name: 'Dr. Smith' });
    expect(link).toHaveAttribute('href', '/veterinarian/vet-1');
  });


  it('shows Cancel and Reschedule buttons for Scheduled appointments', () => {
    mockQueryResult.data = { appointments: [makeAppointment({ status: 'Scheduled' })] };

    render(<ClientAppointments />);

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reschedule' })).toBeInTheDocument();
  });

  it('shows Leave Feedback button for Service provided appointments without feedback', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Service provided', feedbackId: undefined })],
    };

    render(<ClientAppointments />);

    expect(screen.getByRole('button', { name: 'Leave Feedback' })).toBeInTheDocument();
  });

  it('shows Update Feedback button for Finished appointments', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Finished', feedbackId: 'fb-1' })],
    };

    render(<ClientAppointments />);

    expect(screen.getByRole('button', { name: 'Update Feedback' })).toBeInTheDocument();
  });

  it('shows Update Feedback button for Service provided appointments that already have feedback', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Service provided', feedbackId: 'fb-1' })],
    };

    render(<ClientAppointments />);

    expect(screen.getByRole('button', { name: 'Update Feedback' })).toBeInTheDocument();
  });

  it('shows vet recommendations for Service provided appointments', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Service provided', feedbackId: undefined })],
    };

    render(<ClientAppointments />);

    expect(screen.getByText('Rest for 2 days')).toBeInTheDocument();
  });


  it('opens cancel modal when Cancel button is clicked', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByTestId('cancel-modal')).toBeInTheDocument();
  });

  it('closes cancel modal when close button inside it is clicked', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close Cancel' }));

    expect(screen.queryByTestId('cancel-modal')).not.toBeInTheDocument();
  });

  it('opens reschedule modal when Reschedule button is clicked', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Reschedule' }));

    expect(screen.getByTestId('reschedule-modal')).toBeInTheDocument();
  });

  it('closes reschedule modal when close button inside it is clicked', () => {
    mockQueryResult.data = { appointments: [makeAppointment()] };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Reschedule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close Reschedule' }));

    expect(screen.queryByTestId('reschedule-modal')).not.toBeInTheDocument();
  });

  it('opens feedback modal when Leave Feedback button is clicked', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Service provided', feedbackId: undefined })],
    };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Leave Feedback' }));

    expect(screen.getByTestId('feedback-modal')).toBeInTheDocument();
  });

  it('closes feedback modal when close button inside it is clicked', () => {
    mockQueryResult.data = {
      appointments: [makeAppointment({ status: 'Service provided', feedbackId: undefined })],
    };

    render(<ClientAppointments />);
    fireEvent.click(screen.getByRole('button', { name: 'Leave Feedback' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close Feedback' }));

    expect(screen.queryByTestId('feedback-modal')).not.toBeInTheDocument();
  });


  it('navigates to book appointment page when Book Appointment is clicked', () => {
    render(<ClientAppointments />);

    fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));

    expect(mockNavigate).toHaveBeenCalledWith('/book-appointment');
  });


  it('renders multiple appointment cards', () => {
    mockQueryResult.data = {
      appointments: [
        makeAppointment({ appointmentId: 'appt-1', veterinarianName: 'Dr. Smith' }),
        makeAppointment({ appointmentId: 'appt-2', veterinarianName: 'Dr. Jones' }),
      ],
    };

    render(<ClientAppointments />);

    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jones')).toBeInTheDocument();
  });
});
