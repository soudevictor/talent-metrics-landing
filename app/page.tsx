"use client";

import { FeaturesSection } from "@/components/landing/features-section";
import {
  HeroCtaButtons,
  NavCtaButtons,
} from "@/components/landing/landing-cta-buttons";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* ── Partner logo marquee data ─────────────────────────────────────────── */
const PARTNER_LOGOS = [
  { name: "Nubank", abbr: "Nu" },
  { name: "iFood", abbr: "iF" },
  { name: "Totvs", abbr: "To" },
  { name: "Movile", abbr: "Mv" },
  { name: "RD Station", abbr: "RD" },
  { name: "Creditas", abbr: "Cr" },
  { name: "Linx", abbr: "Lx" },
  { name: "QuintoAndar", abbr: "Q5" },
  { name: "Gympass", abbr: "Gp" },
  { name: "Loggi", abbr: "Lg" },
];

/* ── Product mockup tab data ────────────────────────────────────────────── */
const MOCK_TABS = ["Visão do RH", "Análise do Algoritmo"] as const;
type MockTab = (typeof MOCK_TABS)[number];

function ProductMockup() {
  const [activeTab, setActiveTab] = useState<MockTab>("Visão do RH");

  return (
    <div className="mt-16 w-full max-w-4xl rounded-2xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/3 via-transparent to-teal-500/3 pointer-events-none" />

      {/* Window chrome */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-zinc-800/80">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-xs text-zinc-500 font-mono ml-2 flex-1">
          talent-metrics-ai-engine · v2.0
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          Llama 3.3 · Online
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-3 border-b border-zinc-800/50">
        {MOCK_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeTab === tab
                ? "bg-zinc-800/60 text-white border border-zinc-700/60 border-b-zinc-800/60 -mb-px"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-6">
        {activeTab === "Visão do RH" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {/* Score */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
              <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">
                Score de Fit
              </div>
              <div className="text-3xl font-bold text-emerald-400 tabular-nums">
                94 / 100
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                  style={{ width: "94%" }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400 font-medium">
                  Top 3% da pool
                </span>
              </div>
            </div>

            {/* Matching points */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
              <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">
                Pontos Fortes
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 mt-1">
                {[
                  "5+ anos Next.js & React",
                  "Arquitetura microsserviços",
                  "AWS Certified SA",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/20 transition-colors">
              <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">
                A Aprofundar
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 mt-1">
                {[
                  "Validar exp. liderança",
                  "Checar certs. Cloud",
                  "Inglês avançado",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-left font-mono text-xs">
            {[
              {
                step: "01",
                label: "pdf_parser",
                detail: "Extracted 1,847 tokens from resume.pdf",
                color: "text-zinc-400",
              },
              {
                step: "02",
                label: "skill_mapper",
                detail: "Detected 14 hard skills · 6 soft skills",
                color: "text-zinc-400",
              },
              {
                step: "03",
                label: "jd_comparator",
                detail: "JD match threshold: 0.89 cosine similarity",
                color: "text-emerald-400",
              },
              {
                step: "04",
                label: "fit_scorer",
                detail: "Score: 94.2 · Percentile: P97 in talent pool",
                color: "text-emerald-400",
              },
              {
                step: "05",
                label: "report_generator",
                detail: "✓ Executive summary generated in 1.4s",
                color: "text-teal-400",
              },
            ].map((row) => (
              <div
                key={row.step}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/60"
              >
                <span className="text-zinc-600 shrink-0">[{row.step}]</span>
                <span className="text-indigo-400 shrink-0 w-32">
                  {row.label}
                </span>
                <span className={row.color}>{row.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Marquee strip ──────────────────────────────────────────────────────── */
function PartnerMarquee() {
  const items = [...PARTNER_LOGOS, ...PARTNER_LOGOS]; // doubled for seamless loop

  return (
    <div className="w-full overflow-hidden mt-16 py-8 border-y border-zinc-800/60 relative">
      {/* fade edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

      <p className="text-center text-xs text-zinc-600 font-medium uppercase tracking-widest mb-5">
        Confiado por equipes de RH em todo o Brasil
      </p>

      <div
        className="flex animate-marquee gap-12 whitespace-nowrap"
        aria-hidden="true"
      >
        {items.map((logo, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2 shrink-0 px-4 py-2 rounded-lg border border-zinc-800/60 bg-zinc-900/40"
          >
            <div className="w-6 h-6 rounded bg-zinc-700/60 flex items-center justify-center text-xs font-bold text-zinc-300">
              {logo.abbr}
            </div>
            <span className="text-sm font-medium text-zinc-400">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col justify-between">
      {/* Radial glow — emerald/teal replacing generic indigo-purple */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,transparent_70%)] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-teal-500/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-emerald-600/4 blur-3xl -z-10 pointer-events-none" />

      {/* ── Header / Navbar ─────────────────────────────────────────── */}
      <header className="w-full border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <img
            src="/logo.svg"
            alt="TalentMetrics"
            width={150}
            height={64}
          />

          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">
              Recursos
            </a>
            <Link
              href="/playground"
              className="hover:text-white transition-colors"
            >
              Playground IA
            </Link>
            <a href="#pricing" className="hover:text-white transition-colors">
              Planos
            </a>
            <a
              href="#testimonials"
              className="hover:text-white transition-colors"
            >
              Depoimentos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <NavCtaButtons />
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-0 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Live engine badge */}
        <AnimatedSection>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/8 border border-emerald-500/25 text-emerald-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>Llama 3.3 Engine&nbsp;·&nbsp;Operational</span>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.1]">
            Transforme montanhas de currículos em{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              decisões estratégicas
            </span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl font-normal leading-relaxed">
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

          {/* Trust highlights */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="w-4 h-4 text-emerald-400"
                aria-hidden="true"
              />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="w-4 h-4 text-teal-400"
                aria-hidden="true"
              />
              <span>LGPD e GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>Configuração em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <span>+500 times de RH</span>
            </div>
          </div>
        </AnimatedSection>

        {/* 2.5D Product mockup with tabs */}
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
      <footer className="w-full border-t border-zinc-800/80 py-8 px-4 text-center text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 TalentMetrics. Todos os direitos reservados.</p>
          <p>Desenvolvido para fins de demonstração técnica e estudo.</p>
        </div>
      </footer>
    </div>
  );
}
