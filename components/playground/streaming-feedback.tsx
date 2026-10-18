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
      className="flex items-center justify-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium"
    >
      <Loader2 className="w-5 h-5 animate-spin text-accent shrink-0" />
      <span>{statusMessage}</span>
    </div>
  );
}
