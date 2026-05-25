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
├── (site)/              ← Public site (no URL impact from group name)
│   ├── layout.tsx       ← Wraps with <Header> + <Footer>
│   ├── page.tsx         ← Home: imports from ./_components/
│   ├── _components/     ← Co-located home sections (not shared)
│   ├── produtos/
│   ├── sobre/
│   └── suporte/
├── admin/               ← Future admin panel
├── cms/                 ← Future CMS
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

This site **consumes** data from the Stetsom CMS backend (Fastify API). The following entities are served to the frontend for display:

### Product

```ts
interface Product {
  id: string // uuid
  name: string // Commercial name
  slug: string // URL-friendly slug
  category_id: string
  subcategory_id?: string
  status: 'ACTIVE' | 'DISCONTINUED'
  launch_date: Date
  description: string
  specifications: Record<string, any> // Key-value specs (power, impedance, etc.)
  thumbnail_url: string // Hero image
  video_url?: string // YouTube/Vimeo
  created_at: Date
  updated_at: Date
  created_by: string // User ID
}
```

### Category & Subcategory

```ts
interface Category {
  id: string
  name: string
  slug: string
  order: number // Display order
  created_at: Date
  updated_at: Date
}

interface Subcategory {
  id: string
  category_id: string
  name: string
  slug: string
  order: number
  created_at: Date
  updated_at: Date
}
```

### ProductBlock (Page Builder)

Modular content blocks for product pages. Types: `IMAGE`, `VIDEO`, `HTML`, `MODEL3D`, `TEXT`.

```ts
interface ProductBlock {
  id: string
  product_id: string
  type: 'IMAGE' | 'VIDEO' | 'HTML' | 'MODEL3D' | 'TEXT'
  order: number // Display order
  data: {
    // Varies by type:
    // IMAGE: { images: string[], caption: string, layout: string }
    // VIDEO: { video_url: string, title: string, description: string }
    // HTML: { html: string, css_class: string }
    // MODEL3D: { file_url: string, background: string, scale: number }
    // TEXT: { title: string, content: string, align: string }
  }
  created_by: string
  created_at: Date
  updated_at: Date
}
```

### ProductFile

Downloadable assets (manuals, catalogs, certificates, etc).

```ts
interface ProductFile {
  id: string
  product_id: string
  file_url: string
  type: 'MANUAL' | 'CATALOG' | 'CERTIFICATE' | 'IMAGE' | 'OTHER'
  version: number // Auto-incremented per type
  is_active: boolean
  created_at: Date
  updated_at: Date
}
```

### Data Relationships

```
Category (1) → (N) Subcategory
Category (1) → (N) Product
Subcategory (1) → (N) Product
Product (1) → (N) ProductBlock
Product (1) → (N) ProductFile
```

### Key Constraints & Validation

- Product names are unique per category.
- ProductBlock order must be sequential & unique per product.
- Each product must have **at least one active block** (image, text, or video).
- ProductFile version increments auto-magically per file type per product.
- Soft deletes only: `deleted_at` column tracks removals (history preservation).

### Consuming Data

When fetching products from the API, expect this response shape:

```ts
// GET /api/products/:slug
{
  product: Product
  blocks: ProductBlock[]
  files: ProductFile[]
  category: Category
  subcategory?: Subcategory
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
