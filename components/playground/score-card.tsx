"use client";

import { CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

interface ScoreCardProps {
  data: ResumeAnalysis & { isEasterEgg?: boolean };
  isStreaming?: boolean;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 80) return 'Muito Bom';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Precisa Melhorar';
}

function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-accent';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

export function ScoreCard({ data, isStreaming = false }: ScoreCardProps) {
  const { score, summary, matchingPoints, improvementPoints, isEasterEgg } = data as ResumeAnalysis & { isEasterEgg?: boolean };
  const scoreColor = getScoreColorClass(score);
  const label = getScoreLabel(score);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className={`relative w-full rounded-2xl border bg-surface p-6 sm:p-8 space-y-8 transition-all duration-500 ${
        isEasterEgg
          ? 'border-accent/50 bg-accent/5 shadow-xl shadow-accent/10'
          : 'border-border-subtle'
      }`}
    >
      {/* Easter Egg Badge */}
      {isEasterEgg && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 text-xs font-semibold">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Modo Criador Ativado
          </span>
        </div>
      )}

      {/* Streaming indicator */}
      {isStreaming && (
        <div className="flex items-center gap-2 text-xs text-accent font-medium pb-4 border-b border-border-subtle">
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
          Análise em andamento...
        </div>
      )}

      {/* Score Principal — Hero visual */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
        {/* Circular Score — Grande e proeminente */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            {/* Track */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-surface-elevated"
            />
            {/* Progress */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 326.7} 326.7`}
              className={cn('transition-all duration-1000 ease-out', scoreColor)}
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-4xl sm:text-5xl font-extrabold', scoreColor)}>{score}</span>
            <span className="text-xs text-text-muted uppercase tracking-wider">/ 100</span>
          </div>
        </div>

        {/* Score Label & Bar */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-muted uppercase tracking-wider mb-1">
            Score de Compatibilidade
          </p>
          <p className={cn('text-2xl sm:text-3xl font-bold', scoreColor)}>
            {label}
          </p>
          <div className="w-full max-w-xs sm:max-w-md bg-surface-elevated h-2 rounded-full mt-4 overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-1000 ease-out', scoreColor)}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-text-muted">
            {score >= 80 && <TrendingUp className="inline w-3.5 h-3.5 mr-1" aria-hidden="true" />}
            {score >= 80 ? "Top 20% dos candidatos" : score >= 60 ? "Acima da média" : "Abaixo da média"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-subtle" />

      {/* Summary */}
      <div>
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
          Resumo Executivo
        </h3>
        <p className="text-base text-text-primary leading-relaxed">{summary}</p>
      </div>

      {/* Points Grid — Cards lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Points */}
        <div className="p-4 rounded-xl bg-canvas/40 border border-border-subtle">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" />
            Pontos Fortes
          </h3>
          <ul className="space-y-2.5">
            {matchingPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Points */}
        <div className="p-4 rounded-xl bg-canvas/40 border border-border-subtle">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Pontos de Melhoria
          </h3>
          <ul className="space-y-2.5">
            {improvementPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-text-primary">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}