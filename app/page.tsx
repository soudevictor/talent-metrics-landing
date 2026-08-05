import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/animated-section';
import { NavCtaButtons, HeroCtaButtons } from '@/components/landing/landing-cta-buttons';
import { FeaturesSection } from '@/components/landing/features-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-blue-600/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-purple-600/5 blur-3xl -z-10 pointer-events-none" />

      {/* Header / Navbar */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md sticky top-9 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              TalentMetrics
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <Link href="/playground" className="hover:text-white transition-colors">Playground IA</Link>
            <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Depoimentos</a>
          </nav>

          <div className="flex items-center gap-3">
            <NavCtaButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <AnimatedSection>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Nova Era do RH: Triagem de Currículos por IA</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
            Transforme montanhas de currículos em{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              decisões estratégicas
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
            Sua equipe de RH livre do trabalho braçal. Analise centenas de currículos por minuto com scoring objetivo, resumo inteligente e alinhamento com a vaga.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          {/* CTAs */}
          <HeroCtaButtons />

          {/* Highlights */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>LGPD e GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Configuração em 5 minutos</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Preview Card Showcase */}
        <AnimatedSection delay={0.4} className="w-full flex justify-center">
          <div className="mt-16 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-purple-500/5" />
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-slate-400 font-mono ml-2">talent-metrics-ai-engine.v1</span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                Análise em Tempo Real
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">Score de Fit Cultural &amp; Técnico</div>
                <div className="text-3xl font-bold text-indigo-400">94 / 100</div>
                <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[94%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">Pontos Fortes Detectados</div>
                <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    +5 anos de exp. Next.js &amp; React
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Arquitetura de microsserviços
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">Pontos a Aprofundar</div>
                <ul className="text-xs text-slate-300 space-y-1.5 mt-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Validar tempo em liderança
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Checar certificações Cloud
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Features Section */}
      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>

      {/* Pricing Section */}
      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 TalentMetrics. Todos os direitos reservados.</p>
          <p>Desenvolvido para fins de demonstração técnica e estudo.</p>
        </div>
      </footer>
    </div>
  );
}
