import { describe, it, expect, vi, beforeEach } from 'vitest';
import { availableSlotsSearchSchema } from '../available-slots-search-schema';

// Mock the date validation utility
vi.mock('~/components/forms/date-input/components/utils', () => ({
  validateDateInputValue: (date: string, options: any) => {
    if (!date || date.trim() === '') return null;

    // Simple validation: if date contains 'invalid', return error
    if (date.includes('invalid')) {
      return 'Date is invalid';
    }

    // Simulate past date check
    if (options.allowPastDates === false && date === '2020-01-01') {
      return 'Date cannot be in the past';
    }

    // Simulate future date check
    if (options.allowFutureDates === false && date === '2099-01-01') {
      return 'Date is too far in the future';
    }

    return null;
  },
}));

describe('availableSlotsSearchSchema', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Specialty field', () => {
    it('should require specialty', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: '',
        date: '',
        time: '',
        location: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'specialty')
        ).toBe(true);
      }
    });

    it('should accept valid specialty', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '',
        location: '',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Date field', () => {
    it('should accept optional date', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '',
        location: '',
      });

      expect(result.success).toBe(true);
    });

    it('should validate invalid date format', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: 'invalid',
        time: '',
        location: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'date')
        ).toBe(true);
      }
    });

    it('should accept past dates as invalid when allowPastDates is false', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2020-01-01',
        time: '',
        location: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Time field', () => {
    it('should accept optional time', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '',
        location: '',
      });

      expect(result.success).toBe(true);
    });

    it('should validate time format HH:MM', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '10:30',
        location: '',
      });

      expect(result.success).toBe(true);
    });

    it('should validate time format HH:MM regardless of validity', async () => {
      // The regex validates format (HH:MM) but not clock validity
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '25:99',
        location: '',
      });

      // 25:99 matches /^\d{2}:\d{2}$/ format so validation passes at schema level
      expect(result.success).toBe(true);
    });

    it('should reject time without valid date', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '10:30',
        location: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'time')
        ).toBe(true);
      }
    });

    it('should require valid date for time to be valid', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: 'invalid',
        time: '10:30',
        location: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('Location field', () => {
    it('should accept optional location', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '',
        location: '',
      });

      expect(result.success).toBe(true);
    });

    it('should require time for location to be valid', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '',
        location: 'Clinic A',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === 'location')
        ).toBe(true);
      }
    });

    it('should accept location when time is provided', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '10:30',
        location: 'Downtown Clinic',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('Complete form validation', () => {
    it('should pass with only required specialty field', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
      });

      expect(result.success).toBe(true);
    });

    it('should pass with all fields filled correctly', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '14:00',
        location: 'Downtown Clinic',
      });

      expect(result.success).toBe(true);
    });

    it('should fail when specialty is missing', async () => {
      const result = availableSlotsSearchSchema.safeParse({
        date: '2025-05-15',
        time: '14:00',
        location: 'Downtown Clinic',
      });

      expect(result.success).toBe(false);
    });

    it('should validate cascading field dependencies', async () => {
      // Location without time should fail
      let result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '',
        location: 'Clinic',
      });
      expect(result.success).toBe(false);

      // Time without date should fail
      result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '',
        time: '10:30',
        location: '',
      });
      expect(result.success).toBe(false);

      // All together should pass
      result = availableSlotsSearchSchema.safeParse({
        specialty: 'Cardiology',
        date: '2025-05-15',
        time: '10:30',
        location: 'Clinic',
      });
      expect(result.success).toBe(true);
    });
  });
});
