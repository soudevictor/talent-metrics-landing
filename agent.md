# Context & Instructions for AI Coding Agent

## 1. Visão Geral do Projeto

[cite_start]Você está atuando como um Engenheiro Front-End Sênior e Arquiteto de Software evoluindo a aplicação **Talent Metrics Landing** (`talent-metrics-landing`). [cite_start]Trata-se de uma plataforma B2B SaaS de triagem e análise de currículos por IA voltada para recrutadores de RH[cite: 2, 3].

A aplicação divide-se estritamente em duas rotas principais:

1. [cite_start]**Landing Page Promocional (`app/page.tsx`)**: Rota principal (`/`), focada em apresentação do produto, proposta de valor, funcionalidades, planos de preço, depoimentos e conversão[cite: 37, 80]. [cite_start]Renderizada via SSG/ISR para Web Vitals impecáveis (LCP < 1.2s, CLS 0)[cite: 37].
2. [cite_start]**Playground de Teste da Ferramenta (`app/playground/page.tsx`)**: Rota dedicada (`/playground`) onde o recrutador pode testar a ferramenta gratuitamente de forma simplificada[cite: 7, 38].

---

## 2. Tech Stack & Decisões Arquiteturais

| Categoria        | Tecnologia Escolhida                                 | Regra de Uso                                                                                                                                    |
| :--------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**    | Next.js (App Router, Server Components)              | [cite_start]Manter lógica no servidor por padrão[cite: 68]. [cite_start]Usar `'use client'` apenas em componentes com interatividade[cite: 38]. |
| **Estilização**  | Tailwind CSS + `clsx` + `tailwind-merge`             | [cite_start]Design System modular com suporte a mobile-first e classe utilitária `cn()`[cite: 64, 154, 164].                                    |
| **IA / Backend** | Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini 2.0) | [cite_start]Respostas em streaming estruturado via Serverless/Edge Function `/api/analyze-resume`[cite: 41, 107].                               |
| **Validação**    | Zod (`ResumeAnalysisSchema`) + React Hook Form       | [cite_start]Schema estrito para estruturar o retorno da IA (nota 0-100, resumo, pontos de alinhamento e melhoria)[cite: 42, 65].                |
| **Animações**    | Framer Motion (`motion`) / CSS Nativos               | [cite_start]Animações leves respeitando obrigatoriamente a regra `prefers-reduced-motion`[cite: 48, 163].                                       |
| **Testes**       | Vitest + React Testing Library + Playwright          | Vitest para unitários/componentes; [cite_start]Playwright para E2E do fluxo de upload[cite: 34, 49, 50].                                        |

---

## 3. Diretrizes Rígidas de Desenvolvimento & Acessibilidade

### 3.1. Estrutura de Rotas e Navegação

- [cite_start]`app/page.tsx`: Landing Page promocional limpa[cite: 68, 80]. Botões de CTA "Testar Grátis" ou "Experimentar" devem redirecionar para `/playground`.
- `app/playground/page.tsx`: Página isolada contendo o formulário de contextualização da vaga, a Dropzone de upload e o dashboard de resultado (`ScoreCard`).
- [cite_start]`app/api/analyze-resume/route.ts`: Endpoint da API responsável por receber o arquivo (PDF/DOCX), extrair o texto e realizar o streaming do schema Zod com o Gemini via Vercel AI SDK[cite: 39, 106, 107].

### 3.2. UX Defensiva & Estados de UI (Obrigatório)

[cite_start]Tanto no Playground quanto na landing page, deve-se tratar rigorosamente os 4 estados de interface[cite: 62, 155]:

1. [cite_start]**Empty State**: Zona de drop com bordas tracejadas, ícone explicativo e formatos aceitos (`.pdf`, `.docx`, máx. 5MB)[cite: 43, 155].
2. [cite_start]**Loading State**: Skeleton Loader com dimensões exatas do dashboard para zerar o Cumulative Layout Shift (CLS) durante o streaming da IA[cite: 44, 156].
3. [cite_start]**Error State**: Fallbacks visuais amigáveis para falhas de leitura, arquivo corrompido, tamanho excedido (>5MB) ou limite de cota da API[cite: 45, 157].
4. [cite_start]**Streaming State**: Apresentação progressiva da pontuação (0 a 100), resumo executivo e tópicos de recomendação[cite: 44, 158].

### 3.3. Acessibilidade (WCAG 2.2 Level AA)

- [cite_start]**Teclado**: A Dropzone deve possuir `tabIndex={0}`, `role="button"` e ser acionável via `Space` ou `Enter`[cite: 46, 98].
- [cite_start]**Leitores de Tela**: O container que recebe a análise por streaming no `/playground` DEVE ter a propriedade `aria-live="polite"`[cite: 47, 101, 161].
- [cite_start]**Banner Legal Fixo**: Implementar um `DisclaimerBanner` no topo de `app/layout.tsx` (avisando sobre o caráter fictício para estudo) com botão para ocultar e estado persistido no `localStorage` (`hasDismissedDisclaimer`)[cite: 32, 93].

---

## 4. Schemas de Dados (Zod Contract)

[cite_start]Utilize e exporte este contrato de dados em `lib/schemas/resume-schema.ts`[cite: 65]:

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

## 5. Estratégia de Testes Automatizados (Vitest)

Todos os fluxos cruciais devem ser cobertos com testes em tests/:

    tests/schemas/resume-schema.test.ts: Validação de objetos válidos e rejeição de dados fora do intervalo (ex: score < 0 ou > 100).

    tests/components/dropzone.test.tsx: Teste do componente Dropzone para upload de extensões permitidas (.pdf, .docx) e rejeição de inválidas (.png, .exe) com mensagens de erro.

    tests/api/analyze-resume.test.ts: Mock de chamadas da Vercel AI SDK e teste de tratamento de erros HTTP (400, 500).

## 6. Instruções de Implementação para o Agent

    Escreva código TypeScript estrito (strict: true), limpo e sem o uso de any.

    Não misture o código da Landing Page (/) com o da ferramenta de teste (/playground).

    Ao finalizar as modificações, rode a suíte de testes do Vitest e garanta 100% de aprovação antes de concluir a tarefa.
```
