'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'hasDismissedDisclaimer';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY);
      if (!isDismissed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsVisible(true);
      }
    } catch {
      // Storage can be unavailable in private/embedded contexts.
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Dismissal still works for this session.
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de projeto demonstrativo"
      className="bg-surface border-b border-border-subtle text-text-muted text-xs sm:text-sm py-2 px-4 relative z-30 flex items-center justify-between gap-4 transition-colors"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center text-center">
        <Sparkles className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-text-primary">Projeto demonstrativo para estudo:</strong>{' '}
          plataforma fictícia de triagem de currículos. Nomes, empresas, preços e
          métricas são fictícios.
        </span>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Fechar aviso de projeto demonstrativo"
        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
