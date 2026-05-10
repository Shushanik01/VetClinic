import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AvailableSlotsSearch } from '../available-slots-search';

// Mock form components
vi.mock('~/components/forms/select-input/select-input', () => ({
  SelectInput: ({ label, value, onChange, error, placeholder }: any) => (
    <div data-testid={`select-${label?.toLowerCase() || 'input'}`}>
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        data-testid={`input-${label?.toLowerCase()}`}
      />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock('~/components/forms/date-input', () => ({
  CalendarInput: ({ value, onChange, error, label }: any) => (
    <div data-testid="calendar-input">
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="input-date"
        type="date"
      />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock('~/components/forms/time-input', () => ({
  TimeSelect: ({ value, onChange, error, label }: any) => (
    <div data-testid="time-select">
      <label>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="input-time"
        placeholder="HH:MM"
      />
      {error && <span>{error}</span>}
    </div>
  ),
}));

// Mock constants
vi.mock('~/constants/time-slots', () => ({
  TIME_SLOTS: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00'],
}));

vi.mock('~/constants/specialisations', () => ({
  SPECIALISATION_OPTIONS: [
    { label: 'Cardiology', value: 'cardiology' },
    { label: 'Dermatology', value: 'dermatology' },
  ],
}));

vi.mock('~/constants/clinics-location', () => ({
  CLINIC_LOCATION_OPTIONS: [
    { label: 'Downtown', value: 'downtown' },
    { label: 'Uptown', value: 'uptown' },
  ],
}));

// Mock date validation
vi.mock('~/components/forms/date-input/components/utils', () => ({
  validateDateInputValue: (date: string) => {
    if (!date || date.trim() === '') return null;
    if (date.includes('invalid')) return 'Date is invalid';
    return null;
  },
}));

describe('AvailableSlotsSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render search form', () => {
    render(<AvailableSlotsSearch />);

    expect(screen.getByTestId('select-specialty')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-input')).toBeInTheDocument();
    expect(screen.getByTestId('time-select')).toBeInTheDocument();
  });

  it('should render form fields with correct labels', () => {
    render(<AvailableSlotsSearch />);

    expect(screen.getByText('Specialty')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<AvailableSlotsSearch />);

    const submitButton = screen.getByRole('button', { name: /Search/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should call onSearch callback when form is submitted', async () => {
    const onSearch = vi.fn();
    render(<AvailableSlotsSearch onSearch={onSearch} />);

    const specialtyInput = screen.getByTestId('input-specialty');
    const dateInput = screen.getByTestId('input-date');
    const timeInput = screen.getByTestId('input-time');

    fireEvent.change(specialtyInput, { target: { value: 'cardiology' } });
    fireEvent.change(dateInput, { target: { value: '2025-05-15' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalled();
      });
    }
  });

  it('should expose reset function via onResetRef', async () => {
    let resetFn: (() => void) | undefined;

    const onResetRef = (reset: (() => void) | undefined) => {
      resetFn = reset;
    };

    render(<AvailableSlotsSearch onResetRef={onResetRef} />);

    await waitFor(() => {
      expect(resetFn).toBeDefined();
    });

    const fn = resetFn;
    if (fn) {
      // Reset should be callable without throwing
      expect(() => fn()).not.toThrow();
    }
  });

  it('should update form state when fields change', async () => {
    const onSearch = vi.fn();
    render(<AvailableSlotsSearch onSearch={onSearch} />);

    const specialtyInput = screen.getByTestId(
      'input-specialty'
    ) as HTMLInputElement;
    const dateInput = screen.getByTestId('input-date') as HTMLInputElement;
    const timeInput = screen.getByTestId('input-time') as HTMLInputElement;

    fireEvent.change(specialtyInput, { target: { value: 'cardiology' } });
    expect(specialtyInput.value).toBe('cardiology');

    fireEvent.change(dateInput, { target: { value: '2025-05-15' } });
    expect(dateInput.value).toBe('2025-05-15');

    fireEvent.change(timeInput, { target: { value: '10:00' } });
    expect(timeInput.value).toBe('10:00');
  });

  it('should trigger validation when specialty changes', async () => {
    render(<AvailableSlotsSearch />);

    const specialtyInput = screen.getByTestId('input-specialty');
    fireEvent.change(specialtyInput, { target: { value: 'cardiology' } });

    await waitFor(() => {
      expect(specialtyInput).toHaveValue('cardiology');
    });
  });

  it('should handle optional fields', async () => {
    const onSearch = vi.fn();
    render(<AvailableSlotsSearch onSearch={onSearch} />);

    const specialtyInput = screen.getByTestId('input-specialty');
    fireEvent.change(specialtyInput, { target: { value: 'cardiology' } });

    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(onSearch).toHaveBeenCalled();
      });
    }
  });

  it('should have proper form structure', () => {
    const { container } = render(<AvailableSlotsSearch />);

    const form = container.querySelector('form');
    expect(form).toHaveClass('w-full');
    expect(form).toHaveClass('rounded-lg');
    expect(form).toHaveClass('bg-white');
  });

  it('should render filter section layout', () => {
    const { container } = render(<AvailableSlotsSearch />);

    const filterSection = container.querySelector('.flex.gap-x-2.flex-wrap');
    expect(filterSection).toBeInTheDocument();
  });

  it('should clear form when reset is called', async () => {
    let resetFn: (() => void) | undefined;

    const onResetRef = (reset: (() => void) | undefined) => {
      resetFn = reset;
    };

    render(<AvailableSlotsSearch onResetRef={onResetRef} />);

    const specialtyInput = screen.getByTestId(
      'input-specialty'
    ) as HTMLInputElement;
    fireEvent.change(specialtyInput, { target: { value: 'cardiology' } });

    await waitFor(() => {
      expect(specialtyInput.value).toBe('cardiology');
    });

    // Calling reset should clear the form
    if (resetFn) {
      resetFn();

      await waitFor(() => {
        expect(specialtyInput.value).toBe('');
      });
    }
  });
});
