# CMS Design System (Stetsom Admin)

Isolated, Mantine-inspired design system for the CMS (`src/app/admin/`). Faithful to
Figma `huD41oTL0FAa7xsNEK8tAM`. **Public-site styling does not apply here** — the admin
has its own font (Geist), accent (blue), and surfaces.

> Live reference: run `pnpm dev` and open **`/admin/styleguide`** — every token and
> primitive is rendered there in all states. Keep it updated when you add primitives.

## How the theme works

The admin root (`src/app/admin/layout.tsx`) wraps everything in `<div className="cms">`.
`src/app/admin/admin.css` (`.cms {}`) **remaps the shadcn tokens** (`--primary`, `--ring`,
`--muted-foreground`, `--card`, `--border`, sidebar tokens) onto the raw `--cms-*` values
declared in `src/app/globals.css :root`, and sets `font-family: Geist`.

**Consequence:** primitives should use the **semantic shadcn classes** (`bg-primary`,
`text-primary`, `ring-ring`, `text-muted-foreground`, `bg-card`, `border-border`). They
automatically resolve to the CMS look inside `.cms` — no `cms-`-prefixed class needed for
the common cases, and zero hardcoded hex.

## Color tokens (Figma → token → class)

| Role | Figma | Raw token (`:root`) | Use in components |
|---|---|---|---|
| App background | `#F2F3F7` | `--cms-bg` | `bg-background` |
| Card / panel | `#FAFAFA` | `--cms-panel` | `bg-card` |
| **Accent / action** | `#4375E2` | `--cms-primary` | `bg-primary`, `text-primary`, `ring-ring` |
| Accent hover | `#3A67CC` | `--cms-primary-hover` | `hover:bg-cms-primary-hover` |
| Accent subtle (active nav) | `#EDF2FD` | `--cms-primary-subtle` | `bg-cms-primary-subtle`, `text-cms-primary` |
| Border / divider | `#D9D9D9` | `--cms-border` | `border-border` |
| Primary text | `#1A1A1A` | `--cms-text` | `text-foreground` |
| Muted text | `#838383` | `--cms-text-muted` | `text-muted-foreground` |
| Card shadow | `0 0 3.7 rgba(0,0,0,.12)` | `--cms-card-shadow` | `shadow-cms-card` |
| Sidebar shadow | `0 0 8.8 rgba(0,0,0,.2)` | `--cms-sidebar-shadow` | `shadow-cms-sidebar` |

Red (`text-brand`/`bg-brand`) is reserved for **branding** (sidebar logo) and **destructive**
intent — never for ordinary accent/active state.

## Typography

Font: **Geist Sans** (`--font-geist`, loaded in `src/app/layout.tsx`, applied via `.cms`).
Geist Mono (`font-mono`) is allowed **only** for codes/slugs/IDs. Never use the public-site
`font-sans-condensed` / `font-black uppercase` idiom in the CMS.

| Use | Class |
|---|---|
| Page title | `text-2xl font-bold` |
| Section title | `text-sm font-semibold uppercase text-muted-foreground` |
| Body | `text-sm` · medium `font-medium` |
| Secondary | `text-sm text-muted-foreground` |
| Code / slug | `font-mono text-xs` |

## Primitives (`src/app/admin/_components/crud/` + `_components/`)

Rule: primitives are **dumb/presentational**, props-in, **token-only classes**, no business
data hooks. Reuse before creating.

| Primitive | File | Notes |
|---|---|---|
| `CmsButton` / `cmsButtonVariants` | `crud/cms-button.tsx` | Mantine variants: `filled·light·outline·subtle·default·danger`; sizes `xs·sm·md·lg·icon`. **Use this, not the public `Button`.** |
| `AdminPanel` | `_components/admin-panel.tsx` | Card surface (`bg-card` + `shadow-cms-card`) |
| `AdminPageHeader` | `_components/admin-page-header.tsx` | Title + icon + action slot |
| `AdminInput/Textarea/Select/Label` | `crud/admin-input.tsx` | Form fields |
| `AdminDataTable` | `crud/admin-data-table.tsx` | Columns + pagination |
| `AdminTabs` | `crud/admin-tabs.tsx` | Route-based content tabs |
| `StatusBadge` | `crud/status-badge.tsx` | Status enum → label + tone |
| `AdminDrawer`, `AdminConfirmDialog`, `AdminSaveBar`, `AdminEmptyState`, `AdminPagination`, `AdminStepIndicator`, `i18n-input`, `library-asset-picker`, `block-builder`, `sortable-list`, `filter-chips`, … | `crud/*` | Existing — keep token-only |

## Sidebar navigation (`_components/admin-sidebar.tsx`)

Data-driven model: `MAIN_NAV` / `BOTTOM_NAV` are `NavNode[]`; an item with `children`
renders as a **collapsible accordion group** (Mantine NavLink), auto-opened when a child
route is active. Active leaf = `bg-cms-primary-subtle text-cms-primary`. Add a section by
appending to the array — no component changes. Content sub-tabs (`produtos-tabs.tsx`)
complement the sidebar accordion.

## Do / Don't

- ✅ `bg-primary` / `text-primary` / `ring-ring` for accent · ❌ `text-brand` / hardcoded `#4375E2`
- ✅ Geist via `.cms` (just omit font class) · ❌ `font-mono` / `font-sans-condensed` for headings
- ✅ `CmsButton` inside admin · ❌ public `@/components/ui/button` (red, uppercase, Barlow)
- ✅ reuse a `crud/*` primitive · ❌ re-hardcode table/input/badge markup per page

## Figma node IDs (file `huD41oTL0FAa7xsNEK8tAM`)

| Screen | node-id |
|---|---|
| Home / Dashboard | `1200-9650` |
| Autenticação | `1200-9626` |
| Produtos | `1200-10269` |
| Central de Mensagens | `1200-9818` |
| Biblioteca | `1200-8633` |
| Banners | `1200-7896` |
| Histórico | `1200-11636` |

Inspect via Figma MCP `get_figma_data` with these IDs (don't fetch the whole file).
