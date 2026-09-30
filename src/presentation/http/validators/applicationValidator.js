import { z } from 'zod';

export const createApplicationSchema = z.object({
  candidateId: z.number().int().positive(),
  jobId: z.number().int().positive(),
  coverLetter: z.string().max(10000).nullable().optional(),
  source: z.enum(['REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER'])
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(['RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED'])
});
