<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

---

# Stetsom Front — Agent Guide

Stetsom is a Brazilian automotive amplifier brand (35+ years). This repo is an institutional website + admin CMS.

## Commands

```bash
pnpm dev        # start dev server at localhost:3000
pnpm build      # production build
pnpm lint       # run ESLint
```

## Stack

| Layer           | Tech                  | Version   | Critical notes                                                     |
| --------------- | --------------------- | --------- | ------------------------------------------------------------------ |
| Framework       | Next.js               | 16.2.4    | App Router, `src/app/` dir — see AGENTS.md block above             |
| UI              | React                 | 19.2.4    | Server Components by default; `params`/`searchParams` are Promises |
| Language        | TypeScript            | 5         | strict mode, `moduleResolution: bundler`                           |
| Styling         | Tailwind CSS          | v4        | PostCSS-based, **no `tailwind.config.*`** — see Tailwind section   |
| UI Primitives   | @base-ui/react        | 1.4.1     | Used for navigation, composition                                   |
| Components      | shadcn/ui             | base-nova | RSC enabled, CSS variables                                         |
| Icons           | lucide-react          | 1.8.0     |                                                                    |
| Carousel        | swiper                | 12.1.4    | Hero carousel                                                      |
| Data Fetching   | @tanstack/react-query | 5         | Via `QueryProvider` wrapper                                        |
| Animation       | motion                | 12        |                                                                    |
| Package manager | pnpm                  | —         | `pnpm-workspace.yaml` present                                      |

## Path Alias

`@/*` maps to `src/`. Use:

```ts
import { cn } from '@/lib/utils' // → src/lib/utils.ts
import Header from '@/components/ui/header' // → src/components/ui/header.tsx
```

**Do NOT write `@/src/...`** — that resolves to `src/src/...` and will fail.

## Page & Layout Props

`params` and `searchParams` are `Promise` types. Always `await` them:

```tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
}
```

Use the global `PageProps<Route>` and `LayoutProps<Route>` types from `types/routes.d.ts`.

## Generated Files — Do Not Edit

- `types/routes.d.ts`
- `types/cache-life.d.ts`
- `types/validator.ts`

## Tailwind v4 Conventions

No config file — all configuration lives in `src/app/globals.css`:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';

@theme inline {
  /* Brand tokens */
  --color-brand: rgb(232, 19, 42); /* Stetsom red */
  --color-brand-dark: rgb(18, 18, 18); /* Stetsom dark */
  --color-off-white: rgb(245, 244, 242);
  /* Typography */
  --font-sans: var(--font-barlow);
  --font-sans-condensed: var(--font-barlow-condensed);
  --font-mono: var(--font-geist-mono);
}
```

- Use `bg-brand`, `text-brand`, `bg-brand-dark` for Stetsom colors.
- Fonts are `font-sans` (Barlow) and `font-sans-condensed` (Barlow Condensed).
- Avoid arbitrary CSS — always prefer CSS custom properties / `@theme` tokens.

## Route Structure

```
src/app/
├── [locale]/                ← next-intl locale (pt-BR = no URL prefix)
│   ├── layout.tsx           ← Fonts, providers, NextIntlClientProvider
│   └── (site)/              ← Public site (no URL impact from group name)
│       ├── layout.tsx       ← Wraps with <Header> + <Footer>
│       ├── page.tsx         ← Home: imports from ./_components/
│       ├── _components/     ← Co-located home sections (not shared)
│       ├── produtos/
│       ├── sobre/
│       └── suporte/
├── admin/                   ← Admin panel
├── cms/                     ← CMS
├── api/                     ← BFF route handlers
├── layout.tsx               ← Root layout (globals.css + children only)
└── globals.css
```

- Route groups use `(name)` syntax (no URL segment).
- Underscore prefix `_components/` means co-located, not shared.
- Shared components go in `src/components/ui/`.

## Component Conventions

- `"use client"` only when needed (event handlers, hooks, browser APIs).
- All components are named exports except page/layout defaults.
- `cn()` from `@/lib/utils` for conditional class merging.
- shadcn/ui style: `base-nova`, CSS variables, RSC-compatible.

## UI Components (`src/components/ui/`)

| File                  | Type   | Purpose                                          |
| --------------------- | ------ | ------------------------------------------------ |
| `header.tsx`          | Client | Sticky nav, desktop + mobile, uses `usePathname` |
| `footer.tsx`          | Server | 4-column dark footer                             |
| `container.tsx`       | Server | Max-width wrapper                                |
| `navigation-menu.tsx` | Client | Built on `@base-ui/react/navigation-menu`        |
| `section-label.tsx`   | Server | Section heading label                            |
| `product-card.tsx`    | Server | Product card                                     |
| `button.tsx`          | —      | shadcn button                                    |
| `accordion.tsx`       | —      | shadcn accordion                                 |
| `dropdown-menu.tsx`   | —      | shadcn dropdown                                  |

## API Types

All types are **auto-generated by Orval** from the stetsom-api OpenAPI spec. Never define API shapes manually.

- Models: `src/api/stetsom/model/` (barrel: `index.ts`)
- Hooks: `src/api/stetsom/endpoints/<tag>/<tag>.ts`
- Regenerate: `pnpm api:generate`

Full schema rules and context/public field distinctions: `.claude/rules/product-data-schema.md` and `.claude/rules/api-integration.md`.

---

## Codebase Knowledge Graph

A knowledge graph of this codebase lives in `graphify-out/`. Read it to understand structure before exploring unfamiliar areas.

- `graphify-out/GRAPH_REPORT.md` — communities, god nodes, knowledge gaps (start here)
- `graphify-out/graph.html` — interactive visualization

Last run: 2026-05-12 · 58 files · 172 nodes · 32 communities
`cn()` is the highest-betweenness node (41 edges) — used in virtually every component.
Main communities: Utilities · Pages & Routes · UI Components · Technology Stack

Regenerate with `/graphify` (Claude Code) after major structural changes.

---

## AI-Driven Workflow

This project follows a skill-first delivery cycle. See `docs/ia/AI-DRIVEN-WORKFLOW.md` for the full description.

**Cycle:** `/brainstorm` → implement → `/refine-design` → `/create-pr` → `/code-review`

Skill entrypoints are installed in `.agents/skills/` (VSCode) and `.claude/skills/` (Claude Code).

---

## Architecture Decisions

- **Backend:** Fastify API (separate repo) + Prisma ORM + Cloudflare R2 storage.
- **Admin UI:** shadcn/ui (base-nova) with custom CMS primitives in `src/app/admin/_components/`.
- **BFF:** `src/app/api/bff/[...path]` proxies all Orval-generated client calls to the upstream API, injecting the `admin_token` HttpOnly cookie as `Authorization: Bearer`. Auth flows (`/api/auth/*`) have dedicated routes that manage cookies.
- **Mock mode:** set `USE_MOCK_DATA=1` in `.env.local`; GETs are served from `src/lib/mock/data.json`, mutations return `{ _mock: true }`. Refresh data with `pnpm mock:dump`.
