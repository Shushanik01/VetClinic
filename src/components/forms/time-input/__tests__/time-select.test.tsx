import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '~/__tests__';
import { TimeSelect } from '~/components/forms/time-input/time-select';

describe('TimeSelect', () => {
  it('renders with default label "Time"', () => {
    render(<TimeSelect />);
    expect(screen.getByText('Time')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<TimeSelect label="Select Time" />);
    expect(screen.getByText('Select Time')).toBeInTheDocument();
  });

  it('renders placeholder when no value is selected', () => {
    render(<TimeSelect placeholder="HH:MM" />);
    expect(screen.getByPlaceholderText('HH:MM')).toBeInTheDocument();
  });

  it('shows selected value in input', () => {
    render(<TimeSelect value="10:30" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('10:30');
  });

  it('opens dropdown when input is clicked', () => {
    render(<TimeSelect timeSlots={['09:00', '10:00', '11:00']} />);
    const input = screen.getByRole('textbox');

    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
    fireEvent.click(input);
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
  });

  it('opens dropdown when toggle button is clicked', () => {
    render(<TimeSelect timeSlots={['09:00', '10:00']} />);
    const toggleButton = screen.getByRole('button', {
      name: /toggle time options/i,
    });
    fireEvent.click(toggleButton);
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('calls onChange when a time slot is selected', () => {
    const onChange = vi.fn();
    render(<TimeSelect timeSlots={['09:00', '10:00']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('09:00'));
    expect(onChange).toHaveBeenCalledWith('09:00');
  });

  it('closes dropdown after selecting a slot', () => {
    render(<TimeSelect timeSlots={['09:00', '10:00']} />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('09:00')).toBeInTheDocument();

    fireEvent.click(screen.getByText('09:00'));
    expect(screen.queryByText('10:00')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    render(<TimeSelect timeSlots={['09:00']} disabled />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });

  it('does not open when requireDate is true and no selectedDate is set', () => {
    render(<TimeSelect timeSlots={['09:00']} requireDate />);

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });

  it('opens when requireDate is true and selectedDate is provided', () => {
    render(
      <TimeSelect timeSlots={['09:00']} requireDate selectedDate="2030-01-01" />
    );

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<TimeSelect error="Time is required" />);
    expect(screen.getByText('Time is required')).toBeInTheDocument();
  });

  it('shows clear button when clearable and value is set', () => {
    render(<TimeSelect value="09:00" clearable onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /clear time/i })
    ).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<TimeSelect clearable />);
    expect(
      screen.queryByRole('button', { name: /clear time/i })
    ).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button clicked', () => {
    const onChange = vi.fn();
    render(<TimeSelect value="09:00" clearable onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /clear time/i }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('generates slots from intervalMinutes', () => {
    render(<TimeSelect intervalMinutes={60} startHour={9} endHour={11} />);
    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('11:00')).toBeInTheDocument();
  });

  it('marks selected slot with selected class', () => {
    render(<TimeSelect timeSlots={['09:00', '10:00']} value="10:00" />);
    fireEvent.click(screen.getByRole('textbox'));

    const selectedButton = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent === '10:00');
    expect(selectedButton).toHaveClass('select-item-selected');
  });

  it('closes dropdown when clicking outside', () => {
    render(
      <div>
        <TimeSelect timeSlots={['09:00']} />
        <div data-testid="outside">outside</div>
      </div>
    );

    fireEvent.click(screen.getByRole('textbox'));
    expect(screen.getByText('09:00')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('09:00')).not.toBeInTheDocument();
  });

  it('disables past times when allowPastTimes is false and today is selected', () => {
    const today = new Date().toISOString().slice(0, 10);
    // Use slots that are clearly in the past (00:00)
    render(
      <TimeSelect
        timeSlots={['00:00', '00:01']}
        selectedDate={today}
        allowPastTimes={false}
      />
    );

    fireEvent.click(screen.getByRole('textbox'));

    const slots = screen
      .getAllByRole('button')
      .filter((btn) => ['00:00', '00:01'].includes(btn.textContent ?? ''));
    slots.forEach((slot) => {
      expect(slot).toBeDisabled();
    });
  });

  it('disables future times when allowFutureTimes is false and today is selected', () => {
    const today = new Date().toISOString().slice(0, 10);
    // Use slots that are clearly in the future (23:50)
    render(
      <TimeSelect
        timeSlots={['23:50', '23:59']}
        selectedDate={today}
        allowFutureTimes={false}
      />
    );

    fireEvent.click(screen.getByRole('textbox'));

    const slots = screen
      .getAllByRole('button')
      .filter((btn) => ['23:50', '23:59'].includes(btn.textContent ?? ''));
    slots.forEach((slot) => {
      expect(slot).toBeDisabled();
    });
  });
});
