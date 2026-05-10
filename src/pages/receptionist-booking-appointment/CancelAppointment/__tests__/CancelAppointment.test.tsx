import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CancelAppointment from '../CancelAppointmant';

vi.mock('~/assets/svg/VectorUp.svg', () => ({ default: 'VectorUp.svg' }));
vi.mock('~/assets/svg/VectorDown.svg', () => ({ default: 'VectorDown.svg' }));
vi.mock('../CancelAppointment.module.css', () => ({ default: {} }));
vi.mock('../../globalAppointment.module.css', () => ({ default: {} }));

const defaultProps = {
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

describe('CancelAppointment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Rendering ---

  it('renders the Reason label', () => {
    render(<CancelAppointment {...defaultProps} />);
    expect(screen.getByText('Reason')).toBeInTheDocument();
  });

  it('renders "Select Reason" placeholder initially', () => {
    render(<CancelAppointment {...defaultProps} />);
    expect(screen.getByText('Select Reason')).toBeInTheDocument();
  });

  it('renders Cancel and Cancel Appointment buttons', () => {
    render(<CancelAppointment {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel Appointment' })).toBeInTheDocument();
  });

  it('renders Cancel Appointment button as disabled when no reason selected', () => {
    render(<CancelAppointment {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Cancel Appointment' })).toBeDisabled();
  });

  it('renders down arrow icon initially', () => {
    render(<CancelAppointment {...defaultProps} />);
    expect(screen.getByAltText('Down Arrow')).toBeInTheDocument();
  });

  // --- Dropdown open/close ---

  it('opens the dropdown when the select header is clicked', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));

    expect(screen.getByText('Scheduling conflict')).toBeInTheDocument();
  });

  it('shows all 5 reason options when dropdown is open', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));

    expect(screen.getByText('Scheduling conflict')).toBeInTheDocument();
    expect(screen.getByText('No longer needs appointment')).toBeInTheDocument();
    expect(screen.getByText('Veterinarian unavailable')).toBeInTheDocument();
    expect(screen.getByText('Overbooking error')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('shows up arrow icon when dropdown is open', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));

    expect(screen.getByAltText('Up Arrow')).toBeInTheDocument();
  });

  it('closes the dropdown after selecting a reason', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Scheduling conflict'));

    expect(screen.queryByText('No longer needs appointment')).not.toBeInTheDocument();
  });

  it('closes the dropdown when clicking outside', () => {
    render(
      <div>
        <CancelAppointment {...defaultProps} />
        <div data-testid="outside">outside</div>
      </div>
    );
    fireEvent.click(screen.getByText('Select Reason'));
    expect(screen.getByText('Scheduling conflict')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Scheduling conflict')).not.toBeInTheDocument();
  });

  // --- Reason selection ---

  it('displays the selected reason in the header after selection', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Scheduling conflict'));

    expect(screen.getByText('Scheduling conflict')).toBeInTheDocument();
  });

  it('enables Cancel Appointment button after a reason is selected', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Overbooking error'));

    expect(screen.getByRole('button', { name: 'Cancel Appointment' })).not.toBeDisabled();
  });

  // --- "Other" reason ---

  it('shows Comments input when "Other" is selected', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Other'));

    expect(screen.getByPlaceholderText('Add Comments')).toBeInTheDocument();
  });

  it('does not show Comments input when a non-Other reason is selected', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Scheduling conflict'));

    expect(screen.queryByPlaceholderText('Add Comments')).not.toBeInTheDocument();
  });

  it('shows Comments label when "Other" is selected', () => {
    render(<CancelAppointment {...defaultProps} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Other'));

    expect(screen.getByText('Comments')).toBeInTheDocument();
  });

  // --- Button callbacks ---

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<CancelAppointment onClose={onClose} onConfirm={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onConfirm when Cancel Appointment button is clicked after selecting a reason', () => {
    const onConfirm = vi.fn();
    render(<CancelAppointment onClose={vi.fn()} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('Select Reason'));
    fireEvent.click(screen.getByText('Veterinarian unavailable'));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel Appointment' }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
