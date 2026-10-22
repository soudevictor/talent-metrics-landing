# Spec: Talent Metrics Landing — Ciclo Corretivo 2026-10

> **Estado deste documento:** substitui a versão “Definitiva” anterior, que declarava
> “Compliance 100%” sem que a auditoria de 22/10/2026 tivesse confirmado isso. Este é o
> documento vivo do ciclo corretivo. Toda afirmação abaixo foi verificada em código, testes
> ou browser real (Playwright/Chromium em 1440, 768 e 390 px).

## 1. Objetivo

Elevar o demo TalentMetrics a um padrão de produção honesto: a landing deve parecer
intencional (não um template genérico), o playground deve ser confiável e acessível, e os
documentos do repositório devem descrever o que o código realmente faz.

**Usuário-alvo:** gestores de RH, recrutadores e líderes de People & Culture avaliando uma
ferramenta de triagem de currículos. O site é um **projeto demonstrativo para estudo e
portfólio**, não um SaaS em operação.

**Sucesso do ciclo:** todos os P0 corrigidos, P1 corrigidos ou explicitamente aceitos,
regressões cobertas por teste, `lint` → `type-check` → `test` verdes, e nenhuma alegação de
compliance que o browser não sustente.

---

## 2. Decisões do Cliente

| Item | Decisão |
|------|---------|
| Cor da marca | Manter verde `#10b981`; um único accent, sem gradientes em texto/botões |
| Conteúdo fictício | **Intencional.** O projeto é demo/estudo. Manter nomes, empresas, depoimentos, preços e métricas **fictícios**, sempre rotulados como demonstração |
| Marcas reais | **Proibido** usar marca, logo ou cliente real (ex.: Greenhouse, Gupy) para evitar confusão. Tecnologias reais citadas como stack (Groq, Next.js) são fato, não endosso |
| Escopo | Landing `/`, playground `/playground`, API e documentação |
| Deploy | Vercel gratuita; sem CI configurado no repositório |
| Commits | **Nenhum commit sem autorização explícita do usuário** |

---

## 3. Tech Stack (verificado em `package.json`)

| Camada | Tecnologia | Versão | Função |
|--------|-----------|--------|--------|
| Core | Next.js App Router | 16.2.12 | Server Components na landing; client islands |
| Linguagem | TypeScript strict | 5.x | Sem `any` |
| Estilo | Tailwind CSS | v4 | Tokens em `app/globals.css` (`@theme`), sem `tailwind.config.*` |
| Animação | Framer Motion | 12.x | Entradas, drawers, feedback |
| IA | Vercel AI SDK + Groq | `ai` 7.x, `@ai-sdk/groq` 4.x | `generateObject` (não streaming) |
| PDF | pdfjs-dist | 6.x | Extração no browser, worker local |
| Validação | Zod | 4.x | Entrada, saída e histórico |
| Testes | Vitest + Testing Library | 4.x | Unit/integração |
| E2E | Playwright | 1.62.x | Fluxo do playground e navegação |

---

## 4. Comandos

```bash
npm run dev            # Next dev
npm run lint           # ESLint
npm run type-check     # tsc --noEmit
npm run test           # Vitest (unit/integração)
npm run test:watch     # Vitest watch
npm run build          # Build de produção
npm run test:e2e       # Playwright (auto-start do dev em :3000)
```

- **Cobertura não está disponível:** `@vitest/coverage-v8` não está instalado. Não usar
  `npm run test -- --coverage` como critério até a dependência ser aprovada.
- Ordem de verificação local: `lint` → `type-check` → `test` → `build` → `test:e2e`.
- Playwright reescreve `playwright-report/index.html` e `test-results/.last-run.json`, ambos
  rastreados. Conferir `git status` e restaurar artefatos antes de qualquer commit.
- `test:e2e` reutiliza dev server já aberto na porta 3000; servidor velho gera resultado falso.

---

## 5. Estrutura

```
app/
  api/analyze-resume/route.ts   # Zod + rate limit + fallback Groq + creator mode
  playground/page.tsx           # noindex; shell do playground
  playground/playground-client.tsx
  globals.css                   # @theme + base + reduced motion
  layout.tsx                    # shell, fonte, banner demo
  page.tsx                      # landing (Server Component)
components/
  ui/                           # Button, Card, Badge, Modal, AnimatedSection
  landing/                      # Header, Hero, Features, Pricing, Testimonials, Footer
  playground/                   # Dropzone, ScoreCard, History, ComparisonDrawer
data/                           # features, pricing, testimonials, sample-resumes (fictícios)
lib/
  schemas/resume-schema.ts      # schema Zod de entrada/saída
  schemas/candidate-history-schema.ts
  security.ts                   # sanitização e IP
  rate-limiter.ts               # janela deslizante em memória
  use-dialog-focus.ts           # focus trap, scroll lock e restore
types/index.ts
tests/                          # unit/integração (e2e é excluído do Vitest)
public/                         # logo, favicon, background.webp/mp4, pdf.worker.min.mjs
tasks/                          # plan.md e todo.md do ciclo corretivo
```

