import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { CalendarHeader } from '~/components/forms/date-input/components/calendar-header';

const MARCH_2025 = new Date(2025, 2, 1);

describe('CalendarHeader', () => {
  it('renders the current month and year', () => {
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={vi.fn()}
        canGoPrevious={true}
      />
    );
    expect(screen.getByText('March 2025')).toBeInTheDocument();
  });

  it('calls onMonthChange(-1) when previous button is clicked', () => {
    const onMonthChange = vi.fn();
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={onMonthChange}
        canGoPrevious={true}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /previous month/i }));
    expect(onMonthChange).toHaveBeenCalledWith(-1);
  });

  it('does not call onMonthChange when previous is disabled', () => {
    const onMonthChange = vi.fn();
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={onMonthChange}
        canGoPrevious={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /previous month/i }));
    expect(onMonthChange).not.toHaveBeenCalled();
  });

  it('disables the previous button when canGoPrevious is false', () => {
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={vi.fn()}
        canGoPrevious={false}
      />
    );
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    expect(prevButton).toBeDisabled();
  });

  it('enables the previous button when canGoPrevious is true', () => {
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={vi.fn()}
        canGoPrevious={true}
      />
    );
    const prevButton = screen.getByRole('button', { name: /previous month/i });
    expect(prevButton).not.toBeDisabled();
  });

  it('calls onMonthChange(1) when next button is clicked', () => {
    const onMonthChange = vi.fn();
    render(
      <CalendarHeader
        viewDate={MARCH_2025}
        onMonthChange={onMonthChange}
        canGoPrevious={true}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /next month/i }));
    expect(onMonthChange).toHaveBeenCalledWith(1);
  });
});
