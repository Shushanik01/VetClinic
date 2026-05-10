import { describe, expect, it } from 'vitest';
import {
  parseDateValue,
  validateDateInputValue,
  formatDisplayValue,
  formatMonthYear,
  buildCalendarDays,
  parseDateRangeValue,
  formatDateRangeValue,
  toStartOfDay,
  getInitialViewDate,
} from '~/components/forms/date-input/components/utils';

describe('toStartOfDay', () => {
  it('returns a date at midnight', () => {
    const date = new Date(2025, 5, 15, 10, 30, 0);
    const result = toStartOfDay(date);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });
});

describe('parseDateValue', () => {
  it('returns null for empty string', () => {
    expect(parseDateValue('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(parseDateValue()).toBeNull();
  });

  it('parses a valid ISO date string', () => {
    const result = parseDateValue('2025-03-15');
    expect(result).not.toBeNull();
    expect(result!.getFullYear()).toBe(2025);
    expect(result!.getMonth()).toBe(2); // 0-indexed
    expect(result!.getDate()).toBe(15);
  });

  it('returns null for non-ISO format', () => {
    expect(parseDateValue('15/03/2025')).toBeNull();
    expect(parseDateValue('March 15, 2025')).toBeNull();
  });

  it('returns null for invalid month', () => {
    expect(parseDateValue('2025-13-01')).toBeNull();
    expect(parseDateValue('2025-00-01')).toBeNull();
  });

  it('returns null for invalid day', () => {
    expect(parseDateValue('2025-01-00')).toBeNull();
    expect(parseDateValue('2025-01-32')).toBeNull();
  });

  it('returns null for logically invalid date like Feb 30', () => {
    expect(parseDateValue('2025-02-30')).toBeNull();
  });
});

describe('validateDateInputValue', () => {
  it('returns null for empty string when not required', () => {
    expect(validateDateInputValue('')).toBeNull();
  });

  it('returns error for empty string when required', () => {
    expect(validateDateInputValue('', { required: true })).toBe(
      'Date is required'
    );
  });

  it('returns "Invalid date" for non-parseable value', () => {
    expect(validateDateInputValue('not-a-date')).toBe('Invalid date');
  });

  it('returns null for valid date with default options', () => {
    // Default: allowPastDates = false, allowFutureDates = true
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const value = formatDisplayValue(futureDate);
    expect(validateDateInputValue(value)).toBeNull();
  });

  it('returns error when past date is not allowed', () => {
    expect(
      validateDateInputValue('2000-01-01', { allowPastDates: false })
    ).toBe('Date cannot be in the past');
  });

  it('returns null when past date is allowed', () => {
    expect(
      validateDateInputValue('2000-01-01', { allowPastDates: true })
    ).toBeNull();
  });

  it('returns error when future date is not allowed', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const value = formatDisplayValue(futureDate);
    expect(validateDateInputValue(value, { allowFutureDates: false })).toBe(
      'Date cannot be in the future'
    );
  });

  it('returns error when todayOnly and date is not today', () => {
    expect(validateDateInputValue('2000-01-01', { todayOnly: true })).toBe(
      'Date must be today'
    );
  });

  it('returns null for today when todayOnly is true', () => {
    const today = formatDisplayValue(new Date());
    expect(validateDateInputValue(today, { todayOnly: true })).toBeNull();
  });

  it('returns error when date exceeds maxFutureYears', () => {
    const far = new Date();
    far.setFullYear(far.getFullYear() + 5);
    const value = formatDisplayValue(far);
    expect(
      validateDateInputValue(value, {
        allowFutureDates: true,
        maxFutureYears: 1,
      })
    ).toBe('Date must be within the next year');
  });

  it('validates range mode with valid range', () => {
    expect(
      validateDateInputValue('2025-01-01 - 2025-01-31', {
        selectionMode: 'range',
        allowPastDates: true,
      })
    ).toBeNull();
  });

  it('returns error for invalid range', () => {
    expect(
      validateDateInputValue('invalid-range', { selectionMode: 'range' })
    ).toBe('Invalid date range');
  });
});

describe('formatDisplayValue', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date(2025, 2, 5); // March 5, 2025
    expect(formatDisplayValue(date)).toBe('2025-03-05');
  });

  it('pads month and day with leading zeros', () => {
    const date = new Date(2025, 0, 1); // Jan 1, 2025
    expect(formatDisplayValue(date)).toBe('2025-01-01');
  });
});

