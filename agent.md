# Context & Instructions for AI Coding Agent

## 1. Visão Geral do Projeto
Você está atuando como um Engenheiro Front-End Sênior e Arquiteto de Software criando uma Landing Page B2B SaaS para uma plataforma de IA voltada à triagem e gestão de currículos para RH (Plataforma Fictícia para Fins de Estudo/Demonstração).

A aplicação conta com:
- **Landing Page SSG/ISR**: Focada em conversão, SEO e métricas Web Vitals impecáveis (LCP < 1.2s, CLS 0, INP otimizado).
- **Playground Interativo (Demo Gratuita)**: Formulário/Dropzone para upload de currículo (.pdf, .docx), integração em tempo real com IA via streaming para análise e scoring (0-100), pontos de combinação e recomendações de melhoria.

---

## 2. Tech Stack & Decisões Arquiteturais

| Categoria | Tecnologia Escolhida | Regra de Uso |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router, Server Components) | Manter código de servidor por padrão. Use `'use client'` apenas em componentes com estado/interatividade. |
| **Estilização** | Tailwind CSS + `clsx` / `tailwind-merge` | Design System modular, suporte nativo a modo escuro/claro e mobile-first. |
| **IA / Backend** | Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini) | Respostas em streaming via Serverless/Edge Functions com validação de payload via `zod`. |
| **Animações** | Framer Motion (`motion`) / CSS Nativos | Animações performáticas de entrada e scroll. RESPEITAR obrigatoriamente `prefers-reduced-motion`. |
| **Validação** | Zod + React Hook Form | Schemas estritos para payload do currículo e resposta estruturada da IA. |
| **Testes** | Vitest + React Testing Library + Playwright | Vitest para unitários/hooks; Playwright para E2E do fluxo de upload e análise. |

---

## 3. Diretrizes Rígidas de Desenvolvimento

### 3.1. Performance & Carregamento
- **Hero Section**: NUNCA utilizar vídeos pesados no Hero sem fallback ou sem otimização extrema. Priorizar SVG animado, gradients via CSS ou Canvas/WebGL sutil. Se houver mídia, aplicar `poster` WebP/AVIF com `fetchpriority="high"`.
- **Animações de Entrada**: Não bloquear o FCP (First Contentful Paint) com splash screens longas ou contadores de carregamento fictícios.
- **Aviso de Projeto Fictício**: Implementar como um **Banner Topo Fixo (Dismissible)** armazenado em `localStorage`, e NÃO como uma animação que impede a navegação inicial do usuário.

### 3.2. Acessibilidade (WCAG 2.2 Level AA)
- Todos os elementos interativos devem ter foco visível e navegação funcional via teclado (`Tab`, `Space`, `Enter`).
- O Dropzone de arquivos deve possuir `role="button"`, `tabIndex={0}` e suporte explicito a `aria-describedby` listando os formatos aceitos (`.pdf`, `.docx`, max 5MB).
- O painel de resultado da IA que recebe streaming deve possuir a propriedade `aria-live="polite"` para anúncio automático por leitores de tela à medida que os dados chegam.

### 3.3. Padrões de Código e Convenções
- **TypeScript Estrito**: Tipagem explícita em todos os arquivos. Proibido o uso de `any`.
- **Componentização**:
  - `components/ui`: Componentes atômicos genéricos de UI (Button, Card, Badge, Modal).
  - `components/landing`: Seções estáticas da landing page (Hero, Features, Pricing, Testimonials).
  - `components/playground`: Componentes dinâmicos de teste de IA (Dropzone, ScoreDashboard, StreamingFeedback).
- **Estrutura de API Routes**:
  - Utilizar Vercel AI SDK (`streamText` ou `streamObject`) integrando com Gemini.
  - Tratar retornos de erro (Rate Limit, PDF ilegível, tamanho excedido) com status HTTP semânticos (400, 429, 500).

---

## 4. Schemas de Dados (Zod Contract)

Sempre que manipular retornos da análise da IA, utilize a seguinte estrutura estrita:

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