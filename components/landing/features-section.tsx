import { Cpu, Target, ShieldCheck, Zap, BarChart3, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Cpu,
    title: 'IA Generativa Especializada em RH',
    description: 'Algoritmos treinados especificamente em recrutamento e avaliação técnica sem vieses inconscientes.',
  },
  {
    icon: Target,
    title: 'Scoring de Fit com a Vaga',
    description: 'Pontuação de 0 a 100 calculada instantaneamente comparando os requisitos da vaga ao perfil do candidato.',
  },
  {
    icon: Clock,
    title: 'Triagem em Segundos',
    description: 'Reduza o tempo médio de primeira leitura de 14 dias para menos de 3 segundos por currículo.',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Executivos Automáticos',
    description: 'Pontos fortes, resumos e sugestões de perguntas para entrevistas gerados automaticamente.',
  },
  {
    icon: ShieldCheck,
    title: 'Conformidade LGPD & GDPR',
    description: 'Anonimização de dados pessoais e criptografia de ponta a ponta durante o processamento.',
  },
  {
    icon: Zap,
    title: 'Integrado ao seu Workflow',
    description: 'Exportação fácil de candidatos pré-selecionados diretamente para o seu ATS favorito.',
  },
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
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
          Elimine tarefas repetitivas de triagem e dedique seu tempo ao que realmente importa: conectar pessoas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:border-slate-700 transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
