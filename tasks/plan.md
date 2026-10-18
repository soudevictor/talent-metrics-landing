# Plano de Implementação — Talent Metrics Landing Upgrade

Este plano organiza o trabalho em 4 sprints sequenciais, cada um com um objetivo entregável e verificável. A ordem respeita dependências: o design system e tokens devem estar prontos antes das seções; as seções da landing antes do playground; animações e testes por último, mas em paralelo com o refinamento de cada sprint.

## Sprint 1 — Design System & Hero (Fundação)
**Objetivo:** Estabelecer a base visual (tokens, paleta esverdeada ajustada, tipografia, componentes primitivos) e reescrever a seção Hero da landing segundo as regras de casa (sem gradientes abrasivos, sem eyebrows, títulos em 2 linhas, movimento intencional).

**Dependências:** Nenhuma (início imediato).
**Paralelizável com:** Nada (é a base dos próximos sprints).
**Entregável:** Landing com hero revisado e design system consistente; `npm run build` e `npm run type-check` passando.

**Riscos:**
- Escolha de tom de verde que não contraste bem com o fundo escuro (`#09090b`). Mitigação: testar contraste antes de fechar a paleta.
- Vídeo de fundo causando CLS. Mitigação: manter imagem estática como fallback imediato e `overflow: hidden` estrito.

---

## Sprint 2 — Seções Internas da Landing (Features, Pricing, Testimonials, Footer)
**Objetivo:** Reescrever as seções Features, Pricing, Testimonials e Footer com composições variadas (sem grids de cards idênticos), usando o design system do Sprint 1. Incluir partner marquee e CTA buttons.

**Dependências:** Sprint 1.
**Paralelizável com:** Nada dentro deste sprint (as seções compartilham o mesmo design system, mas podem ser escritas em ordem independente uma vez que os tokens estejam prontos).
**Entregável:** Landing page completa com todas as seções revisadas; `npm run test` 100% verde.

**Riscos:**
- Grid de cards idênticos voltando por hábito. Mitigação: usar composições distintas por seção (ex: features em colunas alternadas, pricing em coluna central destacada, testimonials em faixa larga).
- Depoimentos fictícios sendo apresentados como reais. Mitigação: manter o aviso legal visível e não inventar dados.

---

## Sprint 3 — Playground & API (Funcionalidade de IA)
**Objetivo:** Revisar a página `/playground` (dropzone, scorecard, estados de loading/error/empty), garantir o uso correto de `useObject`/`experimental_useObject` com schema Zod, e validar o endpoint `/api/analyze-resume` (incluindo Easter Egg do criador, rate limiting, sanitização de prompt injection).

**Dependências:** Sprint 1 (design system para componentes UI do playground).
**Paralelizável com:** Sprint 2 pode estar em andamento, mas o playground depende dos componentes primitivos (`Button`, `Card`, `Badge`) já finalizados.
**Entregável:** Playground funcional com estados defensivos; testes de API e componentes passando.

**Riscos:**
- Streaming da Groq falhando sem fallback. Mitigação: implementar fallback de modelo e estado de error visível.
- Hidratação travada no `AnimatedSection` do playground. Mitigação: remover `isMounted` condicional prematuro.

---

## Sprint 4 — Animações, Acessibilidade, Testes E2E e Deploy
**Objetivo:** Camada de movimento (entrada sequencial por seção, feedback de controles, pelo menos 8 elementos em movimento), respeitar `prefers-reduced-motion`, garantir WCAG 2.2 AA (teclado, foco, aria-live), rodar testes E2E com Playwright, validar Web Vitals (LCP < 2.5s, CLS < 0.1) e preparar para deploy na Vercel gratuita.

**Dependências:** Sprints 1, 2 e 3.
**Paralelizável com:** Refinamento final de qualquer seção anterior.
**Entregável:** Projeto completo pronto para produção; `npm run test`, `npm run test:e2e`, `npm run type-check`, `npm run lint` e `npm run build` todos passando.

**Riscos:**
- Animações exageradas poluindo a página. Mitigação: seguir a regra de "uma assinatura de movimento + entradas sequenciais + feedback de controle".
- Deploy na Vercel gratuita falhando por variáveis de ambiente. Mitigação: verificar `GROQ_API_KEY` no painel da Vercel antes do deploy final.

## Verificação entre fases
Antes de iniciar cada sprint, confirmar:
- [ ] Sprint anterior com `npm run test` 100% verde
- [ ] `npm run type-check` sem erros
- [ ] `npm run lint` sem erros
- [ ] Critérios de sucesso do sprint anterior atendidos
