# 🚀 Talent Metrics AI — Platform & Playground

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.1_Instant-orange?style=for-the-badge)
![Vitest](https://img.shields.io/badge/Vitest-Passing-6E9F18?style=for-the-badge&logo=vitest)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Plataforma B2B SaaS de triagem e inteligência de recrutamento voltada para times de RH. O projeto conta com uma Landing Page focada em alta conversão e Web Vitals impecáveis, além de um **Playground Interativo** de análise de currículos impulsionado por Inteligência Artificial em tempo real.

> ⚠️ **Aviso Legal:** Esta aplicação é um projeto de demonstração técnica e portfólio acadêmico/profissional. Os dados e marcas exibidos têm fins exclusivamente ilustrativos.

---

## 🛠️ Tech Stack & Decisões Arquiteturais

| Camada | Tecnologia | Função Arquitetural |
| :--- | :--- | :--- |
| **Core Framework** | Next.js (App Router) | Renderização SSG/ISR para a Landing Page e CSR reativo para a ferramenta. |
| **Linguagem** | TypeScript (Strict) | Tipagem estrita com zero uso de `any` para confiabilidade do código. |
| **Estilização** | Tailwind CSS + `clsx` | Design system responsivo com animações leves via Framer Motion. |
| **IA & Backend** | Vercel AI SDK + Groq API | Processamento de linguagem natural com o modelo `Llama 3.1 Instant (Groq LPU)`. |
| **Parsing PDF** | `pdfjs-dist` (Client-Side) | Extração de texto no navegador do usuário, garantindo payload leve (JSON). |
| **Validação** | Zod | Schemas estritos para garantia do formato de resposta estruturada da IA. |
| **Testes** | Vitest + React Testing Library | Cobertura unitária e de integração de componentes e schemas Zod. |

---

## ⚡ Principais Funcionalidades

- 📄 **Parsing de Currículo no Cliente:** Processamento do arquivo PDF diretamente no navegador, eliminando o envio de arquivos pesados ao servidor.
- 🎯 **Scoring Ponderado (0-100):** Cálculo de compatibilidade do candidato com base no currículo e no cargo-alvo configurado.
- 💡 **Análise Qualitativa:** Emissão instantânea de resumo executivo, pontos fortes alinhados à vaga e sugestões de melhoria no documento.
- ♿ **Acessibilidade (WCAG 2.2 AA):** Suporte total à navegação por teclado (`Tab`, `Enter`, `Space`) e anúncios em tempo real via `aria-live="polite"`.
- 🛡️ **UX Defensiva:** Tratamento gracioso dos estados de interface: *Empty*, *Loading (Skeleton Screen)*, *Success* e *Error*.

---

## 🏗️ Estrutura do Projeto

```text
talent-metrics-landing/
├── app/
│   ├── api/
│   │   └── analyze-resume/
│   │       └── route.ts          # Endpoint Serverless (Groq AI Integration)
│   ├── playground/
│   │   └── page.tsx              # Página isolada da ferramenta de teste
│   ├── globals.css               # Estilos globais e tokens do Tailwind
│   ├── layout.tsx                # Shell de layout com Banner Legal Fixo
│   └── page.tsx                  # Landing Page promocional
├── components/
│   ├── ui/                       # Componentes primitivos (Button, Card, Modal, Badge)
│   ├── landing/                  # Seções promocionais (Hero, Features, Pricing)
│   └── playground/               # UI do Playground (Dropzone, ScoreCard, SkeletonCard)
├── lib/
│   ├── schemas/
│   │   └── resume-schema.ts      # Schema Zod para contrato de dados da IA
│   └── utils.ts                  # Utilitários globais (`cn`)
└── tests/                        # Suíte de testes com Vitest
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js `v18.0.0` ou superior
- npm ou pnpm

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/soudevictor/talent-metrics-landing.git
   cd talent-metrics-landing
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto contendo sua chave de API gratuita do Groq:
   ```env
   GROQ_API_KEY="gsk_sua_chave_groq_aqui"
   ```
   *(Obtenha uma chave gratuita em: [console.groq.com](https://console.groq.com/))*

4. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:3000` no seu navegador.

5. **Executar a Suíte de Testes:**
   ```bash
   npm run test
   ```

---

## 👤 Contato

Desenvolvido por **João Victor Carvalho de Souza** (`devictor`).

- **Portfolio:** [soudevictor.vercel.app](https://soudevictor.vercel.app/)
- **LinkedIn:** [in/soudevictor](https://www.linkedin.com/in/soudevictor/)
- **GitHub:** [@soudevictor](https://github.com/soudevictor)

---

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).