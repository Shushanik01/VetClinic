import { describe, expect, it } from 'vitest';
import { signUpSchema } from '~/pages/sign-up-page/sign-up-form/sign-up.schema';

const validPayload = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@vetcare.dev',
  phoneNumber: '+1 (555) 000-0011',
  password: 'StrongPass1!',
  confirmPassword: 'StrongPass1!',
};

describe('signUpSchema', () => {
  it('parses valid payload and normalizes values', () => {
    const parsed = signUpSchema.parse({
      ...validPayload,
      firstName: '  Jane  ',
      lastName: '  Doe  ',
      email: '  jane.doe@vetcare.dev  ',
      confirmPassword: '  StrongPass1!  ',
    });

    expect(parsed.firstName).toBe('Jane');
    expect(parsed.lastName).toBe('Doe');
    expect(parsed.email).toBe('jane.doe@vetcare.dev');
    expect(parsed.phoneNumber).toBe('+15550000011');
    expect(parsed.confirmPassword).toBe('StrongPass1!');
  });

  it('fails for invalid first name characters', () => {
    const result = signUpSchema.safeParse({
      ...validPayload,
      firstName: 'J@ne',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.firstName?.[0]).toContain(
        'Only Latin letters'
      );
    }
  });

  it('fails for invalid phone number country code', () => {
    const result = signUpSchema.safeParse({
      ...validPayload,
      phoneNumber: '+00012345678',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phoneNumber?.[0]).toBe(
        'Invalid phone number or country code'
      );
    }
  });

  it('fails when password and confirm password do not match', () => {
    const result = signUpSchema.safeParse({
      ...validPayload,
      confirmPassword: 'AnotherPass1!',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword?.[0]).toBe(
        "Passwords don't match"
      );
    }
  });
});
