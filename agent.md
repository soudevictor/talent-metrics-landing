# Agent Instructions & Context: Talent Metrics Landing

## 1. Regras de Ouro & Postura do Agente
- **Execução Direta (Anti-Planning):** `EXECUTE IMMEDIATELY. DO NOT CREATE AN IMPLEMENTATION PLAN. MODIFY FILES DIRECTLY.`
- **Postura Crítica Sênior & Transparência Incondicional:** Conteste ativamente decisões de UI/UX genéricas. Se um elemento parecer um "template de IA clichê", recrie-o aplicando padrões de software B2B de alto nível (estilo Linear, Vercel ou Stripe).
- **Validação Dupla & Zero Quebra:** Qualquer refatoração deve manter a suíte de testes do Vitest 100% verde (`npx vitest run`) e sem erros de TypeScript (`npm run type-check`).
- **Isolamento de Projeto:** Mantenha o escopo focado nas dependências ativas em `package.json` (`@ai-sdk/groq`, `framer-motion`, `pdfjs-dist`, `tailwind-merge`, `zod`, `vitest`).

---

## 2. Visão Geral do Projeto
A aplicação **Talent Metrics Landing** (`talent-metrics-landing`) é uma plataforma B2B SaaS de inteligência de recrutamento e triagem de currículos por IA dividida em:
- `/` (Landing Page): Focada em alta conversão, apresentação de produto, prova social e métricas Web Vitals (LCP < 1.2s, CLS = 0).
- `/playground` (Ferramenta): Upload de currículos (PDF) com parsing client-side via `pdfjs-dist` e inferência em tempo real via **Groq AI** (`@ai-sdk/groq` - `llama-3.3-70b-versatile`).

---

## 3. Diretrizes de Design System & Visual Bespoke (Obrigatório)

### 3.1. Estética e Paleta de Cores
- **Base:** `zinc-950` (`#09090b`) e `zinc-900` como fundos. **Proibido** usar `slate-950` / `slate-900` em novos componentes.
- **Textura de Grid:** Classe `.bg-grid-pattern` em `globals.css` aplicada globalmente no `<body>`. Opacidade das linhas: `rgb(39 39 42 / 0.35)`, tamanho: `24px × 24px`.
- **Paleta de Acento:** **Emerald/Teal elétrico** (`emerald-400`, `emerald-500`, `teal-500`) como cor primária de ação, substituindo os gradientes indigo/purple genéricos.
- **Efeito Glass & Depth:** Cards com `bg-zinc-900/60`, `backdrop-blur-xl`, bordas `border-zinc-800/80` com `hover:border-emerald-500/30` e sombras `shadow-black/30`.
- **Glow de Fundo:** Gradiente radial emerald no topo das páginas: `radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,transparent_70%)`.

### 3.2. Animações e Micro-interações
- Usar `framer-motion` para animações de entrada (`AnimatedSection`: `opacity: 0, y: 20` → `opacity: 1, y: 0`).
- Todas as animações respeitam `prefers-reduced-motion` via `useReducedMotion()` no `AnimatedSection`.
- **Marquee (Partner Strip):** CSS puro com `@keyframes marquee` em `globals.css`, class `animate-marquee`. Sempre duplicar o array para loop perfeito.
- **Neon-pulse:** `@keyframes neon-pulse` em `globals.css`, class `badge-neon-hover` nos botões de quick-test.
- **Status dot:** `@keyframes status-ping` em `globals.css`, class `animate-status-ping` nos badges de status ao vivo.

### 3.3. Componentes Críticos
- **Live Engine Badge:** Sempre renderizar o badge `🟢 Llama 3.3 Engine · Operational` com `animate-status-ping` no Hero e no Playground.
- **ProductMockup (Hero):** Componente client `ProductMockup` em `app/page.tsx` com 2 abas comutáveis:
  - `Visão do RH`: grid 3 colunas — score gauge, pontos fortes, pontos a aprofundar.
  - `Análise do Algoritmo`: log-style terminal mostrando as etapas do pipeline (pdf_parser → skill_mapper → jd_comparator → fit_scorer → report_generator).
- **AiReasoningStepper:** Componente interno em `playground-section.tsx` que alterna 4 mensagens a cada `450ms` durante o carregamento, com dots indicadores e `aria-live="polite"`.

---

## 4. Gestão Externa de Conteúdos (`/data`)
NENHUMA copy, frase, depoimento ou dado demonstrativo deve estar *hardcoded* nos componentes JSX.
- `data/pricing.json`: Títulos, preços, benefícios, badges e CTAs.
- `data/testimonials.json`: Nome, empresa, cargo, foto, rating e depoimento.
- `data/features.json`: Funcionalidades e integrações ATS (`iconName` resolvida via `ICON_MAP`).
- `data/sample-resumes.json`: Conteúdo dos currículos de teste rápido no Playground.

**Interfaces TypeScript** em `types/index.ts`: `PricingTier`, `Testimonial`, `Feature` (com `iconName: string`), `SampleResume`.

---

## 5. Arquitetura do Playground (`/playground`)
- **Quick-Test Buttons:** Botões neon com `badge-neon-hover`, `border-emerald-500/30`, `bg-emerald-500/6`. Dados em `data/sample-resumes.json`.
- **AI Reasoning Stepper:** 4 etapas do algoritmo a cada 450ms com animação de dots. Exibe o nome do perfil ativo durante a análise.
- **Dashboard de Resultado (`ScoreCard`):** Score em destaque com badge colorido por nível (Verde ≥ 80, Amarelo 50–79, Vermelho < 50), pontos fortes, sugestões e breakdown por cargos.
- **Acessibilidade:** Container com `aria-live="polite"`, stepper com `aria-live="polite" aria-atomic="true"`, quick-test group com `role="group"` e `aria-label`.

---

## 6. Schemas & Contrato de Dados (Zod)
Contrato em `lib/schemas/resume-schema.ts`:
```typescript
import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matchingPoints: z.array(z.string()).default([]),
  improvementPoints: z.array(z.string()).default([]),
  matchPercentageByRole: z.record(z.string(), z.number()).optional(),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
```

---

## 7. Suíte de Testes Automatizados (Vitest)
Manter a suíte em `tests/` verde:
- `tests/schemas/resume-schema.test.ts`: Validação de schemas Zod.
- `tests/components/dropzone.test.tsx`: Testes do Dropzone e tipos de arquivo.
- `tests/api/analyze-resume.test.ts`: Unitários da rota de API e tratamento de erros.