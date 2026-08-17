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
    // Deduplicate by id and keep the most recent entry at the front
    const filtered = history.filter((h) => h.id !== item.id);
    const updated = [item, ...filtered].slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be unavailable in some browser contexts
  }
}

/* ── Score badge ────────────────────────────────────────────────────────── */
function fitBadge(score: number) {
  if (score >= 80)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/30">
        <TrendingUp className="w-3 h-3" aria-hidden="true" /> Forte Fit
      </span>
    );
  if (score >= 60)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Minus className="w-3 h-3" aria-hidden="true" /> Fit Médio
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
      <TrendingDown className="w-3 h-3" aria-hidden="true" /> Baixo Fit
    </span>
  );
}

function scoreBarColor(score: number): string {
  if (score >= 80) return "from-accent to-teal-400";
  if (score >= 60) return "from-amber-500 to-orange-400";
  return "from-red-500 to-rose-400";
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
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
                <h2 className="text-base font-semibold text-text-primary">
                  📊 Comparação de Candidatos
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Histórico local · últimos {candidates.length} analisados
                </p>
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
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-surface-elevated flex items-center justify-center">
                    <span className="text-2xl" aria-hidden="true">
                      📋
                    </span>
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
              ) : (
                <>
                  {/* Score comparison bar chart */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-surface/40 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                      Score Relativo
                    </p>
                    {candidates.map((c, idx) => (
                      <div key={c.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-text-primary truncate flex-1 pr-2">
                            {c.candidateName || `Candidato ${idx + 1}`}
                          </span>
                          <span className="font-bold tabular-nums text-text-primary ml-2">
                            {c.score}
                            <span className="text-text-muted font-normal">
                              /100
                            </span>
                          </span>
                        </div>
                        <div className="w-full h-2 bg-surface-elevated rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(c.score / maxScore) * 100}%`,
                            }}
                            transition={{
                              duration: 0.6,
                              delay: idx * 0.08,
                              ease: "easeOut",
                            }}
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              scoreBarColor(c.score)
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Detail cards */}
                  <div className="space-y-3">
                    {candidates.map((c, idx) => (
                      <article
                        key={c.id}
                        className={cn(
                          "p-4 rounded-xl border bg-surface/40 transition-colors",
                          idx === 0
                            ? "border-accent/30 bg-accent/5"
                            : "border-border-subtle"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {idx === 0 && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                                  Mais recente
                                </span>
                              )}
                              <h3 className="text-sm font-semibold text-text-primary truncate min-w-0">
                                {c.candidateName || `Candidato ${idx + 1}`}
                              </h3>
                            </div>
                            <p className="text-xs text-text-muted mt-0.5 truncate">
                              {c.jobTitle || "Vaga não especificada"} ·{" "}
                              {formatDate(c.analyzedAt)}
                            </p>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-1.5">
                            <span
                              className={cn(
                                "text-2xl font-extrabold tabular-nums",
                                c.score >= 80
                                  ? "text-accent"
                                  : c.score >= 60
                                    ? "text-amber-400"
                                    : "text-red-400"
                              )}
                            >
                              {c.score}
                            </span>
                            {fitBadge(c.score)}
                          </div>
                        </div>

                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-3">
                          {c.summary}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-2">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
                              Pontos Fortes
                            </p>
                            <ul className="space-y-0.5">
                              {c.matchingPoints.slice(0, 2).map((pt, i) => (
                                <li
                                  key={i}
                                  className="text-[11px] text-text-primary flex items-start gap-1.5 break-words"
                                >
                                  <span className="w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0" />
                                  <span className="flex-1 min-w-0">{pt}</span>
                                </li>
                              ))}
                              {c.matchingPoints.length > 2 && (
                                <li className="text-[11px] text-text-muted">
                                  +{c.matchingPoints.length - 2} mais
                                </li>
                              )}
                            </ul>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1">
                              A Melhorar
                            </p>
                            <ul className="space-y-0.5">
                              {c.improvementPoints.slice(0, 2).map((pt, i) => (
                                <li
                                  key={i}
                                  className="text-[11px] text-text-primary flex items-start gap-1.5 break-words"
                                >
                                  <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                  <span className="flex-1 min-w-0">{pt}</span>
                                </li>
                              ))}
                              {c.improvementPoints.length > 2 && (
                                <li className="text-[11px] text-text-muted">
                                  +{c.improvementPoints.length - 2} mais
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </article>
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
