'use client';

import { Loader2 } from 'lucide-react';

interface StreamingFeedbackProps {
  statusMessage?: string;
}

export function StreamingFeedback({ statusMessage = 'Analisando currículo com IA em tempo real...' }: StreamingFeedbackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium"
    >
      <Loader2 className="w-5 h-5 animate-spin text-indigo-400 shrink-0" />
      <span>{statusMessage}</span>
    </div>
  );
}
