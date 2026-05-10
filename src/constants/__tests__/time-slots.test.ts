import { describe, expect, it } from 'vitest';
import { TIME_SLOTS } from '~/constants/time-slots';

describe('TIME_SLOTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(TIME_SLOTS)).toBe(true);
    expect(TIME_SLOTS.length).toBeGreaterThan(0);
  });

  it('contains time strings in HH:MM format', () => {
    const timePattern = /^\d{2}:\d{2}$/;
    TIME_SLOTS.forEach((slot) => {
      expect(slot).toMatch(timePattern);
    });
  });

  it('starts at 09:00', () => {
    expect(TIME_SLOTS[0]).toBe('09:00');
  });

  it('ends at 14:30', () => {
    expect(TIME_SLOTS[TIME_SLOTS.length - 1]).toBe('14:30');
  });

  it('has 12 time slots', () => {
    expect(TIME_SLOTS).toHaveLength(12);
  });
});
