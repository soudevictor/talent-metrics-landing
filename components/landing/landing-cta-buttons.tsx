'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ArrowRight, ExternalLink } from 'lucide-react';

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function NavCtaButtons() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsLoginOpen(true)}
      >
        Entrar
      </Button>
      <Link href="/playground">
        <Button variant="primary" size="sm">
          Testar Agora
        </Button>
      </Link>

      <FictitiousModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        title="Área de Login"
        description="Esta é uma funcionalidade fictícia do projeto demonstrativo."
      />
    </>
  );
}

export function HeroCtaButtons() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
      <Link href="/playground" className="w-full sm:w-auto">
        <Button
          variant="primary"
          size="lg"
          className="w-full py-8 gap-2 text-base shadow-lg shadow-indigo-600/25"
        >
          Experimentar Playground IA
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
      <Button
        variant="secondary"
        size="lg"
        className="w-full sm:w-auto py-8 text-base"
        onClick={() => setIsDemoOpen(true)}
      >
        Agendar Demonstração
      </Button>

      <FictitiousModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        title="Agendar Demonstração"
        description="Esta é uma funcionalidade fictícia do projeto demonstrativo."
      />
    </div>
  );
}

interface FictitiousModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

function FictitiousModal({ isOpen, onClose, title, description }: FictitiousModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-300 leading-relaxed">
          O <strong className="text-white">TalentMetrics</strong> é um{" "}
          <strong className="text-indigo-400">
            projeto demonstrativo para fins de estudo
          </strong>
          . Esta plataforma SaaS fictícia foi criada para demonstrar habilidades
          de engenharia front-end, integração com IA (Gemini) e design de
          interfaces modernas.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Conheça o desenvolvedor
          </p>
          <div className="flex flex-col gap-2">
            <a
              href="https://github.com/soudevictor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group"
            >
              <GithubIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
            </a>
            <a
              href="https://www.linkedin.com/in/soudevictor/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors group"
            >
              <LinkedinIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-500 ml-auto" />
            </a>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={onClose}>
            Entendido
          </Button>
        </div>
      </div>
    </Modal>
  );
}
