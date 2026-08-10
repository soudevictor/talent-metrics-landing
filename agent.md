# Agent Instructions & Context: Talent Metrics Landing

## 1. Regra de Ouro (Anti-Planning & Token Saving)
EXECUTE IMMEDIATELY. DO NOT CREATE AN IMPLEMENTATION PLAN. MODIFY FILES DIRECTLY.
Você é um agente de execução. Sob nenhuma hipótese gere textos estruturando o que você vai fazer ou planos de implementação. Analise os arquivos, escreva as refatorações completas e finalize. Se a requisição for grande, faça-a na íntegra.

## 2. Visão Geral do Projeto
Você atua como Engenheiro Front-End e Arquiteto de Software evoluindo a **Talent Metrics Landing**.
Trata-se de uma plataforma B2B SaaS de triagem de currículos por IA para recrutadores, dividida em:
- `/` (Landing Page): Foco em conversão, métricas Core Web Vitals (LCP < 1.2s), animações otimizadas.
- `/playground` (Ferramenta): Upload de currículos e análise em tempo real com Gemini.

## 3. Tech Stack & Regras Arquiteturais
- **Framework:** Next.js (App Router, TypeScript estrito, sem uso de `any`).
- **Estilo & UI:** Tailwind CSS, componentes acessíveis (WCAG 2.2), animações com Framer Motion (respeitando `prefers-reduced-motion`). Todas as transições de UI devem evitar o Cumulative Layout Shift (CLS).
- **Tratamento de Estado de UI (Defensivo):** Todas as integrações precisam exibir explicitamente os estados: `Empty` (Vazio), `Loading` (Skeleton Loaders), `Error` (Toast ou Banner claro) e `Success`.
- **Testes:** Vitest para unitários (Schemas, Funções) e de componentes.

## 4. Integração IA (Groq com Llama 3.3)
Para evitar falhas de streams vazios e garantir alta performance, a rota de API backend (`app/api/analyze-resume/route.ts`) DEVE seguir este fluxo ESTRITO:
1. Usar a função `generateObject` (e NÃO `streamObject`) do `ai` com o provider `@ai-sdk/groq`.
2. A extração de texto de PDF/DOCX deve acontecer no client-side (no frontend, usando bibliotecas como `pdfjs-dist`). O frontend deve enviar apenas o payload JSON contendo `resumeText` e `jobTitle` para a API.
3. Todo o bloco de execução da IA deve estar dentro de um `try/catch`. 
4. Em caso de falha da IA, a rota **OBRIGATORIAMENTE** deve retornar `NextResponse.json({ error: aiError.message }, { status: 500 })`. Jamais retornar 200 OK com erro.

### 4.1 Contrato Estrito de Retorno (Zod Schema)
O arquivo `lib/schemas/resume-schema.ts` deve definir a estrutura:
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

4.2 Lógica do Front-End (Playground)

O front-end (components/playground/playground-section.tsx) deve fazer um fetch comum.
Deve validar if (!response.ok), extrair o JSON do erro gerado pelo Backend (ex: const errorData = await response.json()) e exibi-lo formatado no UI State de erro, evitando a mensagem "Unexpected end of JSON input".