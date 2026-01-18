import { z } from "zod";

export const createApplicantProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name is too long"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(100, "Last name is too long"),
  }),
});

export const updateApplicantProfileSchema = z.object({
  body: z
    .object({
      firstName: z.string().trim().min(1).max(100).optional(),

      lastName: z.string().trim().min(1).max(100).optional(),

      phone: z.string().trim().max(20).optional(),

      location: z.string().trim().max(200).optional(),

      coverLetter: z.string().trim().max(5000).optional(),

      skills: z.array(z.string()).optional(),
    })
    .strict(),
});

export const educationSchema = z.object({
  body: z.object({
    school: z
      .string()
      .trim()
      .min(1, "School name is required")
      .max(200, "School name is too long"),

    degree: z.string().trim().max(200, "Degree is too long").optional(),

    fieldOfStudy: z
      .string()
      .trim()
      .max(200, "Field of study is too long")
      .optional(),

    startDate: z.string().datetime().optional().or(z.date().optional()),

    endDate: z.string().datetime().optional().or(z.date().optional()),

    isCurrent: z.boolean().optional(),
  }),
});

export const experienceSchema = z.object({
  body: z.object({
    company: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(200, "Company name is too long"),

    position: z
      .string()
      .trim()
      .min(1, "Position is required")
      .max(200, "Position is too long"),

    description: z
      .string()
      .trim()
      .max(2000, "Description is too long")
      .optional(),

    startDate: z.string().datetime().optional().or(z.date().optional()),

    endDate: z.string().datetime().optional().or(z.date().optional()),

    isCurrent: z.boolean().optional(),
  }),
});
