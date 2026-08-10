# Context & Instructions for AI Coding Agent

## 1. Visão Geral do Projeto
Você está atuando como Engenheiro Front-End Sênior e Arquiteto de Software evoluindo a aplicação **Talent Metrics Landing** (`talent-metrics-landing`). Trata-se de uma plataforma B2B SaaS de triagem e análise de currículos por IA voltada para recrutadores de RH.

A aplicação divide-se estritamente em duas rotas principais:
1. **Landing Page Promocional (`app/page.tsx`)**: Rota principal (`/`), focada em apresentação do produto, proposta de valor, funcionalidades, planos de preço, depoimentos e conversão. Renderizada via SSG/ISR para Web Vitals impecáveis (LCP < 1.2s, CLS 0).
2. **Playground de Teste da Ferramenta (`app/playground/page.tsx`)**: Rota dedicada (`/playground`) onde o recrutador testa a ferramenta de análise de currículos em tempo real.

---

## 2. Tech Stack & Decisões Arquiteturais

| Categoria | Tecnologia Escolhida | Regra de Uso |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Server Components) | Manter lógica no servidor por padrão. Usar `'use client'` apenas onde houver interatividade. |
| **Estilização** | Tailwind CSS + `clsx` + `tailwind-merge` | Design System modular com suporte a mobile-first e classe utilitária `cn()`. |
| **IA / Backend** | Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini 2.0) | Respostas em streaming estruturado via Serverless Function em `/api/analyze-resume`. |
| **Validação** | Zod (`ResumeAnalysisSchema`) + React Hook Form | Schema estrito para estruturar o retorno da IA (nota 0-100, resumo, pontos fortes e melhorias). |
| **Animações** | Framer Motion (`motion`) / CSS Nativos | Animações fluidas de entrada/scroll. Respeitar obrigatoriamente `prefers-reduced-motion`. |
| **Testes** | Vitest + React Testing Library + Playwright | Vitest para unitários/componentes; Playwright para E2E do fluxo de upload. |

---

## 3. Diretrizes Rígidas de Desenvolvimento & Acessibilidade

### 3.1. Correção de Animações e UX
- **Revisão do `AnimatedSection` (`components/ui/animated-section.tsx`)**:
  - Corrigir o travamento de hidratação e a margem de viewport. O componente deve animar suavemente (fade-in + elevação de Y: 20px para 0px) sem piscar ou bloquear elementos na renderização inicial.
  - Aplicar animações sutis de hover nos cards de recursos e preços.

### 3.2. Integração da IA no Playground (`/playground`)
- Front-End (`components/playground/playground-section.tsx`): Consumir o endpoint `/api/analyze-resume` via streaming usando `experimental_useObject` (Vercel AI SDK) para atualizar o dashboard `ScoreCard` em tempo real.
- Backend (`app/api/analyze-resume/route.ts`):
  - Ler o `GOOGLE_GENERATIVE_AI_API_KEY` do ambiente.
  - Se a chave estiver presente, fazer o streaming estruturado com Gemini 2.0 Flash baseado no `ResumeAnalysisSchema`.
  - Se a chave estiver ausente, retornar o mock com simulação de tempo realista para ambiente de desenvolvimento.

### 3.3. Acessibilidade (WCAG 2.2 Level AA) & Interatividade
- **Navegação de Upload**: A Dropzone deve possuir `tabIndex={0}`, `role="button"` e aceitar acionamento via teclado (`Space` / `Enter`).
- **Anúncio de Stream**: O container de resultados no `/playground` deve possuir `aria-live="polite"`.
- **Disclaimer Banner**: Exibir o banner legal superior fixo avisando sobre o projeto de estudo, gravando a dispensa no `localStorage`.
- **Modais Institucionais**: CTAs de "Agendar Demonstração" e "Entrar" devem abrir um modal explicativo com links do portfólio e GitHub do desenvolvedor (`soudevictor`).

---

## 4. Schema de Dados da IA (Zod Contract)

O contrato de dados em `lib/schemas/resume-schema.ts` deve seguir a estrutura:

```typescript
import { z } from 'zod';

export const ResumeAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  matchingPoints: z.array(z.string()),
  improvementPoints: z.array(z.string()),
  matchPercentageByRole: z.record(z.string(), z.number()).optional(),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
```

---

## 5. Estratégia de Testes Automatizados (Vitest)

Todos os fluxos cruciais devem ser validados em `tests/`:
1. `tests/schemas/resume-schema.test.ts`: Validação de payloads válidos e rejeição de dados fora dos limites do Zod.
2. `tests/components/dropzone.test.tsx`: Validação do upload, aceitação de `.pdf`/`.docx` e bloqueio de extensões não permitidas.
3. `tests/api/analyze-resume.test.ts`: Teste do endpoint com mocks do AI SDK e cenários de erro HTTP (400, 500).

---

## 6. Instruções de Execução para o Agent
1. Escreva código TypeScript estrito (`strict: true`), limpo e sem o uso de `any`.
2. Garanta que todas as animações da Landing Page funcionem e que o streaming da IA no Playground atualize o placar dinamicamente.
3. Ao finalizar, rode a suíte de testes (`npx vitest run`) e garanta 100% de aprovação antes de concluir.