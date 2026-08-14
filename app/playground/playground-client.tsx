"use client";

import { PlaygroundSection } from "@/components/playground/playground-section";
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const JOB_TITLE_DESCRIPTION_ID = "job-title-description";

export function PlaygroundClient() {
  const [jobTitle, setJobTitle] = useState("");

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10)_0%,transparent_70%)] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-teal-500/4 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Voltar à Landing Page</span>
          </Link>

          <img
            src="/logo.svg"
            alt="TalentMetrics"
            width={150}
            height={64}
          />
        </div>
      </header>

      {/* Main Content */}

      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Page Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs sm:text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Demo Gratuita · Llama 3.3 Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Teste a Análise com IA
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
            Envie um currículo em PDF ou DOCX e veja em tempo real como nossa IA
            avalia o perfil do candidato.
          </p>
        </div>

        {/* Job Title Contextualization */}
        <div className="w-full max-w-xl mx-auto">
          <label
            htmlFor="job-title-input"
            className="flex items-center gap-2 text-sm font-medium text-zinc-200 mb-2"
          >
            <Briefcase
              className="w-4 h-4 text-emerald-400"
              aria-hidden="true"
            />
            Vaga-alvo (opcional)
          </label>
          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Front-End Senior"
            aria-describedby={JOB_TITLE_DESCRIPTION_ID}
            className="w-full h-11 px-4 rounded-xl border border-zinc-700/80 bg-zinc-900/60 text-zinc-100 text-sm placeholder:text-zinc-600 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:border-emerald-500 hover:border-zinc-600"
          />
          <p
            id={JOB_TITLE_DESCRIPTION_ID}
            className="mt-1.5 text-xs text-zinc-600"
          >
            Informe a vaga para obter uma análise contextualizada ao perfil
            desejado.
          </p>
        </div>

        {/* Playground Section (Dropzone + Results) */}
        <div className="w-full max-w-xl mx-auto">
          <PlaygroundSection jobTitle={jobTitle} />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/80 py-6 px-4 text-center text-xs text-zinc-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 TalentMetrics. Projeto demonstrativo.</p>
          <Link href="/" className="hover:text-white transition-colors">
            ← Voltar à página principal
          </Link>
        </div>
      </footer>
    </div>
  );
}
