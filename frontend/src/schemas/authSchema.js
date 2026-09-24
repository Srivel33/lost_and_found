import { z } from 'zod';
import { COLLEGE_EMAIL_REGEX, REG_NUMBER_REGEX, PHONE_REGEX } from '../utils/validators';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'College email is required')
    .regex(COLLEGE_EMAIL_REGEX, 'Must be a valid @snsct.org address (or @college.edu)'),
  regNumber: z
    .string()
    .min(1, 'Registration number is required')
    .regex(REG_NUMBER_REGEX, 'Registration number must be 8 to 14 alphanumeric characters (e.g. 713524AM120)')
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters'),
  email: z
    .string()
    .min(1, 'College email is required')
    .regex(COLLEGE_EMAIL_REGEX, 'Must end with @snsct.org (or @college.edu)'),
  regNumber: z
    .string()
    .min(1, 'Registration number is required')
    .regex(REG_NUMBER_REGEX, 'Must be 8 to 14 alphanumeric characters (e.g. 713524AM120)'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(PHONE_REGEX, 'Phone must be exactly 10 digits')
});
