import { Cpu, Target, ShieldCheck, Zap, BarChart3, Clock } from 'lucide-react';
import featuresData from '@/data/features.json';
import type { Feature } from '@/types';

type IconComponent = React.ComponentType<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Cpu,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
};

const features = featuresData as Feature[];

/* ── ATS Integration logos (fictícios, apenas demonstração) ─────────────── */
const ATS_INTEGRATIONS = [
  'OpenATS',
  'TalentFlow',
  'RecruiterHub',
  'StaffSync',
  'CoreHR',
];

/* ── Ícone dentro de círculo (desenho em código, paleta única) ─────────── */
function FeatureIcon({ iconName, size = 'w-10 h-10' }: { iconName: string; size?: string }) {
  const Icon = ICON_MAP[iconName];
  if (!Icon) return null;
  return (
    <div className={`${size} rounded-xl bg-accent-glow border border-accent/20 flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
    </div>
  );
}

/* ── Linha de feature: ícone à esquerda, conteúdo à direita ────────────── */
function FeatureRowLeftIcon({ feature }: { feature: Feature }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-3 flex items-center justify-center lg:justify-start">
        <FeatureIcon iconName={feature.iconName} size="w-14 h-14" />
      </div>
      <div className="lg:col-span-9">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
        <p className="text-base text-text-muted leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}

/* ── Linha de feature: conteúdo à esquerda, ícone à direita ────────────── */
function FeatureRowRightIcon({ feature }: { feature: Feature }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-9">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
        <p className="text-base text-text-muted leading-relaxed">{feature.description}</p>
      </div>
      <div className="lg:col-span-3 flex items-center justify-center lg:justify-end">
        <FeatureIcon iconName={feature.iconName} size="w-14 h-14" />
      </div>
    </div>
  );
}

/* ── Linha de feature: ícone à esquerda, conteúdo à direita, faixa larga ─ */
function FeatureRowFull({ feature }: { feature: Feature }) {
  return (
    <div className="flex items-start gap-6">
      <div className="flex-shrink-0">
        <FeatureIcon iconName={feature.iconName} size="w-12 h-12" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">{feature.title}</h3>
        <p className="text-base text-text-muted leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Tudo o que seu RH precisa
        </h2>
        <p className="mt-4 text-text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Elimine tarefas repetitivas de triagem e dedique seu tempo ao que realmente importa: conectar pessoas.
        </p>
      </div>

      {/* Par 1 — layout variado: ícone à esquerda, conteúdo à direita */}
      <div className="mb-16 space-y-12">
        {features.slice(0, 2).map((feature) => (
          <FeatureRowLeftIcon key={feature.id} feature={feature} />
        ))}
      </div>

      {/* Par 2 — layout variado: conteúdo à esquerda, ícone à direita */}
      <div className="mb-16 space-y-12">
        {features.slice(2, 4).map((feature) => (
          <FeatureRowRightIcon key={feature.id} feature={feature} />
        ))}
      </div>

      {/* Par 3 — layout variado: faixas largas com ícone pequeno à esquerda */}
      <div className="space-y-12">
        {features.slice(4, 6).map((feature) => (
          <FeatureRowFull key={feature.id} feature={feature} />
        ))}
      </div>

      {/* ATS Integrations sub-section (sem vidro, gradientes ou monospace) */}
      <div className="mt-24 rounded-2xl border border-border-subtle bg-surface p-8 sm:p-10">
        <div className="text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Compatível com seu stack de RH
          </h3>
          <p className="mt-3 text-text-muted text-base max-w-xl mx-auto">
            Exporte candidatos pré-qualificados diretamente para os principais sistemas de rastreamento do mercado — sem atrito, sem retrabalho.
          </p>
          <p className="mt-2 text-sm text-text-muted/70">
            Integrações fictícias, usadas apenas para demonstração.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {ATS_INTEGRATIONS.map((name) => (
            <div
              key={name}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border border-border-subtle bg-surface-elevated hover:border-border-hover transition-colors"
            >
              <span className="text-sm font-semibold text-text-primary">{name}</span>
              <span className="text-xs text-text-muted border border-border-subtle px-1.5 py-0.5 rounded">
                API
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-text-muted/70 mt-6">
          Mais integrações disponíveis via webhook e API REST.
        </p>
      </div>
    </section>
  );
}
