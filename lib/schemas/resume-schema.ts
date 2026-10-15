import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matchingPoints: z.array(z.string()).default([]),
  improvementPoints: z.array(z.string()).default([]),
  matchPercentageByRole: z.record(z.string(), z.number()).optional().catch({}),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;

export const AnalyzeResumeInputSchema = z.object({
  resumeText: z
    .string({ message: 'Payload inválido. Envie um JSON com o campo "resumeText".' })
    .min(1, 'Payload inválido. Envie um JSON com o campo "resumeText".')
    .max(50000, 'O texto do currículo excede o limite suportado de 50.000 caracteres.'),
  jobTitle: z
    .string()
    .max(120, 'O cargo-alvo deve ter no máximo 120 caracteres.')
    .optional(),
});

export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

