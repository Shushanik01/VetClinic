import { describe, expect, it } from 'vitest';
import {
  isValidISODate,
  validatePetBirthDate,
} from '~/components/book-appointment-form/book-appointment-schema';

describe('book-appointment-schema', () => {
  it('validates strict ISO date strings', () => {
    expect(isValidISODate('2024-02-29')).toBe(true);
    expect(isValidISODate('2024-2-29')).toBe(false);
    expect(isValidISODate('2024/02/29')).toBe(false);
    expect(isValidISODate('not-a-date')).toBe(false);
  });

  it('allows empty pet birth date', () => {
    expect(validatePetBirthDate('')).toBe(true);
    expect(validatePetBirthDate('   ')).toBe(true);
  });

  it('rejects non-ISO values as invalid date', () => {
    expect(validatePetBirthDate('01-01-2020')).toBe('Invalid date');
  });

  it('maps future-date error to date-of-birth specific message', () => {
    expect(validatePetBirthDate('2999-01-01')).toBe(
      'Date of birth cannot be in the future'
    );
  });
});
