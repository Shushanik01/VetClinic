import {
  parseDateValue,
  validateDateInputValue,
} from '~/components/forms/date-input/components/utils';

export const isValidISODate = (value: string): boolean => {
  return parseDateValue(value) !== null;
};

export const validatePetBirthDate = (value: string): true | string => {
  if (!value.trim()) return true;

  const validationError = validateDateInputValue(value, {
    allowPastDates: true,
    allowFutureDates: false,
  });

  if (!validationError) return true;

  return validationError === 'Date cannot be in the future'
    ? 'Date of birth cannot be in the future'
    : validationError;
};
