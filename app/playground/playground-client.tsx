"use client";

import { PlaygroundSection } from "@/components/playground/playground-section";
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const JOB_TITLE_DESCRIPTION_ID = "job-title-description";

export function PlaygroundClient() {
  const [jobTitle, setJobTitle] = useState("");

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Masked grid background layer */}
      <div className="bg-grid-masked" aria-hidden="true" />

      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.10)_0%,transparent_70%)] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-teal-500/4 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-border-subtle bg-canvas/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>

          <Image
            src="/logo.svg"
            alt="TalentMetrics"
            width={140}
            height={64}
            style={{ width: 140, height: "auto" }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Page Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-glow border border-accent/25 text-accent text-xs sm:text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span>Groq LPU Engine · Operational</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Teste a Análise com IA
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-lg mx-auto">
            Envie um currículo em PDF ou DOCX e veja em tempo real como nossa IA
            avalia o perfil do candidato.
          </p>
        </div>

        {/* Job Title Contextualization */}
        <div className="w-full max-w-xl mx-auto">
          <label
            htmlFor="job-title-input"
            className="flex items-center gap-2 text-sm font-medium text-text-primary mb-2"
          >
            <Briefcase
              className="w-4 h-4 text-accent"
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
            className="w-full h-11 px-4 rounded-xl border border-border-subtle bg-surface text-text-primary text-sm placeholder:text-text-muted/50 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas focus:border-accent hover:border-border-hover"
          />
          <p
            id={JOB_TITLE_DESCRIPTION_ID}
            className="mt-1.5 text-xs text-text-muted/60"
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
      <footer className="w-full border-t border-border-subtle py-6 px-4 text-center text-xs text-text-muted/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 TalentMetrics. Projeto demonstrativo.</p>
          <Link href="/" className="hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
            ← Voltar à página principal
          </Link>
        </div>
      </footer>
    </div>
  );
}
