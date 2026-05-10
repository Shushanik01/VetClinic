import { MONTH_NAMES } from './constants';

export type CalendarDay = {
  date: Date;
  day: number;
  inCurrentMonth: boolean;
};

export type DateSelectionMode = 'single' | 'range';

export type DateValidationOptions = {
  selectionMode?: DateSelectionMode;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
  todayOnly?: boolean;
  maxFutureYears?: number;
  required?: boolean;
};

export const toStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const parseDateValue = (value?: string): Date | null => {
  if (!value) return null;

  const trimmed = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (!isoMatch) {
    // If the value is not in strict YYYY-MM-DD format, treat it as invalid
    // to avoid unpredictable Date parsing and year changes.
    return null;
  }

  const [, yearStr, monthStr, dayStr] = isoMatch;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  // Basic range checks
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  const parsed = new Date(year, month - 1, day);

  // Ensure the constructed date matches the input components exactly
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const RANGE_SEPARATOR = ' - ';

export const formatDateRangeValue = (start: Date, end: Date) => {
  const startAtDay = toStartOfDay(start);
  const endAtDay = toStartOfDay(end);

  const from =
    startAtDay.getTime() <= endAtDay.getTime() ? startAtDay : endAtDay;
  const to = startAtDay.getTime() <= endAtDay.getTime() ? endAtDay : startAtDay;

  return `${formatDisplayValue(from)}${RANGE_SEPARATOR}${formatDisplayValue(to)}`;
};

export const parseDateRangeValue = (value?: string) => {
  if (!value) return { start: null as Date | null, end: null as Date | null };

  const trimmed = value.trim();
  if (!trimmed) return { start: null as Date | null, end: null as Date | null };

  const exactMatch = /^(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})$/.exec(
    trimmed
  );

  if (exactMatch) {
    const start = parseDateValue(exactMatch[1]);
    const end = parseDateValue(exactMatch[2]);

    if (!start || !end) {
      return { start: null as Date | null, end: null as Date | null };
    }

    if (start.getTime() <= end.getTime()) {
      return { start, end };
    }

    return { start: end, end: start };
  }

  const single = parseDateValue(trimmed);
  if (single) {
    return { start: single, end: single };
  }

  return { start: null as Date | null, end: null as Date | null };
};

const validateSingleDateValue = (
  date: Date,
  {
    allowPastDates = false,
    allowFutureDates = true,
    todayOnly = false,
    maxFutureYears = 1,
  }: DateValidationOptions
) => {
  const today = toStartOfDay(new Date());
  const target = toStartOfDay(date);

  if (todayOnly && target.getTime() !== today.getTime()) {
    return 'Date must be today';
  }

  if (!allowPastDates && target.getTime() < today.getTime()) {
    return 'Date cannot be in the past';
  }

  if (!allowFutureDates && target.getTime() > today.getTime()) {
    return 'Date cannot be in the future';
  }

  if (allowFutureDates && maxFutureYears > 0) {
    const maxDate = new Date(
      today.getFullYear() + maxFutureYears,
      today.getMonth(),
      today.getDate()
    );

    if (target.getTime() > maxDate.getTime()) {
      return maxFutureYears === 1
        ? 'Date must be within the next year'
        : `Date must be within the next ${maxFutureYears} years`;
    }
  }

  return null;
};

export const validateDateInputValue = (
  value: string,
  options: DateValidationOptions = {}
) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return options.required ? 'Date is required' : null;
  }

  const selectionMode = options.selectionMode ?? 'single';

  if (selectionMode === 'range') {
    const parsedRange = parseDateRangeValue(trimmed);

    if (!parsedRange.start || !parsedRange.end) {
      return 'Invalid date range';
    }

    const startError = validateSingleDateValue(parsedRange.start, options);
    if (startError) return startError;

    const endError = validateSingleDateValue(parsedRange.end, options);
    if (endError) return endError;

    return null;
  }

  const parsed = parseDateValue(trimmed);
  if (!parsed) return 'Invalid date';

  return validateSingleDateValue(parsed, options);
};

export const formatDisplayValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatMonthYear = (date: Date) => {
  const monthName = MONTH_NAMES[date.getMonth()];
  return `${monthName} ${date.getFullYear()}`;
};

export const buildCalendarDays = (viewDate: Date): CalendarDay[] => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startIndex = (firstOfMonth.getDay() + 6) % 7;
  const totalCells = 42;
  const days: CalendarDay[] = [];

  for (let i = 0; i < totalCells; i += 1) {
    const dayOffset = i - startIndex + 1;
    if (dayOffset <= 0) {
      const day = daysInPrevMonth + dayOffset;
      days.push({
        date: new Date(year, month - 1, day),
        day,
        inCurrentMonth: false,
      });
      continue;
    }
    if (dayOffset > daysInMonth) {
      const day = dayOffset - daysInMonth;
      days.push({
        date: new Date(year, month + 1, day),
        day,
        inCurrentMonth: false,
      });
      continue;
    }

    days.push({
      date: new Date(year, month, dayOffset),
      day: dayOffset,
      inCurrentMonth: true,
    });
  }

  return days;
};

export const getInitialViewDate = (value?: string) => {
  const parsed = parseDateValue(value);
  return parsed ?? new Date();
};
