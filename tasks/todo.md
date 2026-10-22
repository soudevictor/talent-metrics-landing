# Lista de Tarefas — Ciclo Corretivo 2026-10

> Backlog executável do ciclo corretivo. Cada item tem aceite e verificação.
> Nenhum commit sem autorização. Marcar `[x]` apenas após verificar.

---

## Fase A — Documentos e política

### [x] A1. Reescrever `SPEC.md` com estado real e critérios de aceite
- Aceite: sem “Compliance 100%” falso; P0/P1/P2 com aceite testável; política de conteúdo demo.
- Verify: leitura + `git diff --check`.
- Files: `SPEC.md`

### [x] A2. Reescrever `tasks/plan.md` com fases e dependências
- Aceite: plano do ciclo corretivo, não o plano antigo “concluído”.
- Verify: leitura.
- Files: `tasks/plan.md`

### [x] A3. Criar este backlog `tasks/todo.md`
- Aceite: cada P0/P1/P2 tem aceite, verificação e arquivos.
- Verify: leitura.
- Files: `tasks/todo.md`

### [x] A4. Atualizar `AGENTS.md` e resolver `agent.md` → `AGENTS.md`
- Aceite: `AGENTS.md` descreve o repo real, política de conteúdo demo e limitações atuais;
  `agent.md` removido do working tree.
- Verify: `git status --short` mostra `D agent.md` e `AGENTS.md`; leitura.
- Files: `AGENTS.md`, `agent.md`

---

## Fase B — P0 (bloqueadores)

### [x] P0-01 Header sticky em todas as larguras
- Problema: `overflow-hidden` no root e `overflow-x: hidden` no body criam contexto que
  quebra `position: sticky`.
- Correção: `overflow-x-clip` no root/body; banner demo deixa de ser sticky.
- Aceite: com scroll 1200 px, `header.getBoundingClientRect().top === 0`.
- Verify: Playwright/browser em 1440/768/390 + teste E2E.
- Files: `app/page.tsx`, `app/globals.css`, `components/landing/demo-banner.tsx`

### [x] P0-02 Espaçamento entre features
- Problema: linhas renderizadas em sequência sem gap.
- Correção: `space-y-12` nos grupos de features.
- Aceite: ≥ 32 px entre o fim de uma feature e o título da próxima.
- Verify: inspeção no browser + snapshot de classes.
- Files: `components/landing/features-section.tsx`

### [x] P0-03 Barra do ScoreCard visível
- Problema: `text-accent`/`text-amber-400` usados como cor de fundo.
- Correção: `getScoreBgClass()` com `bg-*`; usar `transition-[width]`.
- Aceite: barra com `background-color` não transparente em score 90/70/30.
- Verify: teste de componente + browser.
- Files: `components/playground/score-card.tsx`, `tests/components/score-card.test.tsx`

### [x] P0-04 Focus trap, restore e scroll lock nos diálogos
- Problema: foco fica atrás do overlay; Tab escapa; drawer e modal podem coexistir.
- Correção: hook `useDialogFocus` usado por Modal, MobileDrawer e ComparisonDrawer;
  Header centraliza o modal de login e fecha o drawer antes de abrir.
- Aceite: foco inicial dentro do diálogo; Tab cicla; Escape fecha; foco volta ao
  acionador; `body` sem scroll; apenas 1 `role="dialog"`.
- Verify: testes de componente + E2E de teclado.
- Files: `lib/use-dialog-focus.ts`, `components/ui/modal.tsx`,
  `components/landing/header.tsx`, `components/landing/landing-cta-buttons.tsx`,
  `components/playground/comparison-drawer.tsx`

### [x] P0-05 Rotular conteúdo fictício e remover marcas reais
- Problema: depoimentos/preços/ATS sem aviso; Greenhouse/Gupy (marcas reais) no pricing.
- Correção: rótulos “Dados fictícios de demonstração” em pricing/testimonials/parceiros;
  ATS e empresas fictícias; sem marca real.
- Aceite: texto visível nas três seções; grep sem Greenhouse/Gupy.
- Verify: grep + browser.
- Files: `components/landing/pricing-section.tsx`,
  `components/landing/testimonials-section.tsx`, `components/landing/features-section.tsx`,
  `app/page.tsx`, `data/pricing.json`, `data/testimonials.json`,
  `data/sample-resumes.json`

### [x] P0-06 Banner/drawer sem sobreposição
- Problema: banner `sticky z-50` cobre header/drawer.
- Correção: banner em fluxo normal; drawers/modais em portal com z-index de diálogo.
- Aceite: drawer de comparação abre em `top: 0` visível, acima do header, sem corte.
- Verify: browser em mobile/desktop.
- Files: `components/landing/demo-banner.tsx`,
  `components/playground/comparison-drawer.tsx`, `components/ui/modal.tsx`

