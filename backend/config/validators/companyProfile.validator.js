import { z } from 'zod';

export const createCompanyProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(150, 'Company name is too long'),
  
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long')
    .optional(),
  
  industry: z
    .string()
    .trim()
    .min(2, 'Industry is too short')
    .max(100, 'Industry is too long')
    .optional(),

  location: z
    .string()
    .trim()
    .min(2, 'Location is too short')
    .max(150, 'Location is too long')
    .optional(),
})

export const updateCompanyProfileSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1)
    .max(150)
    .optional(),
  
  description: z
    .string()
    .trim()
    .min(10)
    .max(2000)
    .optional(),

  industry: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  location: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .optional(),
}).strict();
