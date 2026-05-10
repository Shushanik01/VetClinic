import { describe, expect, it } from 'vitest';
import { TIME_SLOTS } from '~/components/forms/time-input/constants';

describe('time-input/constants', () => {
  it('re-exports TIME_SLOTS from ~/constants/time-slots', () => {
    expect(Array.isArray(TIME_SLOTS)).toBe(true);
    expect(TIME_SLOTS.length).toBeGreaterThan(0);
  });

  it('contains time strings in HH:MM format', () => {
    const timePattern = /^\d{2}:\d{2}$/;
    TIME_SLOTS.forEach((slot) => {
      expect(slot).toMatch(timePattern);
    });
  });
});
