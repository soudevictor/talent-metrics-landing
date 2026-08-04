import { ScoreCard } from '@/components/playground/score-card';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

export interface ScoreDashboardProps {
  data: ResumeAnalysis;
}

export function ScoreDashboard({ data }: ScoreDashboardProps) {
  return <ScoreCard data={data} />;
}
