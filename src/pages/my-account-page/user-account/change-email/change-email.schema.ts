import { z } from 'zod';

export const changeEmailSchema = z
  .object({
    newEmail: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .refine(
        (val) => z.email().safeParse(val).success,
        'Invalid email address. Please ensure it follows the format: username@domain.com'
      ),
    confirmEmail: z
      .string()
      .trim()
      .min(1, { message: 'Confirm email is required' })
      .refine(
        (val) => z.email().safeParse(val).success,
        'Invalid email address. Please ensure it follows the format: username@domain.com'
      ),
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: 'Emails do not match',
    path: ['confirmEmail'],
  });

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
