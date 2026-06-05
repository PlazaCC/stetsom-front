---
description: 'Use when creating or renaming any file, component, hook, type, or variable. Covers English-only identifiers, kebab-case filenames, PascalCase components.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Naming Conventions

All code-level identifiers MUST be in English. Portuguese only in user-facing string content.

## Rules by Identifier Type

| Identifier | Convention | Example |
|---|---|---|
| Component export | PascalCase | `OurHistory`, `FeaturedProducts` |
| Component file | kebab-case `.tsx` | `our-history.tsx`, `catalog-sidebar.tsx` |
| Hook export | `useCamelCase` | `useCatalogProducts` |
| Hook file | `use-kebab-case.ts` | `use-catalog.ts` |
| TypeScript type / interface | PascalCase | `ProductCardItem`, `CatalogFilterState` |
| Props interface | `ComponentNameProps` suffix | `OurHistoryProps` |
| Exported function | camelCase | `buildSearchParams`, `formatSpecKey` |
| Module-level constant | SCREAMING_SNAKE_CASE | `COMPANY_STATS`, `DEFAULT_CATALOG_HERO` |
| Local variable / state | camelCase | `activeCategory`, `sidebarOpen` |
| Union literal | snake_case or camelCase | `'overview'`, `'specifications'` (not `'visao_geral'`) |

## Exemptions — Do NOT Translate

- **URL route segments** — `/sobre`, `/produtos`, `/suporte` are brand URLs; renaming changes the public URL
- **User-facing strings** — UI labels, titles, placeholders, error messages may be Portuguese
- **API field names** — must match backend verbatim (`slug`, `name`, `thumbnail_url`)
- **CSS class values** — Tailwind utilities and design tokens
- **Next.js reserved files** — `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`

## File Naming

Component files always use **kebab-case**, regardless of the exported name:
```
✅ product-card.tsx        → exports ProductCard
✅ timeline-progress-bar.tsx → exports TimelineProgressBar
❌ CatalogSidebar.tsx      (PascalCase filename)
❌ nossa-historia.tsx      (Portuguese filename)
```
