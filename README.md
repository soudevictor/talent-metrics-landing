# TalentMetrics — Landing + Playground (demo)

![Version](https://img.shields.io/badge/version-1.2.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq](https://img.shields.io/badge/Groq-API-orange?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=for-the-badge&logo=vitest)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Demo em português de uma plataforma B2B de triagem de currículos: uma landing page em `/` e um playground de análise com IA em `/playground`.

> **Aviso:** este é um projeto de estudo e portfólio, não um SaaS real. Nomes, empresas,
> depoimentos, preços, métricas e currículos de exemplo são fictícios e estão rotulados como
> demonstração. Nenhuma marca ou logo de terceiro é usada como cliente.

---

## Stack

| Camada | Tecnologia | Uso no projeto |
| :--- | :--- | :--- |
| Framework | Next.js 16 (App Router) | Landing como Server Component; ilhas client para header, modais, animações e playground |
| Linguagem | TypeScript strict | Sem `any` no código de aplicação |
| Estilo | Tailwind CSS 4 | Tokens em `app/globals.css` (`@theme`), sem `tailwind.config.*` |
| IA | Vercel AI SDK + Groq | `generateObject` com fallback de modelos; a resposta **não é streaming** |
| PDF | `pdfjs-dist` no cliente | Extração de texto apenas para PDF de até 5 MB; worker local em `public/` |
| Validação | Zod | Entrada da API, resposta da IA e histórico do playground |
| Testes | Vitest + Testing Library + Playwright | Unidade/integração e E2E em Chromium |

### Limitações conhecidas

- O rate limit é em memória: **10 requisições/min por IP, por instância**. Em serverless o limite efetivo pode ser maior.
- `getClientIp` confia em `x-forwarded-for`/`x-real-ip`; use atrás de um proxy confiável.
- O playground é `noindex`; a landing é indexável.
- Não há autenticação real; o modal de login é apenas demonstrativo.
- Creator mode (score 100) só funciona com `NODE_ENV=development` e `ENABLE_CREATOR_MODE=true`, além do nome do criador no currículo.

---

## Funcionalidades

- Landing responsiva com header sticky, navegação mobile, modal de login acessível e seções de recursos, planos e depoimentos fictícios.
- Extração de PDF no navegador com worker local, sem enviar o arquivo ao servidor.
- Scoring de 0 a 100, resumo, pontos fortes, pontos de melhoria e perguntas de entrevista.
- Estados de interface `empty`, `loading`, `error` e `success`, com timeout de 45 s no cliente e 30 s por tentativa de modelo no servidor.
- Histórico local de até 5 candidatos, validado com Zod e comparável em drawer.
- Acessibilidade: foco visível, focus trap nos diálogos, fechamento com `Escape`, restauração de foco, scroll lock e respeito a `prefers-reduced-motion`.

---

## Estrutura

```text
app/
├── api/analyze-resume/route.ts   # Validação, rate limit e Groq
├── playground/                   # Página noindex + cliente do playground
├── globals.css                   # Tokens Tailwind 4 e regras globais
├── layout.tsx                    # Metadata, banner demo e MotionProvider
└── page.tsx                      # Landing
components/
├── landing/                      # Header, hero, features, pricing, depoimentos
├── playground/                   # Dropzone, ScoreCard, histórico, loading
└── ui/                           # Button, Modal, AnimatedSection, MotionProvider
data/                             # Conteúdo fictício de demonstração
lib/                              # Schemas, rate limit, segurança e foco de diálogo
public/pdf.worker.min.mjs         # Worker local do PDF.js
tests/                            # Vitest e Playwright
```

---

## Como executar

Pré-requisitos: **Node.js >= 20.9** e npm (`package-lock.json`).

```bash
npm install
npm run dev
```

Crie `.env.local` na raiz com:

```env
GROQ_API_KEY="sua_chave_groq"
# opcional: sobrescreve o modelo principal
# GROQ_MODEL_ID="modelo"
```

Acesse `http://localhost:3000` e `http://localhost:3000/playground`.

### Scripts

```bash
npm run dev          # desenvolvimento em :3000
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run test         # Vitest
npm run test:e2e     # Playwright (inicia o dev server)
npm run build        # build de produção
```

Não há CI configurado. Verifique localmente na ordem: `lint` → `type-check` → `test` → `build`; rode E2E para mudanças no playground, navegação ou acessibilidade.

---

## Conteúdo de demonstração

Os arquivos em `data/` são fictícios e rotulados na interface. Não adicione marcas, logos ou clientes reais. Tecnologias reais (Groq, Next.js, React, etc.) aparecem apenas como referência factual de stack.

---

## Contato

Desenvolvido por **João Victor Carvalho de Souza** (`soudevictor`).

- Portfólio: [soudevictor.vercel.app](https://soudevictor.vercel.app/)
- LinkedIn: [in/soudevictor](https://www.linkedin.com/in/soudevictor/)
- GitHub: [@soudevictor](https://github.com/soudevictor)

## Licença

MIT. Veja [LICENSE](LICENSE).
