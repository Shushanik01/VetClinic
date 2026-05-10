import { z } from 'zod';

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .refine(
      (val) => z.email().safeParse(val).success,
      'Invalid email address. Please ensure it follows the format: username@domain.com'
    ),

  password: z.string().trim().min(1, { message: 'Password is required' }),
});
