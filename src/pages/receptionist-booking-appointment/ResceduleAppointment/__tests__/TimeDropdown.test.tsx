import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimeDropdown from '../TimeDropdown';

vi.mock('~/assets/svg/VectorUp.svg', () => ({ default: 'VectorUp.svg' }));
vi.mock('~/assets/svg/VectorDown.svg', () => ({ default: 'VectorDown.svg' }));
vi.mock('../RescheduleAppointment.module.css', () => ({ default: {} }));

const defaultProps = {
  slots: ['09:00', '10:00', '11:00'],
  value: null,
  onChange: vi.fn(),
  disabled: false,
  placeholder: 'Select a time',
};

describe('TimeDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Rendering ---

  it('renders the placeholder when value is null', () => {
    render(<TimeDropdown {...defaultProps} />);
    expect(screen.getByText('Select a time')).toBeInTheDocument();
  });

  it('renders the selected value when value is set', () => {
    render(<TimeDropdown {...defaultProps} value="10:00" />);
    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('renders the expand icon initially', () => {
    render(<TimeDropdown {...defaultProps} />);
    expect(screen.getByAltText('expand')).toBeInTheDocument();
  });

  // --- Open / close ---

  it('opens dropdown when header is clicked', () => {
    render(<TimeDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a time'));

    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
  });

  it('shows collapse icon when dropdown is open', () => {
    render(<TimeDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a time'));

    expect(screen.getByAltText('collapse')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <TimeDropdown {...defaultProps} />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.click(screen.getByText('Select a time'));
    expect(screen.getByText('09:00')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });

  // --- Slot selection ---

  it('calls onChange with the selected slot', () => {
    const onChange = vi.fn();
    render(<TimeDropdown {...defaultProps} onChange={onChange} />);
    fireEvent.click(screen.getByText('Select a time'));
    fireEvent.click(screen.getByText('10:00'));

    expect(onChange).toHaveBeenCalledWith('10:00');
  });

  it('closes the dropdown after a slot is selected', () => {
    render(<TimeDropdown {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a time'));
    fireEvent.click(screen.getByText('09:00'));

    expect(screen.queryByText('11:00')).not.toBeInTheDocument();
  });

  // --- Disabled state ---

  it('does not open when disabled', () => {
    render(<TimeDropdown {...defaultProps} disabled placeholder="Select a date first" />);
    fireEvent.click(screen.getByText('Select a date first'));

    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });

  it('renders the disabled placeholder text when disabled', () => {
    render(<TimeDropdown {...defaultProps} disabled placeholder="Select a date first" />);
    expect(screen.getByText('Select a date first')).toBeInTheDocument();
  });

  // --- Empty slots ---

  it('shows "No available slots" when slots array is empty', () => {
    render(<TimeDropdown {...defaultProps} slots={[]} />);
    fireEvent.click(screen.getByText('Select a time'));

    expect(screen.getByText('No available slots')).toBeInTheDocument();
  });

  // --- Loading / error placeholders ---

  it('renders "Loading..." placeholder when loading', () => {
    render(<TimeDropdown {...defaultProps} disabled placeholder="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders "Failed to load slots" placeholder on error', () => {
    render(<TimeDropdown {...defaultProps} disabled placeholder="Failed to load slots" />);
    expect(screen.getByText('Failed to load slots')).toBeInTheDocument();
  });
});
