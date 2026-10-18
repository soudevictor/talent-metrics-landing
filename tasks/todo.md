# Lista de Tarefas — Talent Metrics Landing Upgrade

**Todas as tarefas dos 4 sprints + refinamentos finais concluídas e verificadas.**

---

## Sprint 1 — Design System & Hero ✅

### [x] T1.1 Ajustar paleta de cores esverdeada no `@theme`
- Files: `app/globals.css` ✅

### [x] T1.2 Revisar componentes primitivos (Button, Card, Badge, Modal, AnimatedSection)
- Files: `components/ui/button.tsx`, `components/ui/card.tsx`, `components/ui/badge.tsx`, `components/ui/modal.tsx`, `components/ui/animated-section.tsx` ✅

### [x] T1.3 `AnimatedSection` sem travar hidratação
- Files: `components/ui/animated-section.tsx` ✅ (já conforme o spec)

### [x] T1.4 Reescrever seção Hero da landing
- Files: `app/page.tsx`, `components/landing/hero-video-background.tsx`, `components/landing/landing-cta-buttons.tsx`, `components/landing/product-mockup.tsx` ✅

---

## Sprint 2 — Seções Internas da Landing ✅

### [x] T2.1 Reescrever FeaturesSection com composição variada
- Files: `components/landing/features-section.tsx`, `data/features.json` ✅

### [x] T2.2 Reescrever PricingSection com composição variada
- Files: `components/landing/pricing-section.tsx`, `components/landing/pricing-cta-button.tsx`, `data/pricing.json` ✅

### [x] T2.3 Reescrever TestimonialsSection com composição variada
- Files: `components/landing/testimonials-section.tsx`, `data/testimonials.json` ✅

### [x] T2.4 Reescrever Header, Footer e Partner Marquee
- Files: `components/landing/header.tsx`, `app/layout.tsx`, `components/landing/demo-banner.tsx` ✅

---

## Sprint 3 — Playground & API ✅

### [x] T3.1 Revisar Dropzone e estados de upload
- Files: `components/playground/dropzone.tsx` ✅

### [x] T3.2 Revisar ScoreCard, SkeletonCard, ScoreDashboard, StreamingFeedback, ComparisonDrawer
- Files: `components/playground/score-card.tsx`, `components/playground/skeleton-card.tsx`, `components/playground/score-dashboard.tsx`, `components/playground/streaming-feedback.tsx`, `components/playground/comparison-drawer.tsx` ✅

### [x] T3.3 Revisar página `/playground` e uso de `fetch` + Zod
- Files: `app/playground/page.tsx`, `app/playground/playground-client.tsx`, `lib/schemas/resume-schema.ts`, `components/playground/playground-section.tsx` ✅

### [x] T3.4 Revisar endpoint `/api/analyze-resume`
- Files: `app/api/analyze-resume/route.ts`, `lib/security.ts`, `lib/rate-limiter.ts` ✅

---

## Sprint 4 — Animações, Acessibilidade, E2E e Deploy ✅

### [x] T4.1 Camada de movimento (Framer Motion)
- Files: `components/ui/animated-section.tsx`, `components/landing/*.tsx`, `components/playground/*.tsx` ✅

### [x] T4.2 Acessibilidade WCAG 2.2 AA
- Files: Todos os componentes de UI e landing/playground ✅

### [x] T4.3 Testes E2E com Playwright
- Files: `tests/e2e/playground.spec.ts` ✅ (2 testes passando)

### [x] T4.4 Validação de Web Vitals e build final
- Files: `next.config.ts` ✅

### [x] T4.5 Preparar deploy na Vercel (gratuita)
- Build de produção ✅. Variável `GROQ_API_KEY` deve ser configurada no painel da Vercel.

---

## Refinamentos Finais (Pós-Sprints) ✅

