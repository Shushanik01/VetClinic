import { DAYS } from './constants';
import { type CalendarDay, toStartOfDay } from './utils';
import { CalendarDayButton } from './calendar-day-button';

type CalendarGridProps = {
  calendarDays: CalendarDay[];
  selectedDate: Date | null;
  rangeStartDate?: Date | null;
  rangeEndDate?: Date | null;
  onDaySelect: (date: Date, isDisabled: boolean) => void;
  allowPastDates: boolean;
  allowFutureDates: boolean;
  todayOnly?: boolean;
  maxFutureYears?: number;
  /** When provided, only dates in this set (YYYY-MM-DD) are selectable */
  availableDates?: string[];
};

const pad = (n: number) => String(n).padStart(2, '0');
const toDateString = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const CalendarGrid = ({
  calendarDays,
  selectedDate,
  rangeStartDate,
  rangeEndDate,
  onDaySelect,
  allowPastDates,
  allowFutureDates,
  todayOnly = false,
  maxFutureYears = 1,
  availableDates,
}: CalendarGridProps) => {
  const availableDateSet = availableDates ? new Set(availableDates) : null;
  const today = toStartOfDay(new Date());
  const maxDate = toStartOfDay(
    new Date(
      today.getFullYear() + maxFutureYears,
      today.getMonth(),
      today.getDate()
    )
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-x-2 border-b border-neutral-100 pb-2 text-center text-body-s-regular font-lato text-black-900">
        {DAYS.map((day) => (
          <span key={day}>{day.charAt(0)}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-1">
        {calendarDays.map((dayItem) => {
          const dayStartOfDay = toStartOfDay(dayItem.date);
          const isPast = dayStartOfDay.getTime() < today.getTime();
          const isFuture = dayStartOfDay.getTime() > today.getTime();
          const isAfterMax = dayStartOfDay.getTime() > maxDate.getTime();
          const isOutsideMonth = !dayItem.inCurrentMonth;
          const isSelected =
            (selectedDate &&
              toStartOfDay(selectedDate).getTime() ===
                dayStartOfDay.getTime()) ??
            false;

          const normalizedRangeStart = rangeStartDate
            ? toStartOfDay(rangeStartDate)
            : null;
          const normalizedRangeEnd = rangeEndDate
            ? toStartOfDay(rangeEndDate)
            : null;

          const isRangeStart =
            !!normalizedRangeStart &&
            normalizedRangeStart.getTime() === dayStartOfDay.getTime();
          const isRangeEnd =
            !!normalizedRangeEnd &&
            normalizedRangeEnd.getTime() === dayStartOfDay.getTime();
          const isInRange =
            !!normalizedRangeStart &&
            !!normalizedRangeEnd &&
            dayStartOfDay.getTime() > normalizedRangeStart.getTime() &&
            dayStartOfDay.getTime() < normalizedRangeEnd.getTime();

          const isUnavailable =
            availableDateSet !== null &&
            !availableDateSet.has(toDateString(dayStartOfDay));

          const isDisabled =
            isOutsideMonth ||
            (todayOnly && dayStartOfDay.getTime() !== today.getTime()) ||
            (isPast && !allowPastDates) ||
            (isFuture && !allowFutureDates) ||
            isAfterMax ||
            isUnavailable;

          return (
            <CalendarDayButton
              key={`${dayItem.date.toISOString()}-${dayItem.day}`}
              day={dayItem.day}
              isSelected={isSelected}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              isInRange={isInRange}
              isDisabled={isDisabled}
              onClick={() => onDaySelect(dayItem.date, isDisabled)}
            />
          );
        })}
      </div>
    </div>
  );
};
