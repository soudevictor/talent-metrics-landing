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
import { AlertCircle, FlaskConical, RotateCcw, BarChart2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const sampleResumes = sampleResumesData as SampleResume[];

/* ── AI Reasoning Stepper ───────────────────────────────────────────────── */
const REASONING_STEPS = [
  "📄  Extraindo e sanitizando estrutura do PDF...",
  "🎯  Mapeando hard e soft skills do candidato...",
  "⚖️  Comparando requisitos com a vaga informada...",
  "📊  Gerando matriz de fit e relatório executivo...",
] as const;

function AiReasoningStepper({ label }: { label?: string }) {
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % REASONING_STEPS.length);
    }, 600);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-4" aria-busy="true">
      <div className="flex flex-col items-center gap-2 text-center">
        {/* Spinner */}
        <div className="relative w-8 h-8">
          <span
            className="absolute inset-0 inline-block rounded-full border-2 border-accent border-t-transparent animate-spin"
            role="status"
            aria-label="Analisando currículo..."
          />
        </div>
        {label ? (
          <p className="text-xs text-text-muted font-medium">
            Analisando perfil{" "}
            <span className="text-text-primary font-semibold">
              &ldquo;{label}&rdquo;
            </span>
          </p>
        ) : null}

        {/* Animated step text */}
        <p
          key={stepIndex}
          className="text-sm text-accent font-medium tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {REASONING_STEPS[stepIndex]}
        </p>

        {/* Step indicator dots */}
        <div className="flex gap-1.5 mt-1" aria-hidden="true">
          {REASONING_STEPS.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === stepIndex ? "bg-accent" : "bg-surface-elevated"
              }`}
            />
          ))}
        </div>
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
      `Formato "${extension || 'desconhecido'}" não suportado. Envie apenas arquivos .pdf.`
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
  // Heuristic: grab first proper noun sequence from text as candidate name
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

  // Load history on mount and whenever drawer opens
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

        // Persist to localStorage history
        persistToHistory(
          validation.data,
          jobTitle?.trim() ?? "",
          resumeText
        );
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
          <div className="space-y-4">
            <Dropzone onFileSelect={handleFileSelect} />

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-xs text-text-muted font-medium">
                ou teste rapidamente
              </span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            {/* Quick-test buttons — neon badge style */}
            <div
              className="flex flex-wrap gap-2 justify-center"
              role="group"
              aria-label="Testes rápidos com currículos de exemplo"
            >
              {sampleResumes.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleQuickTest(sample)}
                  data-testid={`quick-test-${sample.id}`}
                  title={sample.description}
                  className="badge-neon-hover inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-accent/30 bg-accent/6 text-accent hover:bg-accent/12 hover:border-accent/50 hover:text-accent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas cursor-pointer"
                >
                  <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                  {sample.label}
                </button>
              ))}
            </div>

            {/* Compare button (visible when history exists) */}
            {history.length > 0 ? (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={openDrawer}
                  data-testid="open-comparison-drawer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-border-subtle bg-surface/40 text-text-muted hover:text-text-primary hover:border-border-hover hover:bg-surface transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <BarChart2 className="w-4 h-4 text-accent" aria-hidden="true" />
                  Comparar com Candidatos Anteriores
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                    {history.length}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Loading — AI Reasoning Stepper */}
        {state === "loading" ? <AiReasoningStepper label={activeLabel} /> : null}

        {/* Error State */}
        {state === "error" ? (
          <div className="space-y-4">
            <div
              role="alert"
              className="flex flex-col items-center gap-3 text-center p-6 rounded-2xl border border-red-500/20 bg-red-500/5"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-sm text-red-300 font-medium">
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
        ) : null}

        {/* Success State */}
        {state === "success" && result ? (
          <div className="space-y-4" aria-atomic="true">
            <ScoreCard data={result} />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="gap-2 text-text-muted hover:text-text-primary"
              >
                <RotateCcw className="w-4 h-4" />
                Analisar outro currículo
              </Button>

              {history.length > 1 ? (
                <button
                  type="button"
                  onClick={openDrawer}
                  data-testid="open-comparison-drawer-success"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-accent/30 bg-accent/8 text-accent hover:bg-accent/15 hover:border-accent/50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  <BarChart2 className="w-4 h-4" aria-hidden="true" />
                  Comparar com Anteriores
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold">
                    {history.length}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
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
