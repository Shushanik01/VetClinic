import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .trim()
      .min(1, { message: 'Current Password is required' }),

    newPassword: z
      .string()
      .trim()
      .min(8, { message: 'Password must be 8-16 characters long' })
      .max(16, { message: 'Password must be 8-16 characters long' })
      .regex(/[A-Z]/, {
        message: 'At least one uppercase letter required',
      })
      .regex(/[a-z]/, {
        message: 'At least one lowercase letter required',
      })
      .regex(/[0-9]/, {
        message: 'At least one number required',
      })
      .regex(/[^A-Za-z0-9]/, {
        message: 'At least one special character required',
      }),

    confirmPassword: z.string().trim().min(1, {
      message: 'Confirm Password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
