import { z } from 'zod';
import {
  isValidInternationalPhoneNumber,
  normalizeToE164,
} from '~/utils/phone-number';

export const userFormSchema = z.object({
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

  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: 'Phone Number is required' })
    .refine((val) => isValidInternationalPhoneNumber(val), {
      message: 'Invalid phone number or country code',
    })
    .transform((val) => normalizeToE164(val)),
});
