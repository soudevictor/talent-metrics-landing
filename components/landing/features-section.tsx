import { Cpu, Target, ShieldCheck, Zap, BarChart3, Clock, type LucideProps } from 'lucide-react';
import featuresData from '@/data/features.json';
import type { Feature } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type IconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;

const ICON_MAP: Record<string, IconComponent> = {
  Cpu,
  Target,
  ShieldCheck,
  Zap,
  BarChart3,
  Clock,
};

const features = featuresData as Feature[];

/* ── ATS Integration logos ──────────────────────────────────────────────── */
const ATS_INTEGRATIONS = [
  { name: 'Workday',     color: 'from-blue-500/20 to-blue-600/10',   text: 'text-blue-300',    border: 'border-blue-500/20'   },
  { name: 'Greenhouse',  color: 'from-green-500/20 to-green-600/10', text: 'text-green-300',   border: 'border-green-500/20'  },
  { name: 'Lever',       color: 'from-violet-500/20 to-violet-600/10', text: 'text-violet-300', border: 'border-violet-500/20' },
  { name: 'BambooHR',    color: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-300', border: 'border-emerald-500/20' },
  { name: 'Gupy',        color: 'from-orange-500/20 to-orange-600/10', text: 'text-orange-300', border: 'border-orange-500/20' },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
      <div className="text-center mb-16">
        <Badge variant="indigo" className="mb-4">
          Recursos Principais
        </Badge>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Tudo o que sua equipe precisa para{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            contratar melhor
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">
          Elimine tarefas repetitivas de triagem e dedique seu tempo ao que realmente importa: conectar pessoas.
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = ICON_MAP[feature.iconName];
          return (
            <Card
              key={feature.id}
              className="group hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
            >
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/15 transition-colors">
                  {Icon ? <Icon className="w-5 h-5 text-indigo-400" aria-hidden="true" /> : null}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* ATS Integrations sub-section */}
      <div className="mt-20 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <Badge variant="emerald" className="mb-3">
            Integrações ATS
          </Badge>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Compatível com seu stack de RH
          </h3>
          <p className="mt-3 text-zinc-400 text-sm max-w-xl mx-auto">
            Exporte candidatos pré-qualificados diretamente para os principais sistemas de rastreamento do mercado — sem atrito, sem retrabalho.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {ATS_INTEGRATIONS.map((ats) => (
            <div
              key={ats.name}
              className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border ${ats.border} bg-gradient-to-br ${ats.color} backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <div className={`w-2.5 h-2.5 rounded-full bg-current ${ats.text} opacity-70`} />
              <span className={`text-sm font-semibold ${ats.text}`}>{ats.name}</span>
              <span className="text-xs text-zinc-500 border border-zinc-700/50 px-1.5 py-0.5 rounded font-mono">
                API
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          Mais integrações disponíveis via webhook e API REST.
        </p>
      </div>
    </section>
  );
}
