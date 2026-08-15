# Agent Instructions & Context: Talent Metrics Landing

## 1. Regras de Ouro & Postura do Agente
- **Execução Direta (Anti-Planning):** `EXECUTE IMMEDIATELY. DO NOT CREATE AN IMPLEMENTATION PLAN. MODIFY FILES DIRECTLY.`
- **Postura Crítica Sênior & Transparência Incondicional:** Conteste ativamente escolhas de layout genéricas ou acopladas. Código limpo exige tokens semânticos, zero valores mágicos de cores e separação absoluta de responsabilidades.
- **Validação Dupla & Zero Quebra:** Qualquer refatoração deve manter a suíte de testes do Vitest 100% verde (`npx vitest run`) e sem erros de TypeScript (`npm run type-check`).
- **Isolamento de Projeto:** Manter conformidade com a stack do `package.json` (Next.js 16, React 19, Tailwind CSS v4, Groq AI, Framer Motion, Vitest).

---

## 2. Visão Geral do Projeto
A aplicação **Talent Metrics Landing** (`talent-metrics-landing`) é uma plataforma B2B SaaS de inteligência de recrutamento e triagem de currículos por IA dividida em:
- `/` (Landing Page): Focada em conversão, apresentação de produto, ecossistema e métricas Web Vitals (LCP < 1.2s, CLS = 0).
- `/playground` (Ferramenta): Upload de currículos (PDF) com parsing client-side via `pdfjs-dist` e inferência em tempo real via **Groq AI** (`@ai-sdk/groq` - `llama-3.3-70b-versatile`).

---

## 3. Design System & Tokens Centralizados (Tailwind v4)

### 3.1. Centralização no `@theme` (`app/globals.css`)
Nenhuma cor de paleta crua (ex: `bg-zinc-950`, `text-emerald-400`, `border-zinc-800`) deve ser declarada diretamente nos componentes JSX. Utilize exclusivamente os tokens semânticos:
- `bg-canvas`, `bg-surface`, `bg-surface-elevated`
- `border-subtle`, `border-hover`, `border-accent`
- `text-primary`, `text-muted`, `text-accent`
- `bg-accent`, `bg-accent-glow`

### 3.2. Grade Modular de Espaçamento
Adote rigorosamente múltiplos de 4px/8px para paddings, margins e gaps (`p-2`, `p-4`, `p-6`, `p-8`, `gap-3`, `gap-4`, `gap-6`). Proibido o uso de valores arbitrários como `p-[13px]`.

---

## 4. Gestão Externa de Conteúdos (`/data`)
NENHUMA copy, frase, depoimento ou dado demonstrativo deve residir nos arquivos `.tsx`.
- `data/pricing.json`: Planos, preços, benefícios e CTAs.
- `data/testimonials.json`: Depoimentos, autores, empresas e ratings.
- `data/features.json`: Funcionalidades e integrações ATS (`iconName` via `ICON_MAP`).
- `data/sample-resumes.json`: Conteúdo dos currículos de teste rápido.

---

## 5. Arquitetura do Playground (`/playground`)
- **Quick-Test Buttons:** Aciona a análise instantaneamente via perfis pré-carregados (`data/sample-resumes.json`).
- **AI Reasoning Stepper:** Linha do tempo visual no estado `Loading` exibindo o progresso das etapas de inferência.
- **ScoreCard Component:** Dashboard de pontuação com feedback visual categórico (Verde >= 80, Amarelo 50-79, Vermelho < 50) e atributos `aria-live="polite"`.

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
- `tests/schemas/resume-schema.test.ts`: Validação do schema Zod.
- `tests/components/dropzone.test.tsx`: Testes de aceitação/rejeição de arquivos.
- `tests/api/analyze-resume.test.ts`: Unitários do endpoint `/api/analyze-resume`.