---

## Fase C — P1 (qualidade e comportamento)

### [x] P1-01 H1 em ≤ 2 linhas e sem eyebrow
- Correção: copy mais curta, escala responsiva, remover chip do hero e do playground.
- Aceite: 2 linhas em 1440/768/390; nenhum badge acima de `h1`.
- Verify: `inspect.mjs`/browser.
- Files: `app/page.tsx`, `app/playground/playground-client.tsx`

### [x] P1-02 Eliminar `<a><button>`
- Correção: exportar `buttonVariants()` e usar em `Link`; Header idem.
- Aceite: nenhum `button` dentro de `a` no DOM.
- Verify: browser `document.querySelectorAll('a button').length === 0` + teste.
- Files: `components/ui/button.tsx`, `components/landing/landing-cta-buttons.tsx`,
  `components/landing/header.tsx`, `components/landing/pricing-section.tsx`

### [x] P1-03 Reduced motion mantém conteúdo
- Correção: `AnimatedSection` já usa div estático com reduced motion; `MotionProvider`
  aplica `MotionConfig reducedMotion="user"` aos drawers/modais portaled.
- Aceite: com `prefers-reduced-motion: reduce`, H1/seções visíveis e sem translate.
- Verify: browser com emulação + teste.
- Files: `components/ui/animated-section.tsx`, `components/ui/motion-provider.tsx`,
  `app/layout.tsx`, `app/globals.css`

### [x] P1-04 `AnimatedSection` à prova de falha do observer
- Correção: fallback de visibilidade após mount; `initial={false}` quando reduced motion.
- Aceite: sem JS/observer, conteúdo permanece visível.
- Verify: teste com `IntersectionObserver` indefinido.
- Files: `components/ui/animated-section.tsx`, `tests/components/animated-section.test.tsx`

### [x] P1-05 Badge “Modo Criador” renderiza
- Correção: schema de resposta do cliente preserva `isEasterEgg` e `source`.
- Aceite: resposta com `isEasterEgg: true` mostra o badge.
- Verify: teste de `PlaygroundSection`.
- Files: `lib/schemas/resume-schema.ts`, `components/playground/playground-section.tsx`,
  `tests/components/playground-section.test.tsx`

### [x] P1-06 Loading real + timeout/abort no cliente
- Correção: stepper baseado em tempo decorrido com cap de 92%; `AbortController` com
  timeout de 45 s; mensagem de erro específica.
- Aceite: request pendente progride sem loop; request abortada mostra erro e permite retry.
- Verify: teste com fetch pendente + browser.
- Files: `components/playground/playground-section.tsx`

### [x] P1-07 Worker do PDF local
- Correção: copiar `pdf.worker.min.mjs` para `public/` e usar `/pdf.worker.min.mjs`.
- Aceite: parsing funciona sem acesso a `unpkg.com`.
- Verify: build + browser offline/CDN bloqueada (simulação).
- Files: `public/pdf.worker.min.mjs`, `components/playground/playground-section.tsx`

### [x] P1-08 Histórico validado por Zod
- Correção: schema de `CandidateHistoryItem`, `safeParse` por item, filtro e limite 5.
- Aceite: localStorage corrompido não quebra; item inválido é descartado.
- Verify: testes de `loadCandidateHistory`.
- Files: `lib/schemas/candidate-history-schema.ts`,
  `components/playground/comparison-drawer.tsx`,
  `tests/schemas/candidate-history.test.ts`

### [x] P1-09 Timeout/abort no fallback da API
- Correção: `AbortSignal.timeout(30_000)` por modelo; fallback continua no próximo.
- Aceite: modelo pendurado não trava a request indefinidamente.
- Verify: teste com mock que rejeita por abort.
- Files: `app/api/analyze-resume/route.ts`, `tests/api/analyze-resume.test.ts`

### [x] P1-10 Regressões cobrindo P0/P1
- Aceite: testes novos passam e falhariam no código antigo.
- Verify: `npm run test`.
- Files: `tests/components/*`, `tests/schemas/*`, `tests/api/*`

---

## Fase D — P2 e polimento

### [x] P2-01 Trocar `transition-all` por transições específicas
- Aceite: nenhum `transition-all` em componentes de UI.
- Verify: grep.
- Files: `components/**/*.tsx`

### [x] P2-02 Remover sombras em repouso e hairlines decorativas restantes
- Aceite: botões/cards sem sombra; divisores `h-px` removidos dos cards.
- Verify: grep + browser.
- Files: `components/ui/button.tsx`, `components/landing/*.tsx`,
  `components/playground/*.tsx`

