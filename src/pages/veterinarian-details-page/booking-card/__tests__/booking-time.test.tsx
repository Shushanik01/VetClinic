import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BookingTime from '../booking-time';

// --- hoisted mocks (must come before vi.mock calls) ---
const { mockedAuthState, mockQueryResult } = vi.hoisted(() => ({
  mockedAuthState: { isAuthenticated: false },
  mockQueryResult: {
    data: undefined as { slots: string[] } | undefined,
    currentData: undefined as { slots: string[] } | undefined,
    isFetching: false,
    refetch: vi.fn(),
  },
}));

vi.mock('react-redux', () => ({
  useSelector: (selector: (state: { auth: typeof mockedAuthState }) => unknown) =>
    selector({ auth: mockedAuthState }),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('~/store/api/vets/vets-api', () => ({
  useGetVeterinarianAvailableSlotsQuery: () => mockQueryResult,
}));

vi.mock('~/components/forms/date-input', () => ({
  CalendarInput: ({ onChange }: { onChange: (v: string) => void }) => (
    <input
      data-testid="calendar-input"
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock('~/components/forms/date-input/components/utils', () => ({
  parseDateValue: (v: string) => (v ? new Date(v) : null),
  validateDateInputValue: () => null,
}));

vi.mock('~/components/forms/radio-input', () => ({
  RadioInput: ({
    options,
    onChange,
  }: {
    options: { label: string; value: string }[];
    onChange: (v: string) => void;
  }) => (
    <div data-testid="radio-input">
      {options.map((opt) => (
        <button key={opt.value} onClick={() => onChange(opt.value)}>
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('~/components/pop-up-window/login-required-popup', () => ({
  LoginRequiredPopup: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="login-popup">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('~/components/book-appointment-form/book-appointment-popup', () => ({
  BookAppointmentPopup: () => <div data-testid="booking-popup" />,
}));

// --- shared props ---
const baseProps = {
  veterinarianId: 'v1',
  veterinarianName: 'Dr. Jane Smith',
  veterinarianSpecialty: 'Surgery',
  clinicAddress: '123 Vet Lane',
  clinicId: 'c1',
  selectedDate: null as Date | null,
  selectedTime: null as string | null,
  onDateSelect: vi.fn(),
  onTimeSelect: vi.fn(),
};

describe('BookingTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockedAuthState.isAuthenticated = false;
    mockQueryResult.data = undefined;
    mockQueryResult.currentData = undefined;
    mockQueryResult.isFetching = false;
    baseProps.onDateSelect = vi.fn();
    baseProps.onTimeSelect = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows prompt to select a date when no date is selected', () => {
    render(<BookingTime {...baseProps} />);
    expect(
      screen.getByText('Select a date to view available slots.')
    ).toBeInTheDocument();
  });

  it('Book Appointment button is disabled when no date and time are selected', () => {
    render(<BookingTime {...baseProps} />);
    expect(
      screen.getByRole('button', { name: /book appointment/i })
    ).toBeDisabled();
  });

  it('Book Appointment button is disabled when date is selected but no time', () => {
    render(<BookingTime {...baseProps} selectedDate={new Date('2025-06-15')} />);
    expect(
      screen.getByRole('button', { name: /book appointment/i })
    ).toBeDisabled();
  });

  it('shows loading state when fetching slots', () => {
    mockQueryResult.isFetching = true;
    render(<BookingTime {...baseProps} selectedDate={new Date('2025-06-15')} />);
    expect(screen.getByText('Loading available slots...')).toBeInTheDocument();
  });

  it('shows "No available slots" when slots array is empty for selected date', () => {
    mockQueryResult.currentData = { slots: [] };
    render(<BookingTime {...baseProps} selectedDate={new Date('2025-06-15')} />);
    // advance past the 500ms minimum loading delay
    act(() => { vi.advanceTimersByTime(600); });
    expect(
      screen.getByText('No available slots for this date.')
    ).toBeInTheDocument();
  });

  it('shows "Search other appointments" link when no slots available', () => {
    mockQueryResult.currentData = { slots: [] };
    render(<BookingTime {...baseProps} selectedDate={new Date('2025-06-15')} />);
    act(() => { vi.advanceTimersByTime(600); });
    expect(
      screen.getByRole('link', { name: /search other appointments/i })
    ).toBeInTheDocument();
  });

  it('renders slot options when slots are available', () => {
    mockQueryResult.currentData = { slots: ['09:00', '10:00'] };
    render(<BookingTime {...baseProps} selectedDate={new Date('2025-06-15')} />);
    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.getByTestId('radio-input')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('shows login popup when unauthenticated user clicks Book Appointment', () => {
    mockedAuthState.isAuthenticated = false;
    mockQueryResult.currentData = { slots: ['09:00'] };
    render(
      <BookingTime
        {...baseProps}
        selectedDate={new Date('2025-06-15')}
        selectedTime="09:00"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
    expect(screen.getByTestId('login-popup')).toBeInTheDocument();
  });

  it('shows booking popup when authenticated user clicks Book Appointment', () => {
    mockedAuthState.isAuthenticated = true;
    mockQueryResult.currentData = { slots: ['09:00'] };
    render(
      <BookingTime
        {...baseProps}
        selectedDate={new Date('2025-06-15')}
        selectedTime="09:00"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
    expect(screen.getByTestId('booking-popup')).toBeInTheDocument();
  });

  it('closes login popup when onClose is called', () => {
    mockedAuthState.isAuthenticated = false;
    mockQueryResult.currentData = { slots: ['09:00'] };
    render(
      <BookingTime
        {...baseProps}
        selectedDate={new Date('2025-06-15')}
        selectedTime="09:00"
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
    expect(screen.getByTestId('login-popup')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('login-popup')).not.toBeInTheDocument();
  });

  it('hides calendar when showCalendar is false', () => {
    render(<BookingTime {...baseProps} showCalendar={false} />);
    expect(screen.queryByTestId('calendar-input')).not.toBeInTheDocument();
  });

  it('hides slots section when showSlots is false', () => {
    render(<BookingTime {...baseProps} showSlots={false} />);
    expect(
      screen.queryByRole('button', { name: /book appointment/i })
    ).not.toBeInTheDocument();
  });
});
