'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { ExternalLink } from 'lucide-react';

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

interface PricingCtaButtonProps {
  label: string;
  isPopular: boolean;
}

export function PricingCtaButton({ label, isPopular }: PricingCtaButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={isPopular ? 'primary' : 'outline'}
        size="lg"
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        {label}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Plano Demonstrativo"
        description="Os planos apresentados são fictícios e fazem parte de um projeto de estudo."
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted leading-relaxed">
            O <strong className="text-text-primary">TalentMetrics</strong> é um{' '}
            <strong className="text-accent">
              projeto demonstrativo para fins de estudo
            </strong>
            . Os planos de preço exibidos são ficcionais e não geram cobranças
            reais.
          </p>

          <p className="text-sm text-text-muted leading-relaxed">
            Para testar a funcionalidade de análise de currículos com IA, acesse
            o <strong className="text-accent">Playground</strong> clicando
            em &quot;Testar Agora&quot; na página principal.
          </p>

          <div className="rounded-xl border border-border-subtle bg-canvas/60 p-4 space-y-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Conheça o desenvolvedor
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://github.com/soudevictor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
              >
                <GithubIcon className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3 text-text-muted/50 ml-auto" />
              </a>
              <a
                href="https://www.linkedin.com/in/soudevictor/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors group"
              >
                <LinkedinIcon className="w-4 h-4 text-text-muted group-hover:text-blue-400 transition-colors" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 text-text-muted/50 ml-auto" />
              </a>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Entendido
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
