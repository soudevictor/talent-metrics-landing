# Plano de Correção — Talent Metrics 2026-10

Este plano substitui o antigo “4 sprints concluídos”. A auditoria de 22/10/2026 encontrou
regressões visuais, de acessibilidade e de confiabilidade que os sprints anteriores não
capturaram. O trabalho agora é **corretivo e verificável**, em quatro fases com dependência
explícita.

## Fase A — Documentos e política (base)

**Objetivo:** alinhar spec, plano, backlog e `AGENTS.md` com o estado real do código e com a
decisão do cliente sobre conteúdo fictício.

**Dependências:** nenhuma.
**Entregável:** `SPEC.md`, `tasks/plan.md`, `tasks/todo.md`, `AGENTS.md` atualizados;
`agent.md` removido em favor de `AGENTS.md`.
**Riscos:** repetir alegações antigas sem medição. Mitigação: só marcar `[x]` após verificação;
estados “Parcial” e “Não atingido” são permitidos.

---

## Fase B — P0 (bloqueadores de uso)

**Objetivo:** devolver navegação, leitura e interação básicas.

1. **Sticky real:** trocar `overflow-hidden`/`overflow-x: hidden` por `overflow-x: clip`;
   banner demo deixa de ser `sticky`.
2. **Ritmo das features:** `space-y-12` entre linhas; remover badge/eyebrow da sub-seção ATS.
3. **Score legível:** cor de fundo separada da cor de texto no `ScoreCard`.
4. **Diálogos:** hook único de focus trap + restore + scroll lock; Header centraliza o modal
   de login; drawer fecha antes do modal abrir.
5. **Conteúdo demo:** rótulos visíveis em pricing/testimonials/parceiros; remover marcas reais
   (Greenhouse/Gupy) e manter apenas ficção.
6. **Camadas:** drawer/modal em portal acima do header/banner; banner sem `z-50`.

**Dependências:** Fase A (critérios acordados).
**Entregável:** P0-01…P0-06 verdes em browser + testes de regressão.
**Riscos:**
- `overflow-x: clip` não suportado em navegador antigo → fallback visual aceitável; testar
  Chromium atual.
- Focus trap quebrar navegação normal → limitar o trap ao diálogo aberto e restaurar o foco.
- Rótulos demo demais poluírem a página → usar uma linha discreta por seção, não um banner
  repetido.

---

## Fase C — P1 (qualidade e confiabilidade)

**Objetivo:** eliminar os problemas que fazem o demo parecer quebrado mesmo depois do P0.

1. **Hero:** H1 ≤ 2 linhas em 1440/768/390; remover chip/eyebrow; escala responsiva.
2. **Semântica de links:** `buttonVariants()` para CTAs; nenhum `<a><button>`.
3. **Motion acessível:** `AnimatedSection` com fallback de visibilidade; reduced motion
   mantém conteúdo; drawers sem depender de animação para aparecer.
4. **Easter egg:** schema de resposta do cliente preserva `isEasterEgg`.
5. **Loading real:** progresso por tempo decorrido (cap 92%), `AbortController` com timeout
   de 45 s, erro específico e retry.
6. **PDF local:** copiar worker para `public/` e usar `/pdf.worker.min.mjs`.
7. **Histórico:** schema Zod, `safeParse` por item, limite 5, tolerância a lixo.
8. **API:** timeout/abort por modelo no fallback; sem request pendurada.

**Dependências:** Fase B (especialmente diálogos e banner).
**Entregável:** P1-01…P1-10 verdes; testes novos cobrindo cada correção.
**Riscos:**
- Worker local aumentar o bundle → é asset estático, não entra no JS bundle.
- Timeout curto demais derrubar análise legítima → 30 s por modelo, 45 s no cliente.
- Alterar schema de resposta quebrar o playground → schema novo é aditivo
  (`ResumeAnalysisSchema.extend`).

---

## Fase D — P2, verificação e entrega

**Objetivo:** polir o que sobrou, provar que não houve regressão e deixar o repositório limpo.

1. `transition-all` → transições específicas; remover sombras em repouso e hairlines
   decorativas restantes.
2. Corrigir warning de `next/image` no logo (dimensões intrínsecas 156×56).
3. Documentar limitações: rate limit por instância, confiança em `x-forwarded-for` e README
   atualizado com o stack real.
4. Rodar `lint` → `type-check` → `test` → `build`.
5. Rodar E2E com cuidado: restaurar `playwright-report/index.html` e
   `test-results/.last-run.json` se forem reescritos.
6. Verificar no browser em 1440/768/390: header sticky, H1, score, foco, drawer, reduced
   motion.

**Dependências:** Fases B e C.
**Entregável:** checklist final completo; nenhum commit sem autorização.
**Riscos:**
- E2E reutilizar dev server velho → reiniciar/validar a porta 3000.
- Artefatos rastreados serem commitados por engano → `git status` antes de qualquer commit.

---

## Ordem de execução

```
A (docs) → B (P0) → C (P1) → D (P2 + verificação)
```

Dentro da Fase B, a ordem é: camadas/sticky → features → score → diálogos → conteúdo demo.
Dentro da Fase C: hero/links → motion → Easter egg → loading → PDF/histórico → API.

## Critérios de parada

- Um P0 só fecha com evidência no browser **e** teste de regressão.
- Um P1 pode ser aceito como dívida **se** documentado no `tasks/todo.md` com justificativa.
- Nenhuma fase avança com `lint`/`type-check`/`test` vermelhos.
- Nenhum commit é criado sem autorização explícita.

## Verificação entre fases

- [ ] Fase A: documentos revisados e `agent.md` resolvido.
- [ ] Fase B: P0 verdes em browser + testes.
- [ ] Fase C: P1 verdes + testes.
- [ ] Fase D: `lint`, `type-check`, `test`, `build`, E2E e browser.
