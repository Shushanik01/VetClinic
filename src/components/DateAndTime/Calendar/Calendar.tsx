import { useState } from 'react';
import styles from './Calendar.module.css';
import { DAYS, MONTH_NAMES } from '../constants';
import type { BookingDateProps } from '../Types';

const Calendar: React.FC<BookingDateProps> = ({
  onDateSelect,
  availableDates,
  selectedDate,
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const effectiveMinDate = minDate ?? null;
  if (effectiveMinDate) effectiveMinDate.setHours(0, 0, 0, 0);
  const effectiveMaxDate = maxDate ?? null;
  if (effectiveMaxDate) effectiveMaxDate.setHours(0, 0, 0, 0);

  // Calendar days generation
  const getCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const isPrevMonthDisabled = effectiveMinDate
    ? currentYear < effectiveMinDate.getFullYear() ||
    (currentYear === effectiveMinDate.getFullYear() &&
      currentMonth <= effectiveMinDate.getMonth())
    : false;

  const isNextMonthDisabled = effectiveMaxDate
    ? currentYear > effectiveMaxDate.getFullYear() ||
    (currentYear === effectiveMaxDate.getFullYear() &&
      currentMonth >= effectiveMaxDate.getMonth())
    : false;

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          type="button"
          onClick={handlePrevMonth}
          className={styles.navButton}
          disabled={isPrevMonthDisabled}
          style={
            isPrevMonthDisabled ? { opacity: 0.3, cursor: 'not-allowed' } : {}
          }
        >
          ‹
        </button>
        <span className={styles.monthYear}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className={styles.navButton}
          disabled={isNextMonthDisabled}
          style={
            isNextMonthDisabled ? { opacity: 0.3, cursor: 'not-allowed' } : {}
          }
        >
          ›
        </button>
      </div>

      {/* Week days */}
      <div className={styles.weekDays}>
        {DAYS.map((day) => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className={styles.daysGrid}>
        {getCalendarDays().map((day, i) => {
          const dateStr = day
            ? `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            : '';
          const isAvailable =
            !availableDates ||
            availableDates.length === 0 ||
            availableDates.includes(dateStr);
          const dayDate = day ? new Date(currentYear, currentMonth, day) : null;
          const isPast =
            dayDate && effectiveMinDate ? dayDate < effectiveMinDate : false;
          const isFuture =
            dayDate && effectiveMaxDate ? dayDate > effectiveMaxDate : false;
          const isDisabled = !isAvailable || isPast || isFuture;
          return (
            <div
              key={day ? dateStr : `null-${i}`}
              role={day && !isDisabled ? 'button' : undefined}
              tabIndex={day && !isDisabled ? 0 : -1}
              className={
                day &&
                  selectedDate?.getFullYear() === currentYear &&
                  selectedDate?.getMonth() === currentMonth &&
                  selectedDate?.getDate() === day
                  ? styles.selectedDay
                  : undefined
              }

              onClick={() =>
                day &&
                !isDisabled &&
                onDateSelect(new Date(currentYear, currentMonth, day))
              }
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && day && !isDisabled) {
                  onDateSelect(new Date(currentYear, currentMonth, day));
                }
              }}
              style={
                day && isDisabled ? { opacity: 0.3, cursor: 'not-allowed' } : {}
              }
            >
              {day || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Calendar;
