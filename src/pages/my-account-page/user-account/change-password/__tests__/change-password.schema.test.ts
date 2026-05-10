import { describe, expect, it } from 'vitest';
import { changePasswordSchema } from '~/pages/my-account-page/user-account/change-password/change-password.schema';

describe('changePasswordSchema', () => {
  const VALID = {
    oldPassword: 'OldPass1!',
    newPassword: 'NewPass1!',
    confirmPassword: 'NewPass1!',
  };

  it('accepts valid data', () => {
    const result = changePasswordSchema.safeParse(VALID);
    expect(result.success).toBe(true);
  });

  it('rejects empty oldPassword', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      oldPassword: '',
    });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('oldPassword'))).toBe(true);
  });

  it('rejects newPassword shorter than 8 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'Ab1!',
      confirmPassword: 'Ab1!',
    });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('newPassword'))).toBe(true);
  });

  it('rejects newPassword longer than 16 characters', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'Abcdefghijk1!2345',
      confirmPassword: 'Abcdefghijk1!2345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects newPassword without uppercase letter', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'newpass1!',
      confirmPassword: 'newpass1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects newPassword without lowercase letter', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'NEWPASS1!',
      confirmPassword: 'NEWPASS1!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects newPassword without a number', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'NewPass!!',
      confirmPassword: 'NewPass!!',
    });
    expect(result.success).toBe(false);
  });

  it('rejects newPassword without a special character', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      newPassword: 'NewPass11',
      confirmPassword: 'NewPass11',
    });
    expect(result.success).toBe(false);
  });

  it('rejects when confirmPassword does not match newPassword', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      confirmPassword: 'MismatchPass1!',
    });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues.some((i) => i.path.includes('confirmPassword'))).toBe(true);
    expect(issues.some((i) => i.message === "Passwords don't match")).toBe(
      true
    );
  });

  it('rejects empty confirmPassword', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      confirmPassword: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from oldPassword', () => {
    const result = changePasswordSchema.safeParse({
      ...VALID,
      oldPassword: '  OldPass1!  ',
    });
    // Should still be valid since trimmed value is non-empty
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.oldPassword).toBe('OldPass1!');
    }
  });
});
