'use client';

import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

interface ScoreCardProps {
  data: ResumeAnalysis;
  isStreaming?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
}

function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-teal-500';
  if (score >= 60) return 'from-amber-500 to-orange-500';
  return 'from-red-500 to-rose-500';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excelente';
  if (score >= 80) return 'Muito Bom';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Regular';
  return 'Precisa Melhorar';
}

export function ScoreCard({ data, isStreaming = false }: ScoreCardProps) {
  const { score, summary, matchingPoints, improvementPoints } = data;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-xl space-y-6"
    >
      {isStreaming ? (
        <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium pb-2 border-b border-slate-800">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Análise em andamento...
        </div>
      ) : null}

      <div className="flex items-center gap-4">
        {/* Circular Score Indicator */}
        <div className="relative w-20 h-20 shrink-0">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 80 80"
            aria-hidden="true"
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-800"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 213.6} 213.6`}
              className={cn('transition-all duration-700', getScoreColor(score))}
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-xl font-bold', getScoreColor(score))}>{score}</span>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-400">Score de Compatibilidade</p>
          <p className={cn('text-lg font-semibold', getScoreColor(score))}>
            {getScoreLabel(score)}
          </p>
          <div className="w-full max-w-[200px] bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', getScoreGradient(score))}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Resumo Executivo
        </h3>
        <p className="text-sm text-slate-200 leading-relaxed">{summary}</p>
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Points */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Pontos Fortes
          </h3>
          <ul className="space-y-2">
            {matchingPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Points */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/50">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pontos de Melhoria
          </h3>
          <ul className="space-y-2">
            {improvementPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
