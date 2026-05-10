import { describe, expect, it } from 'vitest';
import { signInSchema } from '~/pages/sign-in-page/sign-in-form/sign-in.schema';

const validPayload = {
  email: 'client@vetcare.dev',
  password: 'Client123!',
};

describe('signInSchema', () => {
  it('parses valid payload and normalizes email', () => {
    const parsed = signInSchema.parse({
      ...validPayload,
      email: '  client@vetcare.dev  ',
    });

    expect(parsed.email).toBe('client@vetcare.dev');
    expect(parsed.password).toBe('Client123!');
  });

  it('fails for missing email', () => {
    const result = signInSchema.safeParse({
      email: '',
      password: validPayload.password,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toBe(
        'Email is required'
      );
    }
  });

  it('fails for invalid email format', () => {
    const result = signInSchema.safeParse({
      email: 'not-an-email',
      password: validPayload.password,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toContain(
        'Invalid email address'
      );
    }
  });

  it('fails for missing password', () => {
    const result = signInSchema.safeParse({
      email: validPayload.email,
      password: '',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        'Password is required'
      );
    }
  });
});
