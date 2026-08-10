"use client";

import { Dropzone } from "@/components/playground/dropzone";
import { ScoreCard } from "@/components/playground/score-card";
import { SkeletonCard } from "@/components/playground/skeleton-card";
import { Button } from "@/components/ui/button";
import type { ResumeAnalysis } from "@/lib/schemas/resume-schema";
import { ResumeAnalysisSchema } from "@/lib/schemas/resume-schema";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";

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
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  }

  // Basic fallback for other text-based files
  const text = await file.text();
  return text
    .replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type PlaygroundState = "empty" | "loading" | "error" | "success";

interface PlaygroundSectionProps {
  jobTitle?: string;
}

export function PlaygroundSection({ jobTitle }: PlaygroundSectionProps) {
  const [state, setState] = useState<PlaygroundState>("empty");
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileSelect = useCallback(
    async (file: File) => {
      setState("loading");
      setResult(null);
      setErrorMessage("");

      try {
        const resumeText = await extractText(file);

        const payload = {
          resumeText,
          jobTitle: jobTitle?.trim() || "",
        };

        const response = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
            errorData?.error ||
              `Erro no servidor (${response.status}). Não foi possível analisar o currículo.`,
          );
        }

        if (!raw) {
          throw new Error("Resposta vazia da API.");
        }

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
    [jobTitle],
  );

  const handleRetry = useCallback(() => {
    setState("empty");
    setResult(null);
    setErrorMessage("");
  }, []);

  return (
    <div className="w-full space-y-6" aria-live="polite">
      {/* Empty State — Dropzone */}
      {state === "empty" ? <Dropzone onFileSelect={handleFileSelect} /> : null}

      {/* Loading State — Skeleton */}
      {state === "loading" ? (
        <div className="space-y-4" aria-busy="true">
          <div className="flex items-center justify-center gap-2 text-sm text-indigo-300">
            <span
              className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"
              role="status"
              aria-label="Analisando currículo..."
            />
            <span>Analisando currículo com IA...</span>
          </div>
          <SkeletonCard />
        </div>
      ) : null}

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
            <p className="text-xs text-slate-400 max-w-md">{errorMessage}</p>
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
              className="gap-2 text-slate-400 hover:text-white"
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
