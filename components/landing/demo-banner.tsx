'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'hasDismissedDisclaimer';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
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
      className="bg-indigo-950/90 border-b border-indigo-500/20 text-indigo-200 text-xs sm:text-sm py-2 px-4 sticky top-0 z-50 backdrop-blur-md flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center text-center">
        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
        <span>
          <strong>Projeto Demonstrativo para Estudo:</strong> Plataforma fictícia de triagem de currículos powered by AI.
        </span>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Fechar aviso de projeto demonstrativo"
        className="p-1 rounded-md text-indigo-300 hover:text-white hover:bg-indigo-900/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
