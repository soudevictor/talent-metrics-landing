# AGENTS.md

TalentMetrics is a pt-BR Next.js 16 demo: a marketing landing at `/` and an AI
resume-analysis playground at `/playground`. Keep new user-facing copy in Portuguese.
`README.md` documents the current stack and commands; keep it in sync with `package.json`,
configs, `SPEC.md`, and source.

This is a **study/portfolio demo**, not a real SaaS. Fictional names, companies,
testimonials, prices, and metrics are intentional; they must be visibly labeled as
demonstration content and must not reuse real third-party brands or logos. Real technology
names (Groq, Next.js, etc.) are factual stack references.

## Commands

Use npm (`package-lock.json`). Next 16 requires Node `>=20.9`; `package.json` declares that
engine.

```bash
npm run dev
npm run lint
npm run type-check
npm run test          # Vitest unit/integration
npm run test:watch
npm run build
npm run test:e2e      # Playwright; auto-starts `npm run dev` on :3000
```

- Single unit file/test: `npx vitest run tests/components/dropzone.test.tsx` / add `-t "name"`.
- Single E2E test: `npx playwright test tests/e2e/playground.spec.ts -g "invalid file"`.
- No CI config exists. Verify locally in this order: `lint` -> `type-check` -> `test` ->
  `build`; run E2E for playground/navigation/accessibility changes.
- `npm run test -- --coverage` does not work: `@vitest/coverage-v8` is not installed.
- Playwright rewrites `playwright-report/index.html` and `test-results/.last-run.json`, both
  tracked in git. Restore them if you did not intend to change them, and check `git status`
  before committing.
- `test:e2e` reuses an already-running dev server on port 3000 locally, so stale servers can
  produce misleading results.
- Never commit without explicit user authorization. This repo has no auto-commit step.

## Architecture

- `/` (`app/page.tsx`) is a Server Component. Interactive pieces (header, pricing CTAs,
  animations) are client islands under `components/landing/`.
- `/playground` (`app/playground/page.tsx`) wraps `playground-client.tsx`; the state machine
  (`empty | loading | error | success`) lives in `components/playground/playground-section.tsx`.
- `POST /api/analyze-resume` validates with Zod, applies an in-memory IP rate limit
  (10 req/min), sanitizes the job title, then calls Groq `generateObject` with fallback
  models: `GROQ_MODEL_ID` -> `qwen/qwen3.6-27b` -> `gemma2-9b-it` ->
  `openai/gpt-oss-120b`. Each attempt has a 30 s abort timeout.
- Analysis is **not streamed**. The client uses plain `fetch` + `AbortController` (45 s) and
  `ResumeAnalysisResponseSchema.safeParse`, not `useObject`/`experimental_useObject`. The
  response schema is an extension of `ResumeAnalysisSchema` that preserves `isEasterEgg` and
  `source`.
- PDF text is extracted in the browser with `pdfjs-dist` (PDF only, max 5MB); only JSON
  `{ resumeText, jobTitle }` is sent. The worker is served locally from
  `public/pdf.worker.min.mjs`; keep it in sync with the installed `pdfjs-dist` version when
  upgrading the dependency.
- Server limits: `resumeText` <= 50,000 chars, `jobTitle` <= 120 chars. Comparison history
  is client-only (`localStorage` key `talent_metrics_candidate_history`, max 5 items) and is
  validated item-by-item with Zod on load.
- Landing content is data-driven from `data/*.json`. Demo content is allowed, but it must be
  clearly labeled as fictional and must not invent real clients, real logos, real
  testimonials, or real metrics.

## Environment

- `.env.local` only (all `.env*` are gitignored). `GROQ_API_KEY` is required; without it the
  API returns 500.
- `GROQ_MODEL_ID` optionally overrides the primary model.
- Creator mode (forced score 100) requires **both** `NODE_ENV=development` and
  `ENABLE_CREATOR_MODE=true`, plus the creator's name in the resume text. It is off in
  production by default.
- The API returns `isEasterEgg`; the playground now preserves it through
  `ResumeAnalysisResponseSchema`, so `ScoreCard` can render the "Modo Criador" badge in dev.
- Rate limiting is in-memory and therefore **per server instance**, not global. In
  serverless/multi-instance deploys the effective limit is higher. `getClientIp` trusts
  `x-forwarded-for`/`x-real-ip`; only deploy behind a proxy that sets those headers.

## Gotchas and Conventions

- Tailwind v4: tokens live in `app/globals.css` under `@theme`. There is no
  `tailwind.config.*`. Use semantic classes (`bg-canvas`, `bg-surface`,
  `border-border-subtle`, `text-text-muted`, `text-accent`), not raw palette classes.
- Sticky layout depends on **not** creating a scroll container above the header. The landing
  root and `body` use `overflow-x: clip` (not `overflow-hidden`/`overflow-x: hidden`), and
  the demo banner is in normal flow. Don't reintroduce an ancestor with `overflow: hidden`
  around the header.
- Dialogs use `lib/use-dialog-focus.ts`: focus trap, Escape, focus restore, and a ref-counted
  body scroll lock. Use it for any new modal/drawer. Only one dialog should be open at a
  time; the Header owns the login modal so the mobile drawer can close first.
- `components/ui/animated-section.tsx` renders a plain `<div>` until mounted, then swaps to
  `motion.div` to avoid a hydration mismatch from `useReducedMotion()`. It also has a
  visibility fallback when `IntersectionObserver` is unavailable. Don't "simplify" it away;
  all motion must respect `prefers-reduced-motion` and content must remain visible without
  animation. `components/ui/motion-provider.tsx` wraps the app in
  `<MotionConfig reducedMotion="user">` so portaled dialogs also disable transforms.
- `Button` must not be nested inside `<a>`/`Link`. Use `buttonVariants()` for link-styled
  actions.
- Design house rules are detailed in `SPEC.md` §6/§9: Inter only, solid accent `#10b981`, no
  gradient text/buttons, no eyebrow badges above headings, no backdrop blur, headlines max 2
  lines, no decorative hairlines, no resting shadows on buttons/cards. Dialogs keep elevation
  shadows for depth. Match existing section patterns rather than introducing new visual styles.
- Fictional data in `data/*.json` must stay fictional and labeled. Do not add real brands
  (e.g. Greenhouse, Gupy) or real client logos.
- `@/*` maps to the repository root in both `tsconfig.json` and `vitest.config.mts`.
- Vitest uses jsdom, loads `tests/setup.ts`, and excludes `tests/e2e`. Existing tests mock
  `ai`, `@ai-sdk/groq`, and `pdfjs-dist`; API tests use `vi.stubEnv`. `tests/setup.ts` installs
  an in-memory `localStorage` because Node's experimental global shadows jsdom's storage.
- The rate limiter keeps module-level state across tests and server instances. Keep API test
  calls under 10 per run or reset the module; in serverless deploys the limit is per instance,
  not global.
- `/playground` is intentionally `noindex` (`app/playground/page.tsx`); the landing is
  indexable.
