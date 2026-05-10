import { describe, expect, it } from 'vitest';
import {
  CLINIC_LOCATION_OPTIONS,
  resolveClinicIdByAddress,
} from '~/constants/clinics-location';

describe('CLINIC_LOCATION_OPTIONS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(CLINIC_LOCATION_OPTIONS)).toBe(true);
    expect(CLINIC_LOCATION_OPTIONS.length).toBeGreaterThan(0);
  });

  it('each option has a value and a label', () => {
    CLINIC_LOCATION_OPTIONS.forEach((option) => {
      expect(typeof option.value).toBe('string');
      expect(option.value.length).toBeGreaterThan(0);
      expect(typeof option.label).toBe('string');
      expect(option.label.length).toBeGreaterThan(0);
    });
  });
});

describe('resolveClinicIdByAddress', () => {
  it('returns empty string for undefined input', () => {
    expect(resolveClinicIdByAddress(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(resolveClinicIdByAddress('')).toBe('');
  });

  it('returns the correct clinic ID for a known address (exact)', () => {
    const firstClinic = CLINIC_LOCATION_OPTIONS[0];
    const result = resolveClinicIdByAddress(firstClinic.label);
    expect(result).toBe(firstClinic.value);
  });

  it('resolves clinic ID case-insensitively', () => {
    const firstClinic = CLINIC_LOCATION_OPTIONS[0];
    const result = resolveClinicIdByAddress(firstClinic.label.toUpperCase());
    expect(result).toBe(firstClinic.value);
  });

  it('resolves clinic ID with extra whitespace', () => {
    const firstClinic = CLINIC_LOCATION_OPTIONS[0];
    const result = resolveClinicIdByAddress(`  ${firstClinic.label}  `);
    expect(result).toBe(firstClinic.value);
  });

  it('returns empty string for an unknown address', () => {
    expect(resolveClinicIdByAddress('Unknown Clinic Address')).toBe('');
  });

  it('resolves all defined clinic locations', () => {
    CLINIC_LOCATION_OPTIONS.forEach((option) => {
      const result = resolveClinicIdByAddress(option.label);
      expect(result).toBe(option.value);
    });
  });
});
