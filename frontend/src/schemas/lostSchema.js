import { z } from 'zod';
import { isValidTimeWindow, PHONE_REGEX } from '../utils/validators';

export const lostSchema = z
  .object({
    category: z.string().min(1, 'Category is required'),
    itemName: z.string().min(2, 'Item name must be at least 2 characters').max(60, 'Item name is too long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters'),
    color: z.string().min(1, 'Color is required'),
    specialMarks: z.string().max(300, 'Special marks cannot exceed 300 characters').optional().default(''),
    location: z.string().min(1, 'Campus location is required'),
    timeStart: z.string().min(1, 'Estimated start time is required'),
    timeEnd: z.string().min(1, 'Estimated end time is required'),
    phone: z.string().regex(PHONE_REGEX, 'Phone must be exactly 10 digits').optional(),
    photo: z.string().nullable().optional()
  })
  .refine(
    (data) => {
      if (!data.timeStart || !data.timeEnd) return true;
      const start = new Date(data.timeStart).getTime();
      const end = new Date(data.timeEnd).getTime();
      const now = Date.now();
      return start <= now && end <= now && end >= start;
    },
    {
      message: 'End time must be after start time, and neither can be in the future',
      path: ['timeEnd']
    }
  );
