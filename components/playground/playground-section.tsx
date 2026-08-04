'use client';

import { useState, useCallback } from 'react';
import { Dropzone } from '@/components/playground/dropzone';
import { ScoreCard } from '@/components/playground/score-card';
import { SkeletonCard } from '@/components/playground/skeleton-card';
import { Button } from '@/components/ui/button';
import { RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import type { ResumeAnalysis } from '@/lib/schemas/resume-schema';

type PlaygroundState = 'empty' | 'loading' | 'error' | 'success';

interface ApiErrorResponse {
  error: string;
}

export function PlaygroundSection() {
  const [state, setState] = useState<PlaygroundState>('empty');
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelect = useCallback(async (file: File) => {
    setState('loading');
    setResult(null);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json().catch(() => ({
          error: 'Erro inesperado ao processar o currículo.',
        }));
        throw new Error(errorData.error);
      }

      const data: ResumeAnalysis = await response.json();
      setResult(data);
      setState('success');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro inesperado ao analisar o currículo.';
      setErrorMessage(message);
      setState('error');
    }
  }, []);

  const handleRetry = useCallback(() => {
    setState('empty');
    setResult(null);
    setErrorMessage('');
  }, []);

  return (
    <section
      id="playground"
      className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full scroll-mt-28"
    >
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
          <span>Demo Gratuita</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Teste a Análise com IA
        </h2>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          Envie um currículo em PDF ou DOCX e veja em tempo real como nossa IA avalia o perfil do candidato.
        </p>
      </div>

      {/* Empty State — Dropzone */}
      {state === 'empty' ? (
        <Dropzone onFileSelect={handleFileSelect} />
      ) : null}

      {/* Loading State — Skeleton */}
      {state === 'loading' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-indigo-300">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" role="status" aria-label="Analisando currículo..." />
            <span>Analisando currículo com IA...</span>
          </div>
          <SkeletonCard />
        </div>
      ) : null}

      {/* Error State */}
      {state === 'error' ? (
        <div className="space-y-4">
          <div
            role="alert"
            className="flex flex-col items-center gap-3 text-center p-6 rounded-2xl border border-red-500/20 bg-red-500/5"
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-sm text-red-300 font-medium">Não foi possível analisar o currículo</p>
            <p className="text-xs text-slate-400 max-w-md">{errorMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-2 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      ) : null}

      {/* Success State — Score Card */}
      {state === 'success' && result ? (
        <div className="space-y-4">
          <ScoreCard data={result} />
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="gap-2 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Analisar outro currículo
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
