import { z } from 'zod';
import { PHONE_REGEX } from '../utils/validators';

const OBVIOUS_KEYWORDS = ['color', 'colour', 'brand', 'company', 'make', 'name of brand', 'what brand', 'what color'];

export const isObviousQuestion = (question) => {
  if (!question) return false;
  const qLower = question.toLowerCase();
  return OBVIOUS_KEYWORDS.some(kw => qLower.includes(kw));
};

export const foundSchema = z
  .object({
    category: z.string().min(1, 'Category is required'),
    itemName: z.string().min(2, 'Item name must be at least 2 characters').max(60, 'Item name is too long'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description cannot exceed 500 characters'),
    color: z.string().min(1, 'Color is required'),
    location: z.string().min(1, 'Campus location where found is required'),
    timeFound: z.string().min(1, 'Date and time found is required'),
    currentLocation: z.string().min(1, 'Current custody location is required'),
    photo: z.string().nullable().optional(),
    phone: z.string().regex(PHONE_REGEX, 'Phone must be exactly 10 digits').optional(),
    hiddenQuestion: z
      .string()
      .min(5, 'Hidden question must be at least 5 characters')
      .max(200, 'Hidden question cannot exceed 200 characters'),
    correctAnswer: z
      .string()
      .min(1, 'Correct answer is required')
      .max(100, 'Answer is too long'),
    decoy1: z.string().min(1, 'Decoy option 1 is required').max(100, 'Option too long'),
    decoy2: z.string().min(1, 'Decoy option 2 is required').max(100, 'Option too long'),
    decoy3: z.string().min(1, 'Decoy option 3 is required').max(100, 'Option too long')
  })
  .refine(
    (data) => {
      if (!data.timeFound) return true;
      return new Date(data.timeFound).getTime() <= Date.now();
    },
    {
      message: 'Found time cannot be in the future',
      path: ['timeFound']
    }
  )
  .refine(
    (data) => !isObviousQuestion(data.hiddenQuestion),
    {
      message: 'Pick a less obvious detail, like a sticker or wallpaper.',
      path: ['hiddenQuestion']
    }
  );
