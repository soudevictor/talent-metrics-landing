'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'hasDismissedDisclaimer';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de projeto demonstrativo"
      className="bg-surface border-b border-border-subtle text-text-muted text-xs sm:text-sm py-2 px-4 sticky top-0 z-50 backdrop-blur-md flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center text-center">
        <Sparkles className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
        <span>
          <strong className="text-text-primary">Projeto Demonstrativo para Estudo:</strong> Plataforma fictícia de triagem de currículos impulsionado por IA.
        </span>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Fechar aviso de projeto demonstrativo"
        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
