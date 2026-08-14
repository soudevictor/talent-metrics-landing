"use client";

import { Dropzone } from "@/components/playground/dropzone";
import { ScoreCard } from "@/components/playground/score-card";
import { SkeletonCard } from "@/components/playground/skeleton-card";
import { Button } from "@/components/ui/button";
import sampleResumesData from "@/data/sample-resumes.json";
import type { SampleResume } from "@/types";
import type { ResumeAnalysis } from "@/lib/schemas/resume-schema";
import { ResumeAnalysisSchema } from "@/lib/schemas/resume-schema";
import { AlertCircle, FlaskConical, RotateCcw } from "lucide-react";
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
            className="absolute inset-0 inline-block rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"
            role="status"
            aria-label="Analisando currículo..."
          />
        </div>
        {label ? (
          <p className="text-xs text-zinc-500 font-medium">
            Analisando perfil{" "}
            <span className="text-zinc-300 font-semibold">&ldquo;{label}&rdquo;</span>
          </p>
        ) : null}

        {/* Animated step text */}
        <p
          key={stepIndex}
          className="text-sm text-emerald-300 font-medium tabular-nums"
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
                i === stepIndex ? "bg-emerald-400" : "bg-zinc-700"
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

  if (extension === ".pdf") {
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

  const text = await file.text();
  return text
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

  const analyzeText = useCallback(
    async (resumeText: string) => {
      setState("loading");
      setResult(null);
      setErrorMessage("");

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
    [jobTitle]
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

  const activeLabel = activeQuickTest
    ? sampleResumes.find((s) => s.id === activeQuickTest)?.label
    : undefined;

  return (
    <div className="w-full space-y-6" aria-live="polite">
      {/* Empty State */}
      {state === "empty" ? (
        <div className="space-y-4">
          <Dropzone onFileSelect={handleFileSelect} />

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs text-zinc-500 font-medium">ou teste rapidamente</span>
            <div className="h-px flex-1 bg-zinc-800" />
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
                className="badge-neon-hover inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/6 text-emerald-300 hover:bg-emerald-500/12 hover:border-emerald-400/50 hover:text-emerald-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" aria-hidden="true" />
                {sample.label}
              </button>
            ))}
          </div>
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
            <p className="text-xs text-zinc-400 max-w-md">{errorMessage}</p>
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
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetry}
              className="gap-2 text-zinc-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Analisar outro currículo
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
