"use client";

import { Dropzone } from "@/components/playground/dropzone";
import { ScoreCard } from "@/components/playground/score-card";
import { SkeletonCard } from "@/components/playground/skeleton-card";
import {
  ComparisonDrawer,
  loadCandidateHistory,
  saveCandidateToHistory,
} from "@/components/playground/comparison-drawer";
import { Button } from "@/components/ui/button";
import sampleResumesData from "@/data/sample-resumes.json";
import type { SampleResume, CandidateHistoryItem } from "@/types";
import type { ResumeAnalysis } from "@/lib/schemas/resume-schema";
import { ResumeAnalysisSchema } from "@/lib/schemas/resume-schema";
import { AlertCircle, FlaskConical, RotateCcw, BarChart2, CheckCircle2, FileText, Clock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const sampleResumes = sampleResumesData as SampleResume[];

/* ── AI Reasoning Stepper — Progresso visual real ───────────────────────── */
const REASONING_STEPS = [
  { label: "Extraindo PDF", detail: "Lendo e sanitizando estrutura do documento" },
  { label: "Mapeando Skills", detail: "Identificando hard e soft skills do candidato" },
  { label: "Comparando Vaga", detail: "Alinhando requisitos com o perfil informado" },
  { label: "Gerando Relatório", detail: "Calculando fit e produzindo resumo executivo" },
] as const;

function AiReasoningStepper({ label }: { label?: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % REASONING_STEPS.length);
    }, 800);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [label]);

  // Reset stepIndex when label changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStepIndex(0);
  }, [label]);

  const currentStep = REASONING_STEPS[stepIndex];
  const progress = ((stepIndex + 1) / REASONING_STEPS.length) * 100;

  return (
    <div className="space-y-6" aria-busy="true" role="status" aria-live="polite">
      {/* Header com progresso */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-elevated" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progress * 2.83} 283`}
              className="text-accent transition-all duration-500 ease-out"
              stroke="currentColor"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-text-primary">{Math.round(progress)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">
            {label ? `Analisando: &ldquo;${label}&rdquo;` : "Analisando currículo..."}
          </p>
          <p className="text-xs text-text-muted">{currentStep.detail}</p>
        </div>
      </div>

      {/* Barra de progresso global */}
      <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Passos detalhados */}
      <div className="space-y-3" role="list" aria-label="Etapas da análise">
        {REASONING_STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
              i < stepIndex
                ? "bg-accent/5 border border-accent/20"
                : i === stepIndex
                ? "bg-surface border border-accent/30"
                : "bg-surface/50 border border-border-subtle"
            }`}
            role="listitem"
            aria-current={i === stepIndex ? "step" : undefined}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < stepIndex
                ? "bg-accent text-canvas"
                : i === stepIndex
                ? "bg-accent/10 text-accent border border-accent/30"
                : "bg-surface-elevated text-text-muted"
            }`}>
              {i < stepIndex ? (
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              ) : (
                i + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm ${i <= stepIndex ? "text-text-primary" : "text-text-muted"}`}>
                {step.label}
              </p>
              <p className="text-xs text-text-muted truncate">{step.detail}</p>
            </div>
            {i === stepIndex && (
              <span className="w-4 h-4 rounded-full bg-accent animate-pulse" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <SkeletonCard />
    </div>
  );
}

/* ── Text extraction ─────────────────────────────────────────────────────── */
async function extractText(file: File): Promise<string> {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (extension !== ".pdf") {
    throw new Error(
      `Formato "${extension || 'desconhecido'}" não suportado. Envie apenas arquivos .pdf.`,
    );
  }

  const pdfjsLib = await import("pdfjs-dist");
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: unknown) => {
        const i = item as { str?: string };
        return typeof i.str === "string" ? i.str : "";
      })
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

/* ── Persist analysis to localStorage history ───────────────────────────── */
function persistToHistory(
  result: ResumeAnalysis,
  jobTitle: string,
  resumeText: string
): void {
  const nameMatch = resumeText.match(/^([A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+(?:\s+[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+){1,3})/m);
  const candidateName = nameMatch?.[1]?.trim() ?? "Candidato";

  const item: CandidateHistoryItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    candidateName,
    jobTitle: jobTitle.trim() || "Vaga não especificada",
    score: result.score,
    analyzedAt: new Date().toISOString(),
    summary: result.summary,
    matchingPoints: result.matchingPoints,
    improvementPoints: result.improvementPoints,
    matchPercentageByRole: result.matchPercentageByRole,
  };

  saveCandidateToHistory(item);
}

/* ── Quick Test Card — Visual card para currículos de exemplo ───────────── */
function QuickTestCard({ 
  sample, 
  onClick, 
  isActive 
}: { 
  sample: SampleResume; 
  onClick: () => void; 
  isActive: boolean; 
}) {
  return (
    <button
      onClick={onClick}
      data-testid={`quick-test-${sample.id}`}
      className={`relative group flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
        isActive
          ? "border-accent/50 bg-accent/5 shadow-lg shadow-accent/10"
          : "border-border-subtle bg-surface/40 hover:border-border-hover hover:bg-surface hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          isActive ? "bg-accent/10 text-accent" : "bg-surface-elevated text-text-muted"
        }`}>
          <FlaskConical className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-text-primary truncate">{sample.label}</p>
          <p className="text-xs text-text-muted mt-0.5 truncate">{sample.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-text-muted">
        <FileText className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>PDF</span>
        <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
        <span>~2s</span>
      </div>
      {isActive && (
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-canvas" aria-hidden="true" />
        </div>
      )}
    </button>
  );
}

/* ── Component ──────────────────────────────────────────────────────────── */
type PlaygroundState = "empty" | "loading" | "error" | "success";

interface PlaygroundSectionProps {
  jobTitle?: string;
}

export function PlaygroundSection({ jobTitle }: PlaygroundSectionProps) {
  const [state, setState] = useState<PlaygroundState>("empty");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeQuickTest, setActiveQuickTest] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [history, setHistory] = useState<CandidateHistoryItem[]>([]);
  const lastResumeText = useRef<string>("");

  const refreshHistory = useCallback(() => {
    setHistory(loadCandidateHistory());
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshHistory();
  }, [refreshHistory]);

  const analyzeText = useCallback(
    async (resumeText: string) => {
      setState("loading");
      setResult(null);
      setErrorMessage("");
      lastResumeText.current = resumeText;

      try {
        const payload = {
          resumeText,
          jobTitle: jobTitle?.trim() ?? "",
        };

        const response = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let raw: unknown = null;
        try {
          raw = await response.json();
        } catch {
          raw = null;
        }

        if (!response.ok) {
          const errorData = raw as { error?: string } | null;
          throw new Error(
            errorData?.error ??
              `Erro no servidor (${response.status}). Não foi possível analisar o currículo.`
          );
        }

        if (!raw) throw new Error("Resposta vazia da API.");

        const validation = ResumeAnalysisSchema.safeParse(raw);
        if (!validation.success) {
          throw new Error("Resposta da IA fora do formato esperado.");
        }

        persistToHistory(validation.data, jobTitle?.trim() ?? "", resumeText);
        refreshHistory();

        setResult(validation.data);
        setState("success");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Erro inesperado ao analisar o currículo.";
        setErrorMessage(message);
        setState("error");
      }
    },
    [jobTitle, refreshHistory]
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      setActiveQuickTest(null);
      const resumeText = await extractText(file).catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Erro ao ler o arquivo.";
        setErrorMessage(message);
        setState("error");
        return null;
      });
      if (resumeText !== null) await analyzeText(resumeText);
    },
    [analyzeText]
  );

  const handleQuickTest = useCallback(
    async (sample: SampleResume) => {
      setActiveQuickTest(sample.id);
      await analyzeText(sample.content);
    },
    [analyzeText]
  );

  const handleRetry = useCallback(() => {
    setState("empty");
    setResult(null);
    setErrorMessage("");
    setActiveQuickTest(null);
  }, []);

  const openDrawer = useCallback(() => {
    refreshHistory();
    setIsDrawerOpen(true);
  }, [refreshHistory]);

  const activeLabel = activeQuickTest
    ? sampleResumes.find((s) => s.id === activeQuickTest)?.label
    : undefined;

  return (
    <>
      <div className="w-full space-y-6" aria-live="polite">
        {/* Empty State */}
        {state === "empty" ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Dropzone onFileSelect={handleFileSelect} />

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-xs text-text-muted font-medium px-3">
                ou teste com exemplos
              </span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            {/* Quick-test cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sampleResumes.map((sample) => (
                <QuickTestCard
                  key={sample.id}
                  sample={sample}
                  onClick={() => handleQuickTest(sample)}
                  isActive={activeQuickTest === sample.id}
                />
              ))}
            </div>

            {/* Compare button */}
            {history.length > 0 && (
              <button
                type="button"
                onClick={openDrawer}
                data-testid="open-comparison-drawer"
                className="mx-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-border-subtle bg-surface/40 text-text-muted hover:text-text-primary hover:border-border-hover hover:bg-surface hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                <BarChart2 className="w-4 h-4 text-accent" aria-hidden="true" />
                Comparar com {history.length} candidato{history.length > 1 ? "s" : ""} anterior{history.length > 1 ? "es" : ""}
              </button>
            )}
          </div>
        ) : null}

        {/* Loading — AI Reasoning Stepper */}
        {state === "loading" && (
          <AiReasoningStepper label={activeLabel} />
        )}

        {/* Error State */}
        {state === "error" && (
          <div className="space-y-4 animate-in fade-in duration-200 slide-in-from-top-2">
            <div
              role="alert"
              aria-live="assertive"
              className="relative p-6 rounded-2xl border border-red-500/30 bg-red-500/5"
            >
              <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-canvas border border-red-500/30 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-medium text-text-primary">
                  Não foi possível analisar o currículo
                </p>
                <p className="text-xs text-text-muted max-w-md">{errorMessage}</p>
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
          </div>
        )}

        {/* Success State */}
        {state === "success" && result && (
          <div className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2" aria-atomic="true">
            <ScoreCard data={result} />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="gap-2 text-text-muted hover:text-text-primary"
              >
                <RotateCcw className="w-4 h-4" />
                Analisar outro currículo
              </Button>

              {history.length > 1 && (
                <button
                  type="button"
                  onClick={openDrawer}
                  data-testid="open-comparison-drawer-success"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <BarChart2 className="w-4 h-4" aria-hidden="true" />
                  Comparar com {history.length} candidatos
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Drawer */}
      <ComparisonDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        candidates={history}
      />
    </>
  );
}