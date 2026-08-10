import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matchingPoints: z.array(z.string()).default([]),
  improvementPoints: z.array(z.string()).default([]),
  matchPercentageByRole: z.record(z.string(), z.number()).optional().catch({}),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