---

## 6. Design System e House Rules — Estado Real

### Tokens (`app/globals.css`)

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
}
```

### House rules (design-taste-frontend) — estado após correção

| Regra | Estado real | Observação |
|-------|-------------|------------|
| Headlines ≤ 2 linhas em 1440/768/390 | **Corrigido** | Hero reescrito e escala responsiva reduzida |
| Zero eyebrows (badge acima de heading) | **Corrigido** | Badge do hero, badge de ATS e chip do playground removidos; “Mais popular” virou texto ao lado do título |
| Zero gradientes em texto/botões | **Corrigido** | Nenhum gradiente em texto/botão; gradientes funcionais restantes só em scrim de mídia |
| Zero monospace fora de código | **OK** | `product-mockup` usa fonte de texto com `tabular-nums` |
| Zero numeração de seção | **OK** | Não há 01/02/03 |
| Zero hairlines decorativas | **Parcial** | Divisores `h-px` removidos dos cards; bordas de card e foco permanecem (funcionais) |
| Zero sombras em repouso | **Parcial** | Sombras removidas de botões/cards; mantidas apenas em modal/drawer |
| Zero glass/backdrop-blur | **Corrigido** | `backdrop-blur` removido de Badge e Modal |
| Zero emoji decorativo | **OK** | Ícones lucide são funcionais |
| Uma tipografia (Inter) | **OK** | `next/font/google` Inter |
| Composições variadas | **Parcial** | Features usa 3 layouts; pricing e testimonials ainda são grids de cards |
| Imagens reais ≥ 4 | **Não atingido** | Existe 1 imagem (`background.webp`) + 1 vídeo + logo. Não inventar fotos para atingir número |

> **Regra de honestidade:** este documento não deve voltar a marcar ✅ em uma regra que o
> browser não confirma. “Parcial” e “Não atingido” são estados válidos.

---

## 7. Código e Estilo

- TypeScript strict; sem `any`.
- Server Components por padrão; `"use client"` só com interatividade real.
- Tokens semânticos (`bg-canvas`, `bg-surface`, `border-border-subtle`, `text-text-muted`,
  `text-accent`); nunca paleta crua (`text-zinc-*`, `text-indigo-*`).
- Framer Motion só com propósito; `prefers-reduced-motion` sempre respeitado.
- Espaçamento em múltiplos de 4/8 px; seções com respiro maior que o interior dos cards.
- `Button` não pode ser filho de `<a>`/`Link`. Usar `buttonVariants()` em links.
- Diálogos usam `useDialogFocus` (trap + restore + scroll lock).
- Conteúdo demo precisa de rótulo visível; nunca apresentar ficção como cliente real.

---

## 8. Estratégia de Testes

| Nível | Onde | Cobertura mínima do ciclo |
|-------|------|---------------------------|
| Unitário | `tests/components/` | Dropzone, ScoreCard (barra visível), focus trap do Modal |
| Unitário | `tests/schemas/` | `ResumeAnalysisSchema`, resposta com `isEasterEgg`, histórico |
| Integração | `tests/api/` | 400/429/500, fallback, creator mode, timeout |
| E2E | `tests/e2e/` | Header sticky, fluxo do playground, erro de arquivo |

**Regras:**
- Todo P0/P1 corrigido ganha teste de regressão no mesmo ciclo.
- `npm run test` 100% verde antes de qualquer commit.
- Não remover teste falhando sem aprovação.
- Não prometer cobertura percentual enquanto a ferramenta de coverage não existir.

---

## 9. Limites (Always / Ask First / Never)

**Always**
- Rodar `lint`, `type-check` e `test` antes de propor commit.
- Validar entrada com Zod no servidor e no cliente.
- Respeitar `prefers-reduced-motion` e navegação por teclado.
- Manter copy em pt-BR.
- Rotular conteúdo fictício como demonstração.
- Preservar o Easter Egg “Modo Criador” (dev-only) e o fluxo do playground.

**Ask first**
- Adicionar dependência (`npm install`).
- Alterar schema Zod de entrada/saída da IA.
- Alterar configuração de Next/Tailwind/CI.
- Mudar estrutura de pastas ou rotas.
- Commitar (sempre).

**Never**
- Commitar segredos (`GROQ_API_KEY` só em `.env.local`).
- Editar `node_modules` ou vendor.
- Inventar clientes, logos, depoimentos ou métricas **reais**.
- Usar marca real de terceiro em conteúdo fictício.
- Reintroduzir glass, sombras em repouso, gradientes em texto/botão, eyebrows, hairlines
  decorativas, numeração de seção ou monospace fora de código.
- Declarar compliance sem medição.

### Política de conteúdo fictício

O projeto é um demo. Nomes, empresas, depoimentos, preços e métricas são **ficção de
demonstração** e devem:
1. ser claramente rotulados como fictícios/demonstrativos na interface;
2. usar nomes que não correspondam a marcas reais conhecidas;
3. não usar logo, screenshot ou identidade de terceiros;
4. não prometer resultado real (ex.: “reduza contratação em 10x”) sem o aviso de demo;
5. nos currículos de exemplo, usar empregadores, instituições e certificações fictícios.

---

## 10. Seções — Estado e Correções

### 10.1 Header / Banner
- Header `sticky top-0 z-40` deve permanecer colado no topo em todas as larguras.
- O banner demo deixa de ser `sticky` e passa a ocupar o fluxo normal; drawers/modais usam
  portal e ficam acima de tudo.
- Drawer mobile: `role="dialog"`, trap de foco, Escape, restore e scroll lock.

### 10.2 Hero
- H1 em no máximo 2 linhas em 1440/768/390.
- Sem badge/eyebrow acima do H1. Informação de engine vira texto de apoio ou sai.
- CTA primário e secundário sem `<a><button>` aninhado e sem sombra em repouso.

### 10.3 Features
- Pares de features com espaçamento vertical real (`space-y-12`), não 0 px.
- Três layouts alternados preservados (ícone esq., ícone dir., faixa larga).
- Sub-seção ATS sem badge acima do heading; nomes fictícios.

### 10.4 Pricing / Testimonials
- Preços e depoimentos fictícios com rótulo de demonstração visível.
- Nenhuma marca real (ex.: Greenhouse/Gupy) nas features.
- “Mais popular” não é eyebrow acima do título; vira rótulo ao lado do nome do plano.

### 10.5 Playground
- Hero sem chip/eyebrow; heading direto.
- Dropzone: PDF, ≤5MB, estados empty/drag/loading/error/success, `aria-live`.
- Loading reflete o request real (progresso por tempo + abort), não loop infinito de 800 ms.
- ScoreCard: barra de score visível (`bg-accent`, `bg-amber-400`, `bg-red-400`), não
  `text-*` usado como fundo.
- Histórico localStorage validado por Zod, máximo 5 itens, tolerante a lixo.
- `isEasterEgg` preservado no parse do cliente para o badge renderizar em dev.

### 10.6 API
- Zod de entrada, rate limit 10/min por IP em memória (por instância em serverless).
- Sanitização de `jobTitle`.
- Fallback de modelos com timeout/abort por tentativa.
- Creator mode exige `NODE_ENV=development` + `ENABLE_CREATOR_MODE=true` + nome do criador.
- PDF worker servido de `/pdf.worker.min.mjs` (sem CDN em runtime).

---

## 11. Critérios de Aceite do Ciclo

### P0 — bloqueadores (todos obrigatórios)
- [x] P0-01 Com scroll > 600 px, o header continua visível no topo em 1440/768/390.
- [x] P0-02 Features têm ≥ 32 px entre linhas de features (não 0 px).
- [x] P0-03 A barra do ScoreCard é visível e usa cor de fundo, não classe `text-*`.
- [x] P0-04 Modal e drawers prendem o foco, fecham com Escape, restauram o foco e bloqueiam
      o scroll do body; não há dois diálogos abertos ao mesmo tempo.
- [x] P0-05 Conteúdo fictício (depoimentos, preços, parceiros, ATS) tem rótulo visível de
      demonstração e não usa marca real.
- [x] P0-06 Drawer de comparação não fica atrás do banner/header e abre no topo correto.

### P1 — qualidade (obrigatório corrigir ou aceitar por escrito)
- [x] P1-01 H1 da landing em ≤ 2 linhas em 1440/768/390; sem eyebrow acima.
- [x] P1-02 Nenhum `<a>` contém `<button>`; CTAs usam `buttonVariants()`.
- [x] P1-03 `prefers-reduced-motion` mantém todo o conteúdo visível e remove movimento.
- [x] P1-04 `AnimatedSection` não deixa seções permanentemente invisíveis se o observer falhar.
- [x] P1-05 Badge “Modo Criador” renderiza quando a API devolve `isEasterEgg: true`.
- [x] P1-06 Loading do playground progride com o request real e aborta após timeout.
- [x] P1-07 Worker do PDF é local (`/pdf.worker.min.mjs`), sem depender de CDN.
- [x] P1-08 Histórico do localStorage é validado e não quebra com payload inválido.
- [x] P1-09 `generateObject` tem timeout/abort e o fallback não pendura a request.
- [x] P1-10 Testes de regressão cobrem P0-01…P0-06 e P1-01…P1-09.

### P2 — polimento / dívida documentada
- [x] P2-01 Remover `transition-all` onde `transition-colors`/`transition-[width]` bastam.
- [x] P2-02 Reduzir sombras em repouso e hairlines decorativas restantes.
- [x] P2-03 Corrigir warning de `next/image` no logo.
- [x] P2-04 Documentar limitação do rate limit em serverless e confiança em `x-forwarded-for`.
- [x] P2-05 Atualizar `README.md` com o stack real (Next 16, Tailwind 4, análise sem streaming, Node >=20.9).

> Status em 22/10/2026: critérios verificados em browser real e testes. Evidências
> detalhadas em `tasks/todo.md`; nenhum commit foi feito sem autorização.

---

## 12. Auditoria de 22/10/2026 — Evidências

| ID | Sintoma medido | Evidência |
|----|----------------|----------|
| P0-01 | Header sai da tela (`header.top = -1159px` com scroll 1200) | `app/page.tsx` usa `overflow-hidden`; `body` usa `overflow-x: hidden` |
| P0-02 | 0 px entre features | `features-section.tsx` mapeia linhas sem `space-y` |
| P0-03 | Barra do score invisível | `score-card.tsx` aplica `text-accent` como fundo |
| P0-04 | Foco preso atrás do overlay; Tab escapa | `modal.tsx` sem trap; drawer sem trap completo |
| P0-05 | Depoimentos/preços/ATS sem rótulo; Greenhouse/Gupy reais | `data/testimonials.json`, `data/pricing.json` |
| P0-06 | Drawer cortado pelo banner `sticky z-50` | `demo-banner.tsx`, `comparison-drawer.tsx` |
| P1-01 | H1 em 3 linhas (1440/768) e 5 linhas (390) | `app/page.tsx` |
| P1-02 | `<a><button>` em CTAs | `landing-cta-buttons.tsx`, `header.tsx` |
| P1-03 | CSS global zera animações, mas drawers ainda usam motion | `globals.css`, `comparison-drawer.tsx` |
| P1-05 | `ResumeAnalysisSchema` remove `isEasterEgg` | `playground-section.tsx` |
| P1-07 | Worker vem de `//unpkg.com/...` | `playground-section.tsx` |
| P1-08 | Histórico faz cast `as CandidateHistoryItem[]` | `comparison-drawer.tsx` |
| P1-09 | Sem abort/timeout no fallback | `app/api/analyze-resume/route.ts` |
| P2-01 | 10 tamanhos de fonte, body 14 px, 24 blocos < 13 px | inspeção no browser |

