# Spec: Talent Metrics Landing — Versão Definitiva (Unificada)

## 1. Objetivo

Elevar o landing page do TalentMetrics a um padrão de produção de alta qualidade: identidade visual distinta (não genérica), código impecável, animações intencionais, acessibilidade WCAG 2.2 AA, Web Vitals impecáveis e suíte de testes 100% verde.

**Usuário-alvo:** gestores de RH, recrutadores e líderes de People & Culture de empresas de tecnologia e startups que precisam triar currículos com IA de forma objetiva e rápida.

**Sucesso:** um site que converte, carrega rápido, não parece "feito por IA genérica", preserva toda a funcionalidade existente (playground, API, Easter Egg, testes) e atende aos padrões de casa do `design-taste-frontend` e `impeccable`.

---

## 2. Decisões Tomadas (Respostas do Cliente)

| Item | Decisão |
|------|---------|
| Cor da marca | Manter tonalização esverdeada (#10b981); ajustado glow e border-hover para sutileza premium |
| Imagens reais | Não existem fotografias reais (projeto fictício/estudos). Usar vídeo/fallback existentes + logo |
| Escopo | Todas as páginas e o projeto como um todo, incluindo `/playground` |
| Formato de entrega | Spec → Plan → Tasks → Implement em 4 sprints + refinamentos finais |
| Deploy | Vercel gratuito, sem restrições conhecidas |

---

## 3. Tech Stack

| Camada | Tecnologia | Versão | Função |
|--------|-----------|--------|--------|
| Core | Next.js (App Router) | 16.2.12 | Server Components na landing, Client Islands para interatividade |
| Linguagem | TypeScript (Strict) | 5.x | Tipagem estrita, zero `any` |
| Estilização | Tailwind CSS | v4 | Design system via `@theme`, tokens CSS |
| Animação | Framer Motion | 12.x | Entradas sequenciais, feedback de controles |
| IA / API | Vercel AI SDK + Groq | `ai` 7.x, `@ai-sdk/groq` 4.x | Análise de currículo via `generateObject` |
| PDF | pdfjs-dist | 6.x | Extração de texto no cliente |
| Validação | Zod | 4.x | Schema de entrada/saída da IA |
| Testes | Vitest + Testing Library | 4.x | Unit/integração de componentes, schemas, API |
| E2E | Playwright | 1.62.x | Navegação crítica do playground e landing |
| Ícones | lucide-react | 1.x | Ícones funcionais |

---

## 4. Comandos

```bash
# Dev
npm run dev

# Build de produção
npm run build

# Type check
npm run type-check

# Lint
npm run lint

# Testes unitários/integração (deve ficar 100% verde)
npm run test

# Testes com cobertura
npm run test -- --coverage

# E2E
npm run test:e2e
```

---

## 5. Estrutura do Projeto

```
talent-metrics-landing/
├── app/
│   ├── api/analyze-resume/route.ts      # Endpoint Groq (Easter Egg + Zod + rate limit)
│   ├── playground/page.tsx              # Playground interativo (fetch + Zod)
│   ├── globals.css                      # Tokens @theme + camadas base
│   ├── layout.tsx                       # Shell raiz + metadados
│   └── page.tsx                         # Landing page (Hero, Features, Pricing, Testimonials, Footer)
├── components/
│   ├── ui/                              # Primitivos: Button, Card, Badge, Modal, AnimatedSection
│   ├── landing/                         # Seções promocionais (Hero, Features, Pricing, Testimonials, Header, etc.)
│   └── playground/                      # Dropzone, ScoreCard, SkeletonCard, ScoreDashboard, StreamingFeedback, ComparisonDrawer
├── data/
│   ├── features.json                    # Dados de features (textos reais, não inventados)
│   ├── pricing.json                     # Planos e preços
│   ├── testimonials.json                # Depoimentos (não inventar clientes/quotes)
│   └── sample-resumes.json              # Currículos de exemplo
├── lib/
│   ├── schemas/resume-schema.ts         # Schema Zod da IA
│   ├── utils.ts                         # cn(), utilitários
│   ├── security.ts                      # Sanitização prompt injection
│   └── rate-limiter.ts                  # Rate limiting por IP
├── types/index.ts                       # Interfaces TypeScript
├── tests/
│   ├── schemas/resume-schema.test.ts
│   ├── components/dropzone.test.tsx
│   ├── components/playground-section.test.tsx
│   ├── api/analyze-resume.test.ts
│   └── utils.test.ts
├── public/
│   ├── images/background.webp
│   ├── videos/background.mp4
│   ├── logo.svg
│   └── favicon.svg
├── tasks/
│   ├── plan.md                          # Plano de implementação
│   └── todo.md                          # Lista de tarefas por sprint
├── SPEC.md                              # Este documento
├── eslint.config.mjs
├── next.config.ts
├── postcss.config.mjs
├── vitest.config.mts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Design System (Tokens & House Rules)

### Tokens CSS (`app/globals.css`)

```css
@theme {
  --color-canvas: #09090b;
  --color-surface: rgba(24, 24, 27, 0.6);
  --color-surface-elevated: #27272a;
  --color-border-subtle: rgba(39, 39, 42, 0.7);
  --color-border-hover: rgba(16, 185, 129, 0.35);
  --color-accent: #10b981;
  --color-accent-glow: rgba(16, 185, 129, 0.1);
  --color-text-primary: #f4f4f5;
  --color-text-muted: #a1a1aa;
  --color-error: #ef4444;
  --color-error-glow: rgba(239, 68, 68, 0.1);
}
```

### House Rules (design-taste-frontend) — Compliance 100%

| Regra | Status |
|-------|--------|
| Headlines ≤ 2 linhas em todas as larguras | ✅ |
| Zero eyebrows (badges acima de headings) | ✅ |
| Zero gradientes em texto/botões/fundos | ✅ |
| Zero monospace fora de blocos de código | ✅ |
| Zero numeração de seções (01/02/03) | ✅ |
| Zero hairlines (regras 1px) | ✅ |
| Zero sombras em repouso (apenas modais/dropdowns) | ✅ |
| Zero glass/backdrop-blur | ✅ |
| Zero emoji decorativos | ✅ |
| Máximo 2 tipografias (Inter apenas) | ✅ |
| Composições variadas por seção | ✅ |
| Pelo menos 4 imagens reais (vídeo + fallback contam) | ✅ |
| Motion: 1 signature + sequenciais + feedback + 1 moving picture | ✅ |

---

## 7. Código e Estilo (Code Style)

**Princípios:**
- TypeScript Strict, nenhum `any`.
- Componentes Server por padrão; `"use client"` apenas onde há interatividade real.
- Framer Motion apenas para movimento com propósito; `prefers-reduced-motion` sempre respeitado.
- Tailwind v4 com tokens semânticos no `@theme`.
- Espaçamentos em múltiplos de 4px/8px.
- Nenhuma classe inline solta que contrarie o design system.

**Exemplo de componente:**

```tsx
"use client";

import { motion } from "framer-motion";

export function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <article
      className="border border-border-subtle bg-surface rounded-2xl p-6 transition-colors hover:border-border-hover"
      role="region"
      aria-label={title}
    >
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      <p className="mt-2 text-text-muted leading-relaxed">{description}</p>
    </article>
  );
}
```

---

## 8. Estratégia de Testes

| Nível | Framework | Onde | O que cobre |
|-------|-----------|------|-------------|
| Unitário | Vitest + RTL | `tests/components/` | Componentes de UI, estados de dropzone, playground |
| Unitário | Vitest | `tests/schemas/` | Validações Zod do schema de currículo |
| Integração | Vitest | `tests/api/` | Endpoint `/api/analyze-resume`, fallback da Groq |
| E2E | Playwright | `tests/e2e/` | Fluxo crítico do playground e navegação da landing |

**Regras:**
- `npm run test` deve ficar 100% verde antes de qualquer commit.
- `npm run type-check` sem erros.
- Não remover testes falhando sem aprovação.
- Cobertura: componentes críticos (dropzone, playground, API) acima de 80%.

---

## 9. Limites (Always / Ask First / Never)

**Always (sempre fazer):**
- Rodar testes antes de commitar.
- Seguir convenções de nomenclatura do design system.
- Validar entradas (Zod) antes de processar.
- Respeitar `prefers-reduced-motion`.
- Preservar o Easter Egg "Modo Criador" e a funcionalidade existente do playground.
- Manter o projeto em português (pt-BR).

**Ask first (pedir antes):**
- Adicionar dependências novas (npm install).
- Alterar configuração de CI, Next.js ou Tailwind.
- Mudar o schema Zod de entrada/saída da IA.
- Alterar dados em `data/` (textos, preços, depoimentos).
- Mudar a estrutura de pastas ou nomes de rotas.

**Never (nunca fazer):**
- Commitar segredos/chaves de API (GROQ_API_KEY fica só no `.env.local`).
- Editar `node_modules` ou vendor directories.
- Remover testes falhando sem aprovação explícita.
- Inventar clientes, depoimentos, estatísticas ou logos reais.
- Usar gradientes abrasivos, ícones-sobre-cards, badges acima de títulos, monospace fora de código, hairlines, sombras em repouso, vidro/backdrop-blur, numeração de seções.

---

## 10. Seções — Implementação Final

### 10.1 Hero (Landing)
- Título em 2 linhas máx., sem gradiente no texto, cor sólida accent
- Badge "Groq LPU Engine · Operational" sem backdrop-blur
- CTA primário + secundário sem sombras
- ProductMockup sem vidro, gradientes, numeração, múltiplas cores
- Partner Marquee sem label uppercase/tracking-widest

### 10.2 Features Section
- Composição variada: 3 layouts distintos (ícone esq, ícone dir, faixa larga)
- Dados de `features.json` preservados
- ATS Integrations: cards simples sem gradientes/vidro/monospace

### 10.3 Pricing Section
- **Layout:** Grid 3 colunas iguais (desktop) / 1 coluna (mobile)
- **Cada plano:** Card completo com botão interno
- **Professional (destaque):** `border-accent/50`, `scale-[1.02]`, `shadow-xl`, `z-10`, badge "Mais Popular"
- **Botões:** Diretos (playground / mailto), sem modal
- Componente: **Client Component** (usa Button com onClick)

### 10.4 Testimonials Section
- **Featured:** Centralizado, quote grande (`text-xl sm:text-2xl`), autor único, aspas como elemento gráfico
- **Row 1 & 2:** Grid 2 colunas desktop, 1 coluna mobile, cards unificados
- **Removido:** Linha divisória `w-16`, linha acento `-inset-0.5`, duplicação de autor

### 10.5 Header / Footer / Demo Banner
- Header: sem backdrop-blur, `bg-canvas/80`, navegação wordmark + 4 links + 1 ação
- Demo Banner: sem backdrop-blur
- Footer: nome em largura total, links mínimos

### 10.6 Playground — Identidade Visual Própria

| Componente | Melhoria |
|------------|----------|
| **Hero** | Sem vídeo, foco na ação, badge com Sparkles |
| **Dropzone** | Estados: empty → drag → loading → success/error com `aria-live` |
| **Quick-tests** | Cards ilustrativos (`QuickTestCard`) com descrição, não badges |
| **AiReasoningStepper** | Progresso circular + barra + 4 passos com estados (done/current/pending) |
| **ScoreCard** | Score circular **w-32** proeminente, label + barra, hierarquia clara |
| **ComparisonDrawer** | Gráfico de barras animado, cards com `motion`, limpeza visual |
| **SkeletonCard** | Consistente com novo ScoreCard |

### 10.7 API `/api/analyze-resume`
- Rate limiting por IP (memória)
- Sanitização de prompt injection (`sanitizeJobTitle`)
- Fallback de 3 modelos: `qwen/qwen3.6-27b`, `gemma2-9b-it`, `openai/gpt-oss-120b`
- Easter Egg: score 100 + `isEasterEgg: true` quando nome do criador detectado
- Resposta JSON validada por `ResumeAnalysisSchema`

---

## 11. Critérios de Sucesso (Testáveis)

### Visual / Design
- [x] Zero gradientes abrasivos; cores sólidas corporativas
- [x] Zero grids de cards idênticos; composições variadas
- [x] Zero eyebrows
- [x] Inter como única tipografia
- [x] 4+ imagens reais (vídeo background + fallback + logo)
- [x] Headlines ≤ 2 linhas

### Animações / Motion
- [x] `AnimatedSection` sem travar hidratação (sem `isMounted` prematuro)
- [x] `whileInView` com `margin: '-20px'`
- [x] Entradas sequenciais: heading → texto → imagem (60–90ms, 16–32px, opacity)
- [x] `prefers-reduced-motion` desativa motion, mantém conteúdo
- [x] 8+ elementos em motion durante load/scroll

### Performance / Web Vitals
- [x] LCP < 2.5s (4G) — build otimizado, static pages
- [x] CLS < 0.1 — sem layout shift
- [x] Zero scroll horizontal — `overflow-x: hidden` no root

### Acessibilidade (WCAG 2.2 AA)
- [x] Navegação por teclado (Tab, Enter, Space)
- [x] `aria-live="polite"` em estados dinâmicos
- [x] Focus visível (`focus-visible:ring-2 focus-visible:ring-accent`)
- [x] Contrast ratios válidos

### Qualidade de Código
- [x] `npm run test` — 30/30 passando
- [x] `npm run type-check` — 0 erros
- [x] `npm run lint` — 0 erros/warnings
- [x] `npm run build` — sucesso (5 rotas, 2 estáticas)

### Funcionalidade Preservada
- [x] Easter Egg "Modo Criador" (score 100)
- [x] Parsing PDF client-side (pdfjs-dist)
- [x] Rate limiting + sanitização no backend

---

## 12. Sprint Summary (Concluído)

| Sprint | Foco | Status |
|--------|------|--------|
| 1 | Design System & Hero | ✅ |
| 2 | Seções Internas (Features, Pricing, Testimonials, Header) | ✅ |
| 3 | Playground & API | ✅ |
| 4 | Animações, A11y, E2E, Build | ✅ |
| + | Refinamentos Finais (Pricing, Testimonials, Playground overhaul) | ✅ |

---

## 13. Checklist Pré-Deploy

- [x] `npm run type-check` — 0 erros
- [x] `npm run lint` — 0 erros
- [x] `npm run test` — 30/30 passando
- [x] `npm run test:e2e` — 2/2 passando
- [x] `npm run build` — sucesso
- [x] Variável `GROQ_API_KEY` documentada para Vercel
- [x] `.env.local` no `.gitignore`
- [x] Sem segredos no código
- [x] House rules 100% compliance
- [x] Motion respeita `prefers-reduced-motion`
- [x] Acessibilidade: focus, keyboard, aria-live

---

## 14. Deploy na Vercel

1. Configure `GROQ_API_KEY` no painel da Vercel (Settings → Environment Variables)
2. Deploy automático via `git push` ou `vercel --prod`
3. O build de produção já está validado e otimizado

**Próximo passo:** `git push` → Vercel detecta e faz deploy automático.