describe('formatMonthYear', () => {
  it('formats a date as "Month YYYY"', () => {
    const date = new Date(2025, 2, 1); // March 2025
    expect(formatMonthYear(date)).toBe('March 2025');
  });
});

describe('buildCalendarDays', () => {
  it('always returns exactly 42 cells', () => {
    const result = buildCalendarDays(new Date(2025, 0, 1));
    expect(result).toHaveLength(42);
  });

  it('marks days in current month correctly', () => {
    const viewDate = new Date(2025, 0, 1); // January 2025
    const days = buildCalendarDays(viewDate);
    const currentMonthDays = days.filter((d) => d.inCurrentMonth);
    expect(currentMonthDays.length).toBe(31); // January has 31 days
  });

  it('includes padding days from previous and next month', () => {
    const viewDate = new Date(2025, 0, 1);
    const days = buildCalendarDays(viewDate);
    const outsideDays = days.filter((d) => !d.inCurrentMonth);
    expect(outsideDays.length).toBe(11); // 42 - 31
  });

  it('day numbers within the current month start at 1', () => {
    const viewDate = new Date(2025, 0, 1);
    const days = buildCalendarDays(viewDate);
    const currentMonthDays = days.filter((d) => d.inCurrentMonth);
    expect(currentMonthDays[0].day).toBe(1);
    expect(currentMonthDays.at(-1)?.day).toBe(31);
  });
});

describe('parseDateRangeValue', () => {
  it('returns null start/end for empty string', () => {
    const result = parseDateRangeValue('');
    expect(result.start).toBeNull();
    expect(result.end).toBeNull();
  });

  it('parses a valid date range', () => {
    const result = parseDateRangeValue('2025-01-01 - 2025-01-31');
    expect(result.start).not.toBeNull();
    expect(result.end).not.toBeNull();
    expect(result.start!.getDate()).toBe(1);
    expect(result.end!.getDate()).toBe(31);
  });

  it('normalizes reversed range (end < start)', () => {
    const result = parseDateRangeValue('2025-01-31 - 2025-01-01');
    expect(result.start!.getDate()).toBe(1);
    expect(result.end!.getDate()).toBe(31);
  });

  it('returns null for invalid range dates', () => {
    const result = parseDateRangeValue('not-a-date - also-not');
    expect(result.start).toBeNull();
    expect(result.end).toBeNull();
  });

  it('treats a single valid date as start=end', () => {
    const result = parseDateRangeValue('2025-06-15');
    expect(result.start).not.toBeNull();
    expect(result.end).not.toBeNull();
    expect(result.start!.getTime()).toBe(result.end!.getTime());
  });
});

describe('formatDateRangeValue', () => {
  it('formats two dates as a range string', () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 0, 31);
    expect(formatDateRangeValue(start, end)).toBe('2025-01-01 - 2025-01-31');
  });

  it('sorts start and end when start > end', () => {
    const start = new Date(2025, 0, 31);
    const end = new Date(2025, 0, 1);
    expect(formatDateRangeValue(start, end)).toBe('2025-01-01 - 2025-01-31');
  });
});

describe('getInitialViewDate', () => {
  it('returns a Date for a valid ISO string', () => {
    const result = getInitialViewDate('2025-06-15');
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(15);
  });

  it('returns today for an invalid/empty value', () => {
    const result = getInitialViewDate('invalid');
    expect(toStartOfDay(result).getTime()).toBe(
      toStartOfDay(new Date()).getTime()
    );
  });

  it('returns today when no value provided', () => {
    const result = getInitialViewDate();
    expect(toStartOfDay(result).getTime()).toBe(
      toStartOfDay(new Date()).getTime()
    );
  });
});
