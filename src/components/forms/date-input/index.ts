export { CalendarInput } from './date-input';

/**
 * CalendarInput Component
 *
 * A customizable calendar date picker component with flexible date range control.
 * Displays an interactive calendar interface for selecting single dates with support
 * for past and future date restrictions.
 *
 * @component
 *
 * @param {string} [value] - The selected date in ISO format (YYYY-MM-DD)
 * @param {(dateString: string) => void} [onChange] - Callback fired when a date is selected
 * @param {string} [error] - Error message to display below the input
 * @param {string} [label='Date'] - Label text for the input field
 * @param {boolean} [allowPastDates=false] - If true, users can select dates before today
 * @param {boolean} [allowFutureDates=true] - If true, users can select dates after today
 * @param {boolean} [todayOnly=false] - If true, only today's date is valid/selectable
 * @param {number} [maxFutureYears=1] - Maximum years allowed into the future
 * @param {'single'|'range'} [selectionMode='single'] - Single date or date range mode
 *
 * @example
 * // Only allow future dates (default behavior)
 * <CalendarInput
 *   value={date}
 *   onChange={setDate}
 *   label="Appointment Date"
 * />
 *
 * @example
 * // Allow both past and future dates
 * <CalendarInput
 *   value={date}
 *   onChange={setDate}
 *   allowPastDates={true}
 *   allowFutureDates={true}
 *   label="Birth Date"
 * />
 *
 * @example
 * // Only allow past dates (historical dates)
 * <CalendarInput
 *   value={date}
 *   onChange={setDate}
 *   allowPastDates={true}
 *   allowFutureDates={false}
 *   label="Event Date"
 * />
 *
 * @example
 * // Date range selection (auto-sorted from past to future)
 * <CalendarInput
 *   value={period}
 *   onChange={setPeriod}
 *   selectionMode="range"
 *   label="Period"
 * />
 */
