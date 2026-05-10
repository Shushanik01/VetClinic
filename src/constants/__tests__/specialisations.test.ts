import { describe, expect, it } from 'vitest';
import { SPECIALISATION_OPTIONS } from '~/constants/specialisations';

describe('SPECIALISATION_OPTIONS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SPECIALISATION_OPTIONS)).toBe(true);
    expect(SPECIALISATION_OPTIONS.length).toBeGreaterThan(0);
  });

  it('each option has a value and a label', () => {
    SPECIALISATION_OPTIONS.forEach((option) => {
      expect(typeof option.value).toBe('string');
      expect(option.value.length).toBeGreaterThan(0);
      expect(typeof option.label).toBe('string');
      expect(option.label.length).toBeGreaterThan(0);
    });
  });

  it('contains expected specialisations', () => {
    const values = SPECIALISATION_OPTIONS.map((o) => o.value);
    expect(values).toContain('Surgery');
    expect(values).toContain('General');
    expect(values).toContain('Cardiology');
  });

  it('value and label match for each option', () => {
    SPECIALISATION_OPTIONS.forEach((option) => {
      expect(option.value).toBe(option.label);
    });
  });
});
