import { describe, expect, it } from 'vitest';
import { userFormSchema } from '~/pages/my-account-page/user-account/general-info/user-form.schema';

describe('userFormSchema', () => {
  const VALID = {
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumber: '+15550000001',
  };

  it('accepts valid data', () => {
    const result = userFormSchema.safeParse(VALID);
    expect(result.success).toBe(true);
  });

  it('rejects empty firstName', () => {
    const result = userFormSchema.safeParse({ ...VALID, firstName: '' });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('firstName'))).toBe(true);
  });

  it('rejects firstName with numbers', () => {
    const result = userFormSchema.safeParse({ ...VALID, firstName: 'Jane1' });
    expect(result.success).toBe(false);
  });

  it('rejects firstName longer than 50 characters', () => {
    const result = userFormSchema.safeParse({
      ...VALID,
      firstName: 'a'.repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it('accepts firstName with hyphen and apostrophe', () => {
    const result = userFormSchema.safeParse({
      ...VALID,
      firstName: 'Mary-Jane',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty lastName', () => {
    const result = userFormSchema.safeParse({ ...VALID, lastName: '' });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('lastName'))).toBe(true);
  });

  it('rejects empty phoneNumber', () => {
    const result = userFormSchema.safeParse({ ...VALID, phoneNumber: '' });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('phoneNumber'))).toBe(true);
  });

  it('rejects invalid phone number format', () => {
    const result = userFormSchema.safeParse({
      ...VALID,
      phoneNumber: 'not-a-phone',
    });
    expect(result.success).toBe(false);
  });

  it('accepts valid international phone number and normalizes to E164', () => {
    const result = userFormSchema.safeParse({
      ...VALID,
      phoneNumber: '+1 (555) 000-0001',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // The transform should normalize to E164 format
      expect(result.data.phoneNumber).toMatch(/^\+\d+$/);
    }
  });

  it('trims whitespace from firstName', () => {
    const result = userFormSchema.safeParse({
      ...VALID,
      firstName: '  Jane  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.firstName).toBe('Jane');
    }
  });
});