---

## 13. Plano do Ciclo (resumo)

1. **Fase A — Documentos:** atualizar `SPEC.md`, `tasks/plan.md`, `tasks/todo.md`, `AGENTS.md`.
2. **Fase B — P0 UI:** sticky, gaps, score bar, diálogos, banner/drawer, rótulos demo.
3. **Fase C — P1 comportamento:** hero, links, reduced motion, Easter egg, loading real,
   PDF worker local, histórico Zod, timeout da API.
4. **Fase D — Testes e verificação:** regressões unitárias, `lint` → `type-check` → `test`,
   `build`, E2E, browser em 1440/768/390.

Detalhes e dependências em `tasks/plan.md`; checklist executável em `tasks/todo.md`.

---

## 14. Definition of Done

- [x] P0 e P1 concluídos (ou aceitos explicitamente no `tasks/todo.md`).
- [ ] `npm run lint` sem erros.
- [ ] `npm run type-check` sem erros.
- [ ] `npm run test` 100% verde, com regressões novas.
- [ ] `npm run build` conclui.
- [ ] Verificação em browser real: 1440/768/390, header sticky, H1 ≤ 2 linhas, ScoreCard
      visível, diálogos com foco, banner/drawer sem sobreposição.
- [ ] Nenhum artefato de Playwright alterado por engano.
- [ ] Nenhum commit criado sem autorização.

---

## 15. Deploy

1. Configurar `GROQ_API_KEY` na Vercel (Settings → Environment Variables).
2. Deploy via `git push` ou `vercel --prod` **somente após autorização de commit**.
3. Limitações conhecidas: rate limit em memória por instância; parsing de PDF depende do
   worker local empacotado em `public/`; creator mode desligado em produção.
