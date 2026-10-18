"use client";

import { useEffect, useRef } from "react";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CandidateHistoryItem } from "@/types";

const STORAGE_KEY = "talent_metrics_candidate_history";

export function loadCandidateHistory(): CandidateHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as CandidateHistoryItem[];
  } catch {
    return [];
  }
}

export function saveCandidateToHistory(item: CandidateHistoryItem): void {
  if (typeof window === "undefined") return;
  try {
    const history = loadCandidateHistory();
    const filtered = history.filter((h) => h.id !== item.id);
    const updated = [item, ...filtered].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable in some browser contexts
  }
}

/* ── Score Badge ────────────────────────────────────────────────────────── */
function fitBadge(score: number) {
  if (score >= 80) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/30">
        <TrendingUp className="w-3 h-3" aria-hidden="true" /> Forte Fit
      </span>
    );
  }
  if (score >= 60) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-elevated text-text-muted border border-border-subtle">
        <Minus className="w-3 h-3" aria-hidden="true" /> Fit Médio
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-surface-elevated text-text-muted border border-border-subtle">
      <TrendingDown className="w-3 h-3" aria-hidden="true" /> Baixo Fit
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ── Candidate Row ──────────────────────────────────────────────────────── */
function CandidateRow({ 
  candidate, 
  index, 
  isLatest 
}: { 
  candidate: CandidateHistoryItem; 
  index: number; 
  isLatest: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className={cn(
        "p-4 rounded-xl border bg-surface/40 transition-colors",
        isLatest
          ? "border-accent/30 bg-accent/5"
          : "border-border-subtle hover:border-border-hover"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isLatest && (
              <span className="text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                Mais recente
              </span>
            )}
            <h3 className="text-sm font-semibold text-text-primary truncate">
              {candidate.candidateName || `Candidato ${index + 1}`}
            </h3>
          </div>
          <p className="text-xs text-text-muted truncate">
            {candidate.jobTitle || "Vaga não especificada"} · {formatDate(candidate.analyzedAt)}
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          <span className="text-2xl font-extrabold tabular-nums text-text-primary">
            {candidate.score}
          </span>
          {fitBadge(candidate.score)}
        </div>
      </div>

      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-4">
        {candidate.summary}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
        <div>
          <p className="text-xs font-semibold text-text-muted mb-2">Pontos Fortes</p>
          <ul className="space-y-1.5">
            {candidate.matchingPoints.slice(0, 2).map((pt, i) => (
              <li key={i} className="text-sm text-text-primary flex items-start gap-2 break-words">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                <span className="flex-1 min-w-0">{pt}</span>
              </li>
            ))}
            {candidate.matchingPoints.length > 2 && (
              <li className="text-sm text-text-muted">
                +{candidate.matchingPoints.length - 2} mais
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-text-muted mb-2">A Melhorar</p>
          <ul className="space-y-1.5">
            {candidate.improvementPoints.slice(0, 2).map((pt, i) => (
              <li key={i} className="text-sm text-text-primary flex items-start gap-2 break-words">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="flex-1 min-w-0">{pt}</span>
              </li>
            ))}
            {candidate.improvementPoints.length > 2 && (
              <li className="text-sm text-text-muted">
                +{candidate.improvementPoints.length - 2} mais
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

/* ── Empty State ────────────────────────────────────────────────────────── */
function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
      <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center">
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-text-muted" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">
          Nenhum candidato no histórico
        </p>
        <p className="text-xs text-text-muted mt-1 max-w-xs">
          Analise ao menos um currículo para que ele apareça aqui.
        </p>
      </div>
    </div>
  );
}

/* ── Props ──────────────────────────────────────────────────────────────── */
interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateHistoryItem[];
}

/* ── Component ──────────────────────────────────────────────────────────── */
export function ComparisonDrawer({
  isOpen,
  onClose,
  candidates,
}: ComparisonDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  /* Trap focus & close on Escape */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "Tab" && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            last?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    drawerRef.current?.querySelector<HTMLElement>('[tabindex="0"], button')?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const maxScore = Math.max(...candidates.map((c) => c.score), 1);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Comparação de candidatos"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[480px] md:w-[600px] max-w-full bg-canvas border-l border-border-subtle z-50 flex flex-col shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle shrink-0">
              <div>
                <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                  Comparação de Candidatos
                  <span className="text-xs font-normal text-text-muted">({candidates.length})</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar painel de comparação"
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div
              className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-4"
              aria-live="polite"
            >
              {candidates.length === 0 ? (
                <EmptyHistory />
              ) : (
                <>
                  {/* Score Comparison Bar Chart */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-surface/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-text-muted">Score Relativo</p>
                      <span className="text-xs text-text-muted">
                        Maior: {maxScore}/100
                      </span>
                    </div>
                    {candidates.map((c, idx) => (
                      <div key={c.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-text-primary truncate flex-1 pr-2">
                            {c.candidateName || `Candidato ${idx + 1}`}
                          </span>
                          <span className="font-bold tabular-nums text-text-primary ml-2">
                            {c.score}
                            <span className="text-text-muted font-normal">/100</span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(c.score / maxScore) * 100}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.08, ease: "easeOut" }}
                            className="h-full rounded-full bg-accent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detail Cards */}
                  <div className="space-y-3">
                    {candidates.map((c, idx) => (
                      <CandidateRow
                        key={c.id}
                        candidate={c}
                        index={idx}
                        isLatest={idx === 0}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}