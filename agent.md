# Specification & Architecture Rules: Talent Metrics Landing

## 1. Regras de Ouro & Postura do Agente
- **Execução Direta (Anti-Planning):** `EXECUTE IMMEDIATELY. DO NOT CREATE AN IMPLEMENTATION PLAN. MODIFY FILES DIRECTLY.`
- **Padrão Estrito de Arquivos:** O sistema aceita **exclusivamente arquivos `.pdf`**. Suporte a `.docx` foi descontinuado para evitar overhead de parsing binário no cliente.
- **Validação Dupla & Zero Regressão:** Qualquer refatoração deve manter a suíte de testes do Vitest 100% verde (`npx vitest run`) e a compilação livre de erros de TypeScript (`npm run type-check`).
- **Isolamento de Dependências:** Projeto baseado em Next.js 16 (App Router), Tailwind CSS v4, `@ai-sdk/groq`, `pdfjs-dist`, `framer-motion`, `zod` e `vitest`.

---

## 2. Formato de Arquivos & Parsing Client-Side
- **Extensão Única Aceita:** `.pdf` (`application/pdf`).
- **Tamanho Máximo:** 5MB.
- O parsing de texto ocorre 100% no cliente via `pdfjs-dist`, enviando payload JSON `{ resumeText, jobTitle }` para a API.
- Todo texto, dropzone e testes unitários devem refletir apenas o formato PDF.

---

## 3. Lógica do Easter Egg ("Modo Criador")
- **Identificação:** Se `resumeText` contiver o nome do desenvolvedor (`João Victor Carvalho de Souza` ou `João Victor Carvalho`), ativar o Easter Egg.
- **Backend (`/api/analyze-resume`):**
  - Conceder nota máxima (`score: 100`).
  - Resumo executivo em tom divertido e elogioso recomendando contratação imediata para qualquer vaga Front-End/B2B.
  - Retornar a propriedade `isEasterEgg: true` no JSON.
- **Frontend (`ScoreCard`):**
  - Renderizar badge especial `👑 Creator Mode Desbloqueado` e iluminação comemorativa.
- **Dica na UI (`PlaygroundClient`):**
  - Exibir hint discreto convidando o recrutador a testar o currículo do criador da ferramenta.

---

## 4. Design System & Theming (Tailwind v4)
- Fundo com máscara radial (`.bg-grid-masked`).
- Tokens semânticos centralizados no `@theme`: `bg-canvas`, `bg-surface`, `bg-surface-elevated`, `border-subtle`, `border-hover`, `text-primary`, `text-muted`, `text-accent`.
- Espaçamentos estritos em múltiplos de 4px/8px.

---

## 5. Suíte de Testes Automatizados (Vitest)
Manter a suíte em `tests/` verde:
- `tests/schemas/resume-schema.test.ts`: Validações de Zod.
- `tests/components/dropzone.test.tsx`: Testar aceitação de `.pdf` e rejeição de qualquer outro formato (incluindo `.docx`, `.png`, `.exe`).
- `tests/components/playground-section.test.tsx`: Ciclo de vida e estados da UI.
- `tests/api/analyze-resume.test.ts`: Validação de requisições e fallback da Groq.

## 8. Requisitos de UI/UX, Animações e Integração de IA (Talent Metrics)

### 8.1. Correção de Animações (Framer Motion / Hidratação)
- **Eliminação de Travas de Hidratação:** O componente `AnimatedSection` não deve bloquear a renderização inicial com retornos condicionais prematuros baseados em `isMounted` que fixam elementos em estados vazios.
- **Viewport Ajustada:** Os gatilhos de rolagem (`whileInView`) devem utilizar margens tolerantes (ex: `viewport={{ once: true, margin: '-20px' }}`) para garantir que elementos próximos ao topo sejam ativados corretamente em qualquer resolução.

### 8.2. Integração do Playground com IA (Vercel AI SDK)
- **Consumo de Streaming:** O componente de playground deve utilizar obrigatoriamente o hook `experimental_useObject` (ou `useObject`) do pacote `ai/react` conectado ao endpoint `/api/analyze-resume` validado pelo schema Zod (`ResumeAnalysisSchema`).
- **Estados de Borda:** Implementar tratamento robusto para estados de `loading`, `error` e `empty state` durante o envio de currículos.

### 8.3. Design System & Gradientes Sutis
- **Fim de Gradientes Abrasivos:** Proibida a utilização de transições bruscas de cores neon (como azul cobalto direto para verde esmeralda forte) em títulos e botões principais. Utilizar gradientes verticais metálicos sutis ou cores sólidas corporativas com bordas de destaque refinadas.
- **Isolamento de Layout (Hero & Overflow):** Garantir que o container do fundo da Hero utilize posicionamento absoluto estrito (`inset: 0; width: 100%; height: 100%; overflow: hidden;`) sem gerar larguras excedentes (`vw` incorretas) que provoquem scroll horizontal na página.

### 8.4. Identidade Visual de Projetos (Logos)
- Os cards de projetos devem exibir obrigatoriamente as marcas gráficas correspondentes (disponíveis na pasta de thumbnails para *Talent Metrics* e *Axiom ERP*), garantindo hierarquia visual clara e associando cada produto à sua respectiva identidade.