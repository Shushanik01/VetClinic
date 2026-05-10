import * as z from 'zod';
import { validateDateInputValue } from '~/components/forms/date-input/components/utils';

const timeRegex = /^\d{2}:\d{2}$/;

const getDateValidationError = (date?: string) => {
  if (!date?.trim()) return null;

  return validateDateInputValue(date, {
    selectionMode: 'single',
    allowPastDates: false,
    allowFutureDates: true,
    maxFutureYears: 1,
    required: false,
  });
};

const baseSchema = z.object({
  specialty: z.string().nonempty('Select a specialty'),
  date: z.string().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
});

export const availableSlotsSearchSchema = baseSchema
  // Date validation is centralized in date-input utils and mirrored here
  // so invalid typed dates affect form-level validity.
  .refine((data) => !getDateValidationError(data.date), {
    path: ['date'],
    message: 'Invalid date',
  })
  // Time format validation (if provided)
  .refine(
    (data) => {
      if (!data.time) return true;
      return timeRegex.test(data.time.trim());
    },
    {
      path: ['time'],
      message: 'Invalid time format',
    }
  )
  // Time cannot be provided without a date
  .refine(
    (data) => {
      if (!data.time) return true;
      return (
        !!data.date &&
        data.date.trim() !== '' &&
        !getDateValidationError(data.date)
      );
    },
    {
      path: ['time'],
      message: 'Select a valid date first',
    }
  )
  // Location cannot be provided without a time
  .refine(
    (data) => {
      if (!data.location) return true;
      return !!data.time && data.time.trim() !== '';
    },
    {
      path: ['location'],
      message: 'Select time first',
    }
  );

export type AvailableSlotsSearchFormValues = z.infer<
  typeof availableSlotsSearchSchema
>;
