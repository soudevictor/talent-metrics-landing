'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlaygroundSection } from '@/components/playground/playground-section';
import { ArrowLeft, Sparkles, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JOB_TITLE_DESCRIPTION_ID = 'job-title-description';

export function PlaygroundClient() {
  const [jobTitle, setJobTitle] = useState('');

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-600/15 via-indigo-600/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-indigo-600/5 blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Voltar à Landing Page</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TalentMetrics
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
        {/* Page Heading */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-purple-400" aria-hidden="true" />
            <span>Demo Gratuita</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Teste a Análise com IA
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Envie um currículo em PDF ou DOCX e veja em tempo real como nossa IA avalia o
            perfil do candidato.
          </p>
        </div>

        {/* Job Title Contextualization */}
        <div className="w-full max-w-xl mx-auto">
          <label
            htmlFor="job-title-input"
            className="flex items-center gap-2 text-sm font-medium text-slate-200 mb-2"
          >
            <Briefcase className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            Vaga-alvo (opcional)
          </label>
          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Ex: Desenvolvedor Front-End Senior"
            aria-describedby={JOB_TITLE_DESCRIPTION_ID}
            className="w-full h-11 px-4 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-100 text-sm placeholder:text-slate-500 backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:border-indigo-500 hover:border-slate-600"
          />
          <p
            id={JOB_TITLE_DESCRIPTION_ID}
            className="mt-1.5 text-xs text-slate-500"
          >
            Informe a vaga para obter uma análise contextualizada ao perfil desejado.
          </p>
        </div>

        {/* Playground Section (Dropzone + Results) */}
        <div className="w-full max-w-xl mx-auto">
          <PlaygroundSection jobTitle={jobTitle} />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
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
