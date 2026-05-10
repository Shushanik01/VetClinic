import { useEffect, useMemo, useRef, useState } from 'react';
import clockIcon from '~/assets/svg/clock-regular-full.svg';
import { TIME_SLOTS } from './constants';

type TimeSelectProps = {
  value?: string;
  onChange?: (time: string) => void;
  error?: string;
  label?: string;
  /**
   * Explicit list of time slots in HH:MM (24h) format.
   * If not provided, slots are generated from intervalMinutes/startHour/endHour
   * or fall back to TIME_SLOTS.
   */
  timeSlots?: string[];
  /** Interval in minutes between generated slots (e.g. 60, 30, 15). */
  intervalMinutes?: number;
  /** Start hour (0-23) for generated slots. */
  startHour?: number;
  /** End hour (0-23, inclusive) for generated slots. */
  endHour?: number;
  /**
   * Selected date in YYYY-MM-DD format, used to disable
   * past or future times relative to the current moment.
   */
  selectedDate?: string;
  /** Whether times earlier than now should be selectable. */
  allowPastTimes?: boolean;
  /** Whether times later than now should be selectable. */
  allowFutureTimes?: boolean;
  placeholder?: string;
  /** When true, disables selection until a date is provided. */
  requireDate?: boolean;
  /** Force-disable the control regardless of date. */
  disabled?: boolean;
  /** When true, show a clear button that resets value to empty */
  clearable?: boolean;
};

const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

const generateTimeSlots = (
  startHour: number,
  endHour: number,
  intervalMinutes: number
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      if (hour === endHour && minute > 0) break;
      slots.push(`${pad(hour)}:${pad(minute)}`);
    }
  }
  return slots;
};

export const TimeSelect = ({
  value,
  onChange,
  error,
  label = 'Time',
  timeSlots,
  intervalMinutes,
  startHour = 8,
  endHour = 17,
  selectedDate,
  allowPastTimes = true,
  allowFutureTimes = true,
  placeholder = 'HH:MM',
  requireDate = false,
  disabled = false,
  clearable = false,
}: TimeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasSelectedDate = !!selectedDate && selectedDate.length >= 10;
  const isEffectivelyDisabled = disabled || (requireDate && !hasSelectedDate);

  const options = useMemo(() => {
    if (timeSlots && timeSlots.length > 0) return timeSlots;

    if (intervalMinutes && intervalMinutes > 0) {
      return generateTimeSlots(startHour, endHour, intervalMinutes);
    }

    return TIME_SLOTS;
  }, [timeSlots, intervalMinutes, startHour, endHour]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Scroll the list to keep the selected time in view when opened.
  useEffect(() => {
    if (!isOpen || !value || !listRef.current) return;

    const container = listRef.current;
    const selectedButton = container.querySelector<HTMLButtonElement>(
      'button.select-item-selected'
    );

    if (!selectedButton) return;

    const containerRect = container.getBoundingClientRect();
    const optionRect = selectedButton.getBoundingClientRect();

    const offset =
      optionRect.top -
      containerRect.top -
      containerRect.height / 2 +
      optionRect.height / 2;

    container.scrollTop += offset;
  }, [isOpen, value]);

  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10); // YYYY-MM-DD

  const isOptionDisabled = (slot: string): boolean => {
    if (isEffectivelyDisabled) return true;

    const baseDate = selectedDate || todayIso;
    const [hourStr, minuteStr] = slot.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    if (Number.isNaN(hour) || Number.isNaN(minute)) return true;

    const slotDate = new Date(`${baseDate}T${pad(hour)}:${pad(minute)}:00Z`);

    const isTodaySelected = hasSelectedDate && selectedDate === todayIso;

    // If a non-today date is selected, allow all times.
    if (!isTodaySelected) {
      return false;
    }

    if (!allowPastTimes && slotDate.getTime() < now.getTime()) {
      return true;
    }

    if (!allowFutureTimes && slotDate.getTime() > now.getTime()) {
      return true;
    }

    return false;
  };

  const handleSelect = (slot: string) => {
    if (isOptionDisabled(slot)) return;
    onChange?.(slot);
    setIsOpen(false);
  };

  const displayValue = value ?? '';

  return (
    <div className="flex flex-col" ref={wrapperRef}>
      {label && <label className="input-label">{label}</label>}
      <div className="relative w-full group">
        <input
          type="text"
          value={displayValue}
          readOnly
          placeholder={placeholder}
          onClick={() => {
            if (isEffectivelyDisabled) return;
            setIsOpen((prev) => !prev);
          }}
          aria-disabled={isEffectivelyDisabled}
          className={`cursor-pointer input-field w-full pr-12 group-hover:shadow-[0_4px_4px_0_#0446450D] ${
            error ? 'input-error' : ''
          } ${isEffectivelyDisabled ? 'bg-neutral-50 text-neutral-400 cursor-not-allowed' : ''}`}
        />

        {clearable && !disabled && value && (
          <button
            type="button"
            onClick={() => {
              onChange?.('');
            }}
            className="absolute cursor-pointer right-8 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center text-neutral-400 hover:text-neutral-800"
            aria-label="Clear time"
          >
            ×
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (isEffectivelyDisabled) return;
            setIsOpen((prev) => !prev);
          }}
          disabled={isEffectivelyDisabled}
          className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pr-4 pl-2"
          aria-label="Toggle time options"
        >
          <img src={clockIcon} alt="Time" className="h-4 w-4" />
        </button>

        {isOpen && !isEffectivelyDisabled && (
          <div
            ref={listRef}
            className="absolute left-0 top-full z-20 mt-0.5 max-h-60 w-full overflow-y-auto rounded-[10px] border border-green-400 bg-neutral-0 shadow-md"
          >
            {options.map((slot) => {
              const disabled = isOptionDisabled(slot);
              const isSelected = slot === value;

              return (
                <button
                  key={slot}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(slot)}
                  className={`select-item w-full text-left flex items-center justify-between ${
                    disabled ? 'select-item-disabled' : ''
                  } ${isSelected ? 'select-item-selected' : ''}`}
                >
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <span
        className={`input-caption min-h-[20px] ${error ? 'text-red-400' : 'invisible'}`}
      >
        {error || 'placeholder'}
      </span>
    </div>
  );
};
