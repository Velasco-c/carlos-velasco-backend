import { z } from 'zod';

export const createCandidateSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  email: z.string().email().max(254),
  yearsExperience: z.number().min(0)
});

export const createJobSchema = z.object({
  title: z.string().trim().min(1).max(150),
  minYearsExperience: z.number().min(0),
  status: z.enum(['OPEN', 'CLOSED']).optional()
});

export const updateJobStatusSchema = z.object({ status: z.enum(['OPEN', 'CLOSED']) });
