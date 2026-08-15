'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby={description ? 'modal-description' : undefined}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-border-subtle bg-surface-elevated/95 shadow-2xl shadow-black/60 backdrop-blur-xl focus-visible:outline-none overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            {/* Decorative glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-glow rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-glow rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-start justify-between p-6 pb-4 border-b border-border-subtle">
              <div>
                <h2 id="modal-title" className="text-xl font-bold text-text-primary tracking-tight">
                  {title}
                </h2>
                {description ? (
                  <p id="modal-description" className="mt-1 text-sm text-text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar janela"
                className="p-1.5 rounded-full text-text-muted bg-surface hover:text-text-primary hover:bg-surface-elevated transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative p-6 text-text-muted">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ── DemoModal — high-fidelity scheduling modal ─────────────────────────── */
const DEMO_SLOTS = [
  { day: 'Seg, 18 Ago', times: ['09:00', '11:30', '14:00'] },
  { day: 'Ter, 19 Ago', times: ['10:00', '15:30'] },
  { day: 'Qua, 20 Ago', times: ['09:30', '13:00', '16:00'] },
];

interface DemoModalContentProps {
  onClose: () => void;
}

export function DemoModalContent({ onClose }: DemoModalContentProps) {
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
  const [confirmed, setConfirmed] = React.useState(false);

  const handleConfirm = () => {
    if (selectedSlot) setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-14 h-14 rounded-full bg-accent-glow border border-accent/30 flex items-center justify-center">
          <Calendar className="w-7 h-7 text-accent" />
        </div>
        <p className="text-text-primary font-semibold text-lg">Agendamento confirmado!</p>
        <p className="text-text-muted text-sm max-w-xs">
          Esta é uma demonstração fictícia. Em um produto real, você receberia um convite de calendário por e-mail.
        </p>
        <Button variant="primary" size="sm" onClick={onClose} className="mt-2">
          Entendido
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-text-muted leading-relaxed">
        O <strong className="text-text-primary">TalentMetrics</strong> é um{' '}
        <strong className="text-accent">projeto demonstrativo para fins de estudo</strong>. Selecione um horário fictício abaixo ou conheça o desenvolvedor.
      </p>

      {/* Slot picker */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Disponibilidade desta semana
        </p>
        {DEMO_SLOTS.map((group) => (
          <div key={group.day}>
            <p className="text-xs text-text-muted/60 mb-1.5 font-medium">{group.day}</p>
            <div className="flex flex-wrap gap-2">
              {group.times.map((time) => {
                const key = `${group.day}-${time}`;
                const isActive = selectedSlot === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSlot(key)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer',
                      isActive
                        ? 'bg-accent-glow border-accent/50 text-accent'
                        : 'bg-surface border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary'
                    )}
                  >
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={handleConfirm}
        disabled={!selectedSlot}
        className="w-full gap-2"
      >
        <Calendar className="w-4 h-4" />
        Confirmar Horário
      </Button>

      {/* Developer links */}
      <div className="rounded-xl border border-border-subtle bg-canvas/60 p-4 space-y-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Conheça o desenvolvedor
        </p>
        <div className="flex flex-col gap-2">
          <a
            href="https://github.com/soudevictor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-text-muted hover:text-text-primary transition-colors group rounded-lg p-2 hover:bg-surface"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-text-primary transition-colors" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            <span>GitHub — soudevictor</span>
            <ExternalLink className="w-3 h-3 text-text-muted/50 ml-auto" />
          </a>
          <a
            href="https://www.linkedin.com/in/soudevictor/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-text-muted hover:text-text-primary transition-colors group rounded-lg p-2 hover:bg-surface"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-blue-400 transition-colors" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
            <span>LinkedIn — soudevictor</span>
            <ExternalLink className="w-3 h-3 text-text-muted/50 ml-auto" />
          </a>
        </div>
      </div>
    </div>
  );
}
