import { z } from 'zod';
import {
  isValidInternationalPhoneNumber,
  normalizeToE164,
} from '~/utils/phone-number';

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: 'First Name is required' })
      .max(50, {
        message:
          'First name must be up to 50 characters. Only Latin letters, hyphens, and apostrophes are allowed.',
      })
      .regex(/^[A-Za-z' -]+$/, {
        message:
          'First name must be up to 50 characters. Only Latin letters, hyphens, and apostrophes are allowed.',
      }),

    lastName: z
      .string()
      .trim()
      .min(1, { message: 'Last Name is required' })
      .max(50, {
        message:
          'Last name must be up to 50 characters. Only Latin letters, hyphens, spaces and apostrophes are allowed.',
      })
      .regex(/^[A-Za-z' -]+$/, {
        message:
          'Last name must be up to 50 characters. Only Latin letters, hyphens, spaces and apostrophes are allowed.',
      }),

    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .refine(
        (val) => z.email().safeParse(val).success,
        'Invalid email address. Please ensure it follows the format: username@domain.com'
      ),

    phoneNumber: z
      .string()
      .trim()
      .min(1, { message: 'Phone Number is required' })
      .refine((val) => isValidInternationalPhoneNumber(val), {
        message: 'Invalid phone number or country code',
      })
      .transform((val) => normalizeToE164(val)),

    password: z
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
      .regex(/\d/, {
        message: 'At least one number required',
      })
      .regex(/[^A-Za-z0-9]/, {
        message: 'At least one special character required',
      }),

    confirmPassword: z.string().trim().min(1, {
      message: 'Confirm Password is required',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
