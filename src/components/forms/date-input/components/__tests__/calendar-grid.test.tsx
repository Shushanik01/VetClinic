import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '~/__tests__';
import { CalendarGrid } from '~/components/forms/date-input/components/calendar-grid';
import { buildCalendarDays } from '~/components/forms/date-input/components/utils';

const MARCH_2025_DAYS = buildCalendarDays(new Date(2025, 2, 1));

describe('CalendarGrid', () => {
  it('renders day-of-week headers (M, T, W, T, F, S, S)', () => {
    render(
      <CalendarGrid
        calendarDays={MARCH_2025_DAYS}
        selectedDate={null}
        onDaySelect={vi.fn()}
        allowPastDates={true}
        allowFutureDates={true}
      />
    );

    // DAYS constant starts Mon-Sun. First char of each is rendered.
    // We check at least M and S exist
    const headers = screen.getAllByText(/^[MTWFS]$/);
    expect(headers.length).toBeGreaterThanOrEqual(7);
  });

  it('renders 42 day buttons', () => {
    render(
      <CalendarGrid
        calendarDays={MARCH_2025_DAYS}
        selectedDate={null}
        onDaySelect={vi.fn()}
        allowPastDates={true}
        allowFutureDates={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(42);
  });

  it('calls onDaySelect when a day button is clicked', () => {
    const onDaySelect = vi.fn();
    render(
      <CalendarGrid
        calendarDays={MARCH_2025_DAYS}
        selectedDate={null}
        onDaySelect={onDaySelect}
        allowPastDates={true}
        allowFutureDates={true}
      />
    );

    const targetButton = screen
      .getAllByRole('button')
      .find((btn) => !btn.hasAttribute('disabled'));
    expect(targetButton).toBeDefined();
    fireEvent.click(targetButton!);
    expect(onDaySelect).toHaveBeenCalledTimes(1);
  });

  it('disables days outside the current month', () => {
    render(
      <CalendarGrid
        calendarDays={MARCH_2025_DAYS}
        selectedDate={null}
        onDaySelect={vi.fn()}
        allowPastDates={true}
        allowFutureDates={true}
      />
    );

    const disabled = screen
      .getAllByRole('button')
      .filter((btn) => btn.hasAttribute('disabled'));
    // March 2025 has some padding days from Feb and April
    expect(disabled.length).toBeGreaterThan(0);
  });

  it('marks the selected date as selected', () => {
    const selectedDate = new Date(2025, 2, 15); // March 15, 2025
    render(
      <CalendarGrid
        calendarDays={MARCH_2025_DAYS}
        selectedDate={selectedDate}
        onDaySelect={vi.fn()}
        allowPastDates={true}
        allowFutureDates={true}
      />
    );

    // Find the button with text "15" that is not disabled (in-month)
    const buttons = screen.getAllByRole('button');
    const march15 = buttons.find(
      (btn) => btn.textContent === '15' && !btn.hasAttribute('disabled')
    );
    expect(march15).toBeDefined();
    expect(march15?.className).toContain('bg-green-400');
  });

  it('disables past dates when allowPastDates is false', () => {
    // Use a far past month — everything should be disabled for non-past restriction
    const jan2000Days = buildCalendarDays(new Date(2000, 0, 1));
    render(
      <CalendarGrid
        calendarDays={jan2000Days}
        selectedDate={null}
        onDaySelect={vi.fn()}
        allowPastDates={false}
        allowFutureDates={true}
      />
    );

    const buttons = screen.getAllByRole('button');
    const enabledInMonth = buttons.filter(
      (btn) => !btn.hasAttribute('disabled')
    );
    // All in-month days of Jan 2000 are past → all disabled
    expect(enabledInMonth).toHaveLength(0);
  });
});
