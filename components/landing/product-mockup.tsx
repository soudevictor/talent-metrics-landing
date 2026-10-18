"use client";

import { TrendingUp } from "lucide-react";
import { useState } from "react";

const MOCK_TABS = ["Visão do RH", "Análise do Algoritmo"] as const;
type MockTab = (typeof MOCK_TABS)[number];

export function ProductMockup() {
  const [activeTab, setActiveTab] = useState<MockTab>("Visão do RH");

  return (
    <div className="mt-16 w-full max-w-4xl rounded-2xl border border-border-subtle bg-surface relative overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-border-subtle">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-accent/70" />
        </div>
        <span className="text-xs text-text-muted ml-2 flex-1 truncate hidden xs:block">
          talent-metrics-ai-engine · v2.0
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-accent-glow text-accent border border-accent/20 font-medium shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-status-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Groq LPU Engine · Operational
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-3 border-b border-border-subtle/50">
        {MOCK_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium rounded-t-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              activeTab === tab
                ? "bg-surface-elevated text-text-primary border border-border-subtle border-b-surface-elevated -mb-px"
                : "text-text-muted hover:text-text-primary"
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
            <div className="p-4 rounded-xl bg-canvas/60 border border-border-subtle hover:border-border-hover transition-colors">
              <div className="text-xs text-text-muted mb-2 font-medium">
                Score de Fit
              </div>
              <div className="text-3xl font-bold text-accent tabular-nums">
                94 / 100
              </div>
              <div className="w-full bg-surface-elevated h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-accent h-full rounded-full" style={{ width: "94%" }} />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent font-medium">
                  Top 3% da pool
                </span>
              </div>
            </div>

            {/* Matching points */}
            <div className="p-4 rounded-xl bg-canvas/60 border border-border-subtle hover:border-border-hover transition-colors">
              <div className="text-xs text-text-muted mb-2 font-medium">
                Pontos Fortes
              </div>
              <ul className="text-xs text-text-primary space-y-2 mt-1">
                {[
                  "5+ anos Next.js & React",
                  "Arquitetura microsserviços",
                  "AWS Certified SA",
                ].map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="p-4 rounded-xl bg-canvas/60 border border-border-subtle hover:border-border-hover transition-colors">
              <div className="text-xs text-text-muted mb-2 font-medium">
                A Aprofundar
              </div>
              <ul className="text-xs text-text-primary space-y-2 mt-1">
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
          <div className="space-y-3 text-left text-xs">
            {[
              {
                label: "pdf_parser",
                detail: "Extracted 1,847 tokens from resume.pdf",
                color: "text-text-muted",
              },
              {
                label: "skill_mapper",
                detail: "Detected 14 hard skills · 6 soft skills",
                color: "text-text-muted",
              },
              {
                label: "jd_comparator",
                detail: "JD match threshold: 0.89 cosine similarity",
                color: "text-accent",
              },
              {
                label: "fit_scorer",
                detail: "Score: 94.2 · Percentile: P97 in talent pool",
                color: "text-accent",
              },
              {
                label: "report_generator",
                detail: "Executive summary generated in 1.4s",
                color: "text-text-primary",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-canvas/50 border border-border-subtle"
              >
                <span className="text-text-muted shrink-0 w-32">{row.label}</span>
                <span className={row.color}>{row.detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
