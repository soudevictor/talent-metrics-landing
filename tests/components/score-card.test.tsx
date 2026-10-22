import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScoreCard } from '@/components/playground/score-card';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

function buildAnalysis(score: number): ResumeAnalysis {
  return {
    score,
    summary: 'Resumo de teste.',
    matchingPoints: ['React'],
    improvementPoints: ['Inglês'],
    matchPercentageByRole: { Frontend: score },
  };
}

describe('ScoreCard', () => {
  it('uses a real background token for a high score bar', () => {
    render(<ScoreCard data={buildAnalysis(92)} />);

    const bar = screen.getByTestId('score-bar');
    expect(bar).toHaveClass('bg-accent');
    expect(bar).toHaveStyle({ width: '92%' });
    expect(bar).toHaveAttribute('role', 'progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '92');
  });

  it('uses the warning token for a mid score bar', () => {
    render(<ScoreCard data={buildAnalysis(70)} />);

    expect(screen.getByTestId('score-bar')).toHaveClass('bg-warning');
  });

  it('uses the error token for a low score bar', () => {
    render(<ScoreCard data={buildAnalysis(30)} />);

    expect(screen.getByTestId('score-bar')).toHaveClass('bg-error');
  });

  it('renders the creator mode badge when isEasterEgg is true', () => {
    render(<ScoreCard data={{ ...buildAnalysis(100), isEasterEgg: true }} />);

    expect(screen.getByText(/Modo Criador Ativado/i)).toBeInTheDocument();
  });
});
