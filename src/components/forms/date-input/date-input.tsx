import { useEffect, useMemo, useRef, useState } from 'react';
import calendarInputIcon from '~/assets/svg/icons/calendar-input.svg';
import {
  formatDisplayValue,
  formatDateRangeValue,
  getInitialViewDate,
  buildCalendarDays,
  parseDateValue,
  parseDateRangeValue,
  validateDateInputValue,
  type DateSelectionMode,
} from './components/utils';
import { CalendarHeader } from './components/calendar-header';
import { CalendarGrid } from './components/calendar-grid';

export type CalendarInputProps = {
  id?: string;
  value?: string;
  onChange?: (dateString: string) => void;
  error?: string;
  label?: string | null;
  required?: boolean;
  disabled?: boolean;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
  todayOnly?: boolean;
  maxFutureYears?: number;
  selectionMode?: DateSelectionMode;
  /** When true, show a clear button that resets value to empty */
  clearable?: boolean;
  /** When true, validate on blur. When false, skip validation on blur. Defaults to true. */
  shouldValidate?: boolean;
  /** When true, render a permanently visible calendar and hide the text input. */
  inline?: boolean;
  /** When provided, only dates in this list (YYYY-MM-DD) are selectable */
  availableDates?: string[];
};

export const CalendarInput = ({
  id,
  value,
  onChange,
  error,
  label,
  required = false,
  disabled = false,
  allowPastDates = false,
  allowFutureDates = true,
  todayOnly = false,
  maxFutureYears = 1,
  selectionMode = 'single',
  clearable = false,
  shouldValidate = true,
  inline = false,
  availableDates,
}: CalendarInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localError, setLocalError] = useState<string>('');
  const [viewDate, setViewDate] = useState<Date>(() =>
    getInitialViewDate(value)
  );
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>(
    'bottom'
  );
  const [rangeAnchorDate, setRangeAnchorDate] = useState<Date | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedDate = useMemo(
    () => (selectionMode === 'single' ? parseDateValue(value) : null),
    [value, selectionMode]
  );
  const parsedRange = useMemo(
    () => (selectionMode === 'range' ? parseDateRangeValue(value) : null),
    [value, selectionMode]
  );
  const displayValue = value ?? '';
  const errorMessage = error || localError;
  const isEffectivelyDisabled = disabled;
  const isCalendarVisible = inline ? !isEffectivelyDisabled : isOpen;
  const resolvedLabel = label === undefined ? 'Date' : label;

  const emitChange = (nextValue: string) => {
    setLocalError('');

    if (!nextValue.trim()) {
      setRangeAnchorDate(null);
    }

    onChange?.(nextValue);
  };

  useEffect(() => {
    if (selectionMode === 'single' && selectedDate) {
      setViewDate(selectedDate);
      return;
    }

    if (selectionMode === 'range' && parsedRange?.start) {
      setViewDate(parsedRange.start);
    }
  }, [selectedDate, parsedRange, selectionMode]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (!displayValue.trim()) {
      setLocalError('');
      setRangeAnchorDate(null);
      return;
    }

    const validationError = validateDateInputValue(displayValue, {
      selectionMode,
      allowPastDates,
      allowFutureDates,
      todayOnly,
      maxFutureYears,
      required,
    });

    if (!validationError) {
      setLocalError('');
    }
  }, [
    displayValue,
    error,
    selectionMode,
    allowPastDates,
    allowFutureDates,
    todayOnly,
    maxFutureYears,
    required,
  ]);

  useEffect(() => {
    if (inline || !isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    // Use capture phase to ensure outside click is detected
    document.addEventListener('mousedown', handleOutsideClick, true);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
    };
  }, [isOpen]);

  const calculatePosition = () => {
    if (!inputRef.current) return 'bottom';

    const inputRect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 286; // min-h-[286px] from calendar
    const spaceBelow = window.innerHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Position above if not enough space below and more space above
    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      return 'top';
    }
    return 'bottom';
  };

  const handleToggleCalendar = () => {
    if (inline) return;
    if (isEffectivelyDisabled) return;

    if (!isOpen) {
      // Calculate position before opening
      setDropdownPosition(calculatePosition());
    }
    setIsOpen((prev) => !prev);
  };

  const calendarDays = useMemo(() => buildCalendarDays(viewDate), [viewDate]);

  const handleMonthChange = (offset: number) => {
    setViewDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1)
    );
  };

  const currentDate = new Date();
  const canGoPrevious = allowPastDates
    ? true
    : viewDate.getFullYear() > currentDate.getFullYear() ||
      (viewDate.getFullYear() === currentDate.getFullYear() &&
        viewDate.getMonth() > currentDate.getMonth());

  const handleDaySelect = (date: Date, isDisabled: boolean) => {
    if (isDisabled) return;

    const dateAtDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (selectionMode === 'range') {
      const existingSingleRangeAnchor =
        !rangeAnchorDate &&
        parsedRange?.start?.getTime() === parsedRange?.end?.getTime() &&
        parsedRange?.start
          ? parsedRange.start
          : null;

      const effectiveAnchor = rangeAnchorDate || existingSingleRangeAnchor;

      if (!effectiveAnchor) {
        setRangeAnchorDate(dateAtDay);
        setLocalError('');
        emitChange(formatDisplayValue(dateAtDay));
        return;
      }

      const normalizedRange = formatDateRangeValue(effectiveAnchor, dateAtDay);
      const rangeValidationError = validateDateInputValue(normalizedRange, {
        selectionMode,
        allowPastDates,
        allowFutureDates,
        todayOnly,
        maxFutureYears,
        required,
      });

      if (rangeValidationError) {
        setLocalError(rangeValidationError);
        return;
      }

      setLocalError('');
      setRangeAnchorDate(null);
      emitChange(normalizedRange);
      if (!inline) {
        setIsOpen(false);
      }
      return;
    }

    const normalizedSingle = formatDisplayValue(dateAtDay);
    const singleValidationError = validateDateInputValue(normalizedSingle, {
      selectionMode,
      allowPastDates,
      allowFutureDates,
      todayOnly,
      maxFutureYears,
      required,
    });

    if (singleValidationError) {
      setLocalError(singleValidationError);
      return;
    }

    setLocalError('');
    emitChange(normalizedSingle);
    if (!inline) {
      setIsOpen(false);
    }
  };

  const dropdownPositionClass =
    dropdownPosition === 'bottom' ? 'top-full mt-0.5' : 'bottom-full mb-0.5';

  return (
    <div className="flex flex-col" ref={wrapperRef}>
      {resolvedLabel !== null && (
        <label className="input-label flex items-center">
          {resolvedLabel}
          {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <div className="relative w-full group">
        {!inline && (
          <>
            <input
              id={id}
              ref={inputRef}
              type="text"
              value={displayValue}
              placeholder={
                selectionMode === 'range'
                  ? 'YYYY-MM-DD - YYYY-MM-DD'
                  : 'YYYY-MM-DD'
              }
              disabled={isEffectivelyDisabled}
              aria-disabled={isEffectivelyDisabled}
              onClick={() => {
                if (isEffectivelyDisabled) return;
                // Only open calendar if it's currently closed, don't toggle
                if (!isOpen) {
                  setDropdownPosition(calculatePosition());
                  setIsOpen(true);
                }
              }}
              onChange={(event) => {
                if (isEffectivelyDisabled) return;
                emitChange(event.target.value);
              }}
              onBlur={(event) => {
                if (isEffectivelyDisabled) return;
                // Don't close the calendar here - let outside click handle it
                if (!onChange || !shouldValidate) return;

                const rawValue = event.target.value;
                const validationError = validateDateInputValue(rawValue, {
                  selectionMode,
                  allowPastDates,
                  allowFutureDates,
                  todayOnly,
                  maxFutureYears,
                  required,
                });

                if (validationError) {
                  setLocalError(validationError);
                  return;
                }

                if (!rawValue.trim()) {
                  setLocalError('');
                  emitChange('');
                  return;
                }

                if (selectionMode === 'range') {
                  const range = parseDateRangeValue(rawValue);
                  if (!range.start || !range.end) {
                    setLocalError('Invalid date range');
                    return;
                  }

                  setLocalError('');
                  emitChange(formatDateRangeValue(range.start, range.end));
                  setRangeAnchorDate(null);
                  return;
                }

                const parsed = parseDateValue(rawValue);
                if (!parsed) {
                  setLocalError('Invalid date');
                  return;
                }

                setLocalError('');
                emitChange(formatDisplayValue(parsed));
              }}
              className={`input-field w-full pr-12 group-hover:shadow-[0_4px_4px_0_#0446450D] ${errorMessage ? 'input-error' : ''} ${
                isEffectivelyDisabled
                  ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed'
                  : ''
              }`}
            />

            {clearable && !isEffectivelyDisabled && displayValue && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  emitChange('');
                  setIsOpen(false); // Close calendar when clearing
                }}
                className="absolute cursor-pointer right-8 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-neutral-400 hover:text-neutral-800"
                aria-label="Clear date"
              >
                ×
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCalendar();
              }}
              disabled={isEffectivelyDisabled}
              className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pr-4 pl-2"
              aria-label="Toggle calendar"
            >
              <img src={calendarInputIcon} alt="Calendar" className="h-3 w-3" />
            </button>
          </>
        )}

        {isCalendarVisible && !isEffectivelyDisabled && (
          <div
            className={`${
              inline ? 'relative z-10 w-full' : 'absolute left-0 z-20 w-[304px]'
            } flex min-h-[286px] flex-col gap-4 rounded-[10px] border border-green-400 bg-neutral-0 p-4 shadow-md ${
              inline ? '' : dropdownPositionClass
            }`}
          >
            <CalendarHeader
              viewDate={viewDate}
              onMonthChange={handleMonthChange}
              canGoPrevious={canGoPrevious}
            />

            <CalendarGrid
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              rangeStartDate={
                selectionMode === 'range'
                  ? (rangeAnchorDate ?? parsedRange?.start ?? null)
                  : null
              }
              rangeEndDate={
                selectionMode === 'range' && !rangeAnchorDate
                  ? (parsedRange?.end ?? null)
                  : null
              }
              onDaySelect={handleDaySelect}
              allowPastDates={allowPastDates}
              allowFutureDates={allowFutureDates}
              todayOnly={todayOnly}
              maxFutureYears={maxFutureYears}
              availableDates={availableDates}
            />
          </div>
        )}
      </div>
      <span
        className={`input-caption min-h-[20px] ${errorMessage ? 'text-red-400' : 'invisible'}`}
      >
        {errorMessage || 'placeholder'}
      </span>
    </div>
  );
};
