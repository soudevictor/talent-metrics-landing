import { describe, it, expect } from 'vitest';
import { ResumeAnalysisSchema } from '@/lib/schemas/resume-schema';

describe('ResumeAnalysisSchema', () => {
  const validPayload = {
    score: 85,
    summary: 'Profissional experiente com foco em engenharia de software.',
    matchingPoints: ['Domínio de TypeScript', 'Experiência com React'],
    improvementPoints: ['Incluir métricas de impacto'],
  };

  it('should validate a correct payload', () => {
    const result = ResumeAnalysisSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should validate a payload with optional matchPercentageByRole', () => {
    const payload = {
      ...validPayload,
      matchPercentageByRole: {
        'Dev Senior': 90,
        'Tech Lead': 75,
      },
    };
    const result = ResumeAnalysisSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('should reject score below 0', () => {
    const result = ResumeAnalysisSchema.safeParse({ ...validPayload, score: -5 });
    expect(result.success).toBe(false);
  });

  it('should reject score above 100', () => {
    const result = ResumeAnalysisSchema.safeParse({ ...validPayload, score: 150 });
    expect(result.success).toBe(false);
  });

  it('should reject non-numeric score', () => {
    const result = ResumeAnalysisSchema.safeParse({ ...validPayload, score: 'alto' });
    expect(result.success).toBe(false);
  });

  it('should reject missing summary', () => {
    const { summary, ...payload } = validPayload;
    const result = ResumeAnalysisSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should reject matchingPoints with non-string items', () => {
    const result = ResumeAnalysisSchema.safeParse({
      ...validPayload,
      matchingPoints: [1, 2, 3],
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty object', () => {
    const result = ResumeAnalysisSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject null input', () => {
    const result = ResumeAnalysisSchema.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should accept empty arrays for matchingPoints and improvementPoints', () => {
    const result = ResumeAnalysisSchema.safeParse({
      ...validPayload,
      matchingPoints: [],
      improvementPoints: [],
    });
    expect(result.success).toBe(true);
  });
});
