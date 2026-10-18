import { FeaturesSection } from "@/components/landing/features-section";
import { Header } from "@/components/landing/header";
import { HeroCtaButtons } from "@/components/landing/landing-cta-buttons";
import { HeroVideoBackground } from "@/components/landing/hero-video-background";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProductMockup } from "@/components/landing/product-mockup";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle2, Cpu, ShieldCheck, Zap } from "lucide-react";

/* ── Partner logo marquee data (Empresas Fictícias de Demonstração) ─────── */
const PARTNER_LOGOS = [
  { name: "ApexCorp", abbr: "Ax" },
  { name: "NexusTech", abbr: "Nx" },
  { name: "Veloce", abbr: "Ve" },
  { name: "Quantik", abbr: "Qk" },
  { name: "Stratos", abbr: "St" },
  { name: "Lumina", abbr: "Lu" },
  { name: "Omnia", abbr: "Om" },
  { name: "Horizon", abbr: "Hz" },
  { name: "Vertex", abbr: "Vx" },
  { name: "Pulse", abbr: "Pu" },
];

/* ── Marquee strip ──────────────────────────────────────────────────────── */
function PartnerMarquee() {
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS]; // doubled for seamless loop

  return (
    <div className="w-full overflow-hidden mt-16 py-8 border-y border-border-subtle relative">
      {/* fade edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none" />

      <p className="text-center text-sm text-text-muted/50 font-medium mb-5">
        Projetado para equipes de RH modernas e empresas de tecnologia
      </p>

      <div
        className="flex animate-marquee gap-12 whitespace-nowrap"
        aria-hidden="true"
      >
        {items.map((logo, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 shrink-0 px-4 py-2 rounded-lg border border-border-subtle bg-surface/40"
          >
            <div className="w-6 h-6 rounded bg-surface-elevated flex items-center justify-center text-xs font-bold text-text-muted">
              {logo.abbr}
            </div>
            <span className="text-sm font-medium text-text-muted">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page (Server Component — Suporte Nativo a SSG/ISR) ─────────────────── */
export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Hero Video Background with WebP fallback */}
      <HeroVideoBackground />

      {/* ── Header / Navbar (Client Island) ───────────────────────────── */}
      <Header />

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative z-10 pt-20 pb-0 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Live engine badge */}
        <AnimatedSection>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-glow border border-accent/25 text-accent text-xs sm:text-sm font-medium mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span>Groq LPU Engine&nbsp;·&nbsp;Operational</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary max-w-4xl leading-[1.1]">
            Transforme montanhas de currículos em{" "}
            <span className="text-accent">decisões estratégicas</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl font-normal leading-relaxed">
            Sua equipe de RH livre do trabalho braçal. Analise centenas de
            currículos por minuto com scoring objetivo, resumo inteligente e
            alinhamento com a vaga.
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.3}
          className="w-full flex flex-col items-center justify-center"
        >
          <HeroCtaButtons />

          {/* Trust highlights (Claims Técnicos e Transparentes) */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="w-4 h-4 text-accent"
                aria-hidden="true"
              />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="w-4 h-4 text-teal-400"
                aria-hidden="true"
              />
              <span>Processamento efêmero em memória</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Configuração em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <span>Triagem automatizada por IA</span>
            </div>
          </div>
        </AnimatedSection>

        {/* 2.5D Product mockup with tabs (Client Island) */}
        <AnimatedSection delay={0.4} className="w-full flex justify-center">
          <ProductMockup />
        </AnimatedSection>

        {/* Partner marquee */}
        <AnimatedSection delay={0.5} className="w-full">
          <PartnerMarquee />
        </AnimatedSection>
      </section>

      {/* ── Features Section ──────────────────────────────────────── */}
      <AnimatedSection>
        <FeaturesSection />
      </AnimatedSection>

      {/* ── Pricing Section ───────────────────────────────────────── */}
      <AnimatedSection>
        <PricingSection />
      </AnimatedSection>

      {/* ── Testimonials Section ──────────────────────────────────── */}
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="w-full border-t border-border-subtle py-8 px-4 text-center text-xs text-text-muted/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 TalentMetrics. Todos os direitos reservados.</p>
          <p>Projeto demonstrativo para fins de estudo e portfólio técnico.</p>
        </div>
      </footer>
    </div>
  );
}
