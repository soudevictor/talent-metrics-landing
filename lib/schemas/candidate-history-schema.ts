import { z } from 'zod';

/**
 * Item do histórico de comparação salvo no localStorage.
 * Validado item a item para que um payload corrompido não derrube a UI.
 */
export const CandidateHistoryItemSchema = z.object({
  id: z.string().min(1).max(120),
  candidateName: z.string().min(1).max(160),
  jobTitle: z.string().max(160),
  score: z.number().min(0).max(100),
  analyzedAt: z.string().min(1),
  summary: z.string().min(1),
  matchingPoints: z.array(z.string()).max(50),
  improvementPoints: z.array(z.string()).max(50),
  matchPercentageByRole: z
    .record(z.string(), z.number())
    .optional()
    .catch(undefined),
});

export type CandidateHistoryItemInput = z.input<typeof CandidateHistoryItemSchema>;