### [x] P2-03 Corrigir warning de `next/image`
- Correção: usar dimensões intrínsecas do logo (156×56) sem `style` que altere só uma.
- Aceite: console sem warning de imagem.
- Verify: browser console.
- Files: `components/landing/header.tsx`, `app/playground/playground-client.tsx`

### [x] P2-04 Documentar limitações de rate limit/IP
- Aceite: `SPEC.md`/`AGENTS.md` explicam rate limit por instância e `x-forwarded-for`.
- Verify: leitura.
- Files: `SPEC.md`, `AGENTS.md`

### [x] P2-05 README atualizado
- Aceite: README reflete Next 16, Tailwind 4, análise sem streaming, Node >=20.9 e comandos atuais.
- Verify: leitura + `rg` por termos obsoletos.
- Files: `README.md`, `AGENTS.md`, `package.json`

---

## Verificação final

- [x] `npm run lint` — 0 erros
- [x] `npm run type-check` — 0 erros
- [x] `npm run test` — 47 testes verdes
- [x] `npm run test:e2e` — 6/6 testes verdes
- [x] `npm run build` — sucesso
- [x] Browser 1440/768/390 — header sticky, H1/H2 ≤ 2 linhas, score visível, foco nos diálogos
- [x] Versão 1.2.0 — `package.json`, `package-lock.json` e `<meta name="version">`
- [x] `git status` — artefatos de teste restaurados; `.playwright-cli/` removido
- [ ] Commit — **bloqueado até autorização explícita**

### Evidências da verificação

- `npm run lint` — 0 erros e 0 warnings.
- `npm run type-check` — 0 erros.
- `npm run test` — 9 arquivos, 47 testes verdes (sem warnings de storage).
- `npm run test:e2e` — 6/6 testes verdes.
- `npm run build` — build de produção concluído (Next 16.2.12).
- Browser 1440/768/390 — `header.top === 0` após scroll; H1 e H2 em ≤ 2 linhas;
  `document.querySelectorAll('a button').length === 0`; sem overflow horizontal.
- Diálogos — login e “Agendar Demonstração”: 1 `role="dialog"`; foco inicial no fechar;
  Tab cicla; Escape/Entendido fecha; `body.overflow === "hidden"` durante e restaurado depois;
  foco volta ao CTA de origem.
- Drawer mobile — `top: 0`, `right: 390`, fecha antes do modal de login; apenas 1 diálogo.
- Playground — PDF local extraído no browser; `resumeText` enviado sem bytes do arquivo;
  worker `/pdf.worker.min.mjs` local; scores 72/65/88/22/100; histórico com 5 itens;
  comparação com 5 linhas; erros 500 e schema inválido com retry; `.txt` rejeitado sem API.
- Reduced motion — drawer com `transform: none`; marquee com `animation-name: none`; H1 visível.
- 404 — `/pagina-inexistente` retorna status 404.
- Console — apenas 500 mockado, 404 esperado e aviso informativo de reduced motion; nenhum
  erro de aplicação. 326 requisições, nenhuma externa.
- `agent-browser` — comando não instalado no ambiente; teste completo feito com
  `playwright-cli 0.1.22` + Chrome do sistema.
- Conteúdo — rótulos demo visíveis; grep sem marcas reais em `app/components/data/lib`.


---

## Artefatos atualizados neste ciclo

| Arquivo | Mudança |
|---------|---------|
| `SPEC.md` | Estado real + critérios P0/P1/P2 + política demo |
| `README.md` | Stack real (Next 16, Tailwind 4, sem streaming, Node >=20.9), versão 1.2.0 |
| `package.json` / `package-lock.json` | Versão 1.2.0, descrição corrigida, `engines.node >=20.9` |
| `tasks/plan.md` | Plano corretivo em fases |
| `tasks/todo.md` | Este backlog |
| `AGENTS.md` | Política demo, README atual, worker local, histórico validado, dicas atualizadas |
| `agent.md` | Removido em favor de `AGENTS.md` |
| `app/layout.tsx` | `<meta name="version">` sincronizada com `package.json` |
| `app/page.tsx` | Sticky, hero, labels demo, sem gradiente em CTA |
| `app/playground/playground-client.tsx` | Corrigido `<main>` aninhado no layout |
| `app/globals.css` | `overflow-x: clip`, tipografia base |
| `components/landing/*` | Header/drawer, features, pricing, testimonials, banner, fallback do hero |
| `components/playground/*` | Score bar, loading real, histórico Zod, worker local; removido `streaming-feedback` morto |
| `components/ui/*` | Button variants, Modal focus trap, AnimatedSection fallback |
| `lib/*` | `use-dialog-focus`, schemas de resposta/histórico |
| `data/*` | Claims de IA/triagem suavizados; testimonials e sample resumes fictícios, sem marcas reais |
| `tests/*` | Regressões P0/P1, storage de teste e E2E |