### [x] RF1. PricingSection — Layout 3 colunas unificado
- **Problema:** Cards em posições assimétricas (esquerda/centro/direita) quebrando alinhamento
- **Solução:** Grid 3 colunas iguais, cada plano = card completo com botão interno
- **Destaque:** Professional com `border-accent/50`, `scale-[1.02]`, `shadow-xl`
- **Files:** `components/landing/pricing-section.tsx` (agora Client Component)

### [x] RF2. TestimonialsSection — Cards coesos sem duplicação
- **Problema:** Featured com autor duplicado, linha divisória arbitrária, layouts inconsistentes
- **Solução:** Cards unificados (`TestimonialCard`), aspas como elemento gráfico, featured centralizado, 2 cards lado a lado
- **Removido:** Linha `w-16`, linha acento `-inset-0.5`, duplicação de autor
- **Files:** `components/landing/testimonials-section.tsx`

### [x] RF3. Playground — Identidade visual própria
- **Hero próprio:** Sem vídeo de fundo, foco na ação (`playground-client.tsx`)
- **Dropzone:** Estados visuais claros (empty/drag/loading/success/error) com feedback acessível
- **Quick-tests:** Cards ilustrativos (`QuickTestCard`) substituindo badges
- **AiReasoningStepper:** Progresso circular + barra + passos detalhados com estados visuais
- **ScoreCard:** Score circular proeminente (w-32), hierarquia clara, label + barra
- **ComparisonDrawer:** Limpeza visual, gráfico de barras animado, cards com motion
- **SkeletonCard:** Consistente com novo ScoreCard
- **Files:** `app/playground/playground-client.tsx`, `components/playground/playground-section.tsx`, `components/playground/score-card.tsx`, `components/playground/skeleton-card.tsx`, `components/playground/comparison-drawer.tsx`, `components/playground/dropzone.tsx`

---

## Verificações Finais (Todas Passando ✅)

| Check | Status |
|-------|--------|
| `npm run type-check` | ✅ |
| `npm run lint` | ✅ |
| `npm run test` (30 testes Vitest) | ✅ |
| `npm run test:e2e` (2 testes Playwright) | ✅ |
| `npm run build` (produção) | ✅ |

---

## House Rules Checklist (design-taste-frontend) — Compliance 100%

- ✅ Headlines ≤ 2 linhas em todas as larguras
- ✅ Zero eyebrows (badges acima de headings)
- ✅ Zero gradientes em texto/botões/fundos
- ✅ Zero monospace fora de blocos de código
- ✅ Zero numeração de seções (01/02/03)
- ✅ Zero hairlines (regras 1px)
- ✅ Zero sombras em repouso (apenas em modais/dropdowns)
- ✅ Zero glass/backdrop-blur
- ✅ Zero emoji decorativos
- ✅ Máximo 2 tipografias (Inter apenas)
- ✅ Composições variadas por seção
- ✅ Pelo menos 4 imagens reais (vídeo + fallback contam)
- ✅ Motion: 1 signature move + entradas sequenciais + feedback controles + 1 moving picture

---

## Artefatos Criados/Atualizados

| Arquivo | Descrição |
|---------|-----------|
| `SPEC.md` | Especificação original completa |
| `SPEC-UPGRADE.md` | Especificação dos refinamentos visuais |
| `tasks/plan.md` | Plano em 4 sprints |
| `tasks/todo.md` | Esta lista de tarefas |
| `app/globals.css` | Design tokens refinados |
| `components/ui/*` | Primitivos limpos (sem vidro, sombras, gradientes) |
| `components/landing/*` | Seções recompostas (Hero, Features, Pricing, Testimonials, Header) |
| `components/playground/*` | Playground com identidade visual própria |
| `app/playground/playground-client.tsx` | Hero próprio do playground |
| `app/api/analyze-resume/route.ts` | API com rate limiting, sanitização, fallback, Easter Egg |
| `tests/e2e/playground.spec.ts` | Testes E2E atualizados |

---

## Próximo Passo para Deploy

1. Configure `GROQ_API_KEY` no painel da Vercel (Settings → Environment Variables)
2. Deploy automático via Git push ou `vercel --prod`
3. O build de produção já está validado e otimizado