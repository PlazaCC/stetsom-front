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

## CMS Data Schema — Product Data Structures

This site **consumes** data from the Stetsom CMS backend (Fastify API).
Canonical TS types: `src/lib/api/contracts.ts` · Full rules: `.claude/rules/product-data-schema.md`

### Product (variation-based — not flat key-value)

```ts
type Product = {
  id: string                       // uuid
  name: string                     // Commercial name
  slug: string                     // URL-friendly slug
  category_id: string
  subcategory_id?: string
  status: 'ACTIVE' | 'DISCONTINUED' | 'DRAFT'
  launch_date: ISODateString
  description: string
  variations: ProductVariation[]   // ← size/power variants with ordered specs
  highlight_attributes: string[]   // spec attribute names to show in card/header
  thumbnail_url: string
  video_url?: string
  badge?: string | null
  markets?: Locale[]               // locales where product is visible; undefined = all
  created_at: ISODateString
  updated_at: ISODateString
  created_by: string
}

type ProductVariation = {
  id: string
  label: string   // e.g. "220V"
  order: number
  specs: ProductSpec[]
}

type ProductSpec = {
  id: string
  attribute: string  // e.g. "Potência RMS"
  value: string      // e.g. "3000W"
  order: number
}
```

### Category & Subcategory

```ts
type Category = { id: string; name: string; slug: string; order: number; created_at: ISODateString; updated_at: ISODateString }
type Subcategory = { id: string; category_id: string; name: string; slug: string; order: number; created_at: ISODateString; updated_at: ISODateString }
```

### ProductBlock (discriminated union by `type`)

```ts
// Shared base
type ProductBlockBase = { id: string; product_id: string; order: number; created_by: string; created_at: ISODateString; updated_at: ISODateString }

type ProductBlock =
  | (ProductBlockBase & { type: 'IMAGE';   data: { images: string[]; caption?: string; layout?: string } })
  | (ProductBlockBase & { type: 'TEXT';    data: { title?: string; content: string; align?: string } })
  | (ProductBlockBase & { type: 'VIDEO';   data: { video_url: string; title?: string; description?: string } })
  | (ProductBlockBase & { type: 'HTML';    data: { html: string; css_class?: string } })
  | (ProductBlockBase & { type: 'MODEL3D'; data: { file_url: string; background?: string; scale?: number } })
```

### ProductFile

```ts
type ProductFile = {
  id: string
  product_id: string | null  // null when file is in library but not yet attached
  file_url: string
  type: 'MANUAL' | 'CATALOG' | 'CERTIFICATE' | 'IMAGE' | 'OTHER'
  version: number            // auto-increments per product+type combination
  is_active: boolean
  name?: string
  fileSize?: string          // human-readable, e.g. "2.5 MB"
  created_at: ISODateString
  updated_at: ISODateString
}
```

### Detail Response Shape

```ts
// GET /api/products/:slug
type ProductDetailPayload = {
  product: Product
  blocks: ProductBlock[]   // sorted by order ASC
  files: ProductFile[]
  category: Category
  subcategory?: Subcategory
  relatedProducts?: ProductCardItem[]
}
```

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

**Standard cycle:** `/brainstorm` → `/create-task` → `/next-task` → `/create-pr` → `/code-review`
**Shortcut:** `/deliver` chains steps 3–5 automatically (up to 3 fix loops).
**Task backlog:** `docs/ia/tasks/TASKS.md` · Format: `docs/ia/tasks/task-<id>-<slug>.md`

Skill entrypoints are installed in `.agents/skills/` (VSCode) and `.claude/skills/` (Claude Code).

---

## Architecture Decisions (RFC-001)

- **Backend:** Fastify API (separate repo) + Prisma ORM + Cloudflare R2 storage.
- **Admin UI:** Mantine UI is planned for the CMS panel (not shadcn).
- Thin BFF layer in `src/app/api/*` for auth cookies, token forwarding, and upload orchestration. Data access follows `CmsProvider` (remote when `CMS_API_BASE_URL` is set, mock by default). `CMS_FORCE_BFF=1` forces remote even without `CMS_API_BASE_URL`.
- See `docs/rfcs/stetsom-rfc-1.md` for full rationale.
