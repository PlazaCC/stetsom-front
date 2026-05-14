# Naming Conventions

All code-level identifiers MUST be in English. Portuguese is only acceptable in user-facing string content (labels, descriptions, placeholder text, button text).

## Rules by identifier type

| Identifier | Convention | Language | Example |
|---|---|---|---|
| Component export | PascalCase | English | `OurHistory`, `FeaturedProducts` |
| Component file | kebab-case `.tsx` | English | `our-history.tsx`, `catalog-sidebar.tsx` |
| Hook export | `useCamelCase` | English | `useCatalogProducts`, `useHorizontalScroll` |
| Hook file | `use-kebab-case.ts` | English | `use-catalog.ts` |
| TypeScript type / interface | PascalCase | English | `ProductCardItem`, `CatalogFilterState` |
| Props interface | `ComponentNameProps` suffix | English | `OurHistoryProps` |
| Exported function | camelCase | English | `buildSearchParams`, `formatSpecKey` |
| Constant (module-level) | SCREAMING_SNAKE_CASE | English | `COMPANY_STATS`, `DEFAULT_CATALOG_HERO` |
| Local variable / state | camelCase | English | `activeCategory`, `sidebarOpen` |
| Internal discriminator / union literal | snake_case or camelCase | English | `'overview'`, `'specifications'` (not `'visao_geral'`) |

## Exemptions — do NOT translate

- **URL route segments** — `/sobre`, `/produtos`, `/suporte` are part of the brand URL and change the public URL if renamed
- **User-facing strings** — UI labels, titles, descriptions, placeholder text, error messages can be in Portuguese
- **API contract field names** — field names that must match the backend schema verbatim (`slug`, `name`, `thumbnail_url`)
- **CSS class values** — Tailwind utilities and design tokens
- **Next.js reserved files** — `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx` stay lowercase

## File naming rule

Component files always use **kebab-case**, regardless of the component name inside:

```
✅ product-card.tsx        exports ProductCard
✅ catalog-sidebar.tsx     exports CatalogSidebar
✅ company-timeline.tsx    exports CompanyTimeline
✅ timeline-progress-bar.tsx exports TimelineProgressBar

❌ CatalogSidebar.tsx      (PascalCase filename — wrong)
❌ nossa-historia.tsx      (Portuguese filename — wrong)
❌ NovidadesTabStrip.tsx   (PascalCase + Portuguese — wrong)
```

## Quick reference

```tsx
// ❌ Wrong
export default function NossaHistoria({ section }: NossaHistoriaProps) { ... }
export default function QualidadeInovadora() { ... }
const HOME_NOVIDADES_TABS = [...]
type Tab = 'visao_geral' | 'especificacoes' | 'confira'

// ✅ Correct
export default function OurHistory({ section }: OurHistoryProps) { ... }
export default function QualitySection() { ... }
const HOME_FEATURED_TABS = [...]
type Tab = 'overview' | 'specifications' | 'related'
```

## Known violations (pending migration)

See `docs/ia/tasks/task-14-naming-conventions-refactor.md` for the full checklist of files that need renaming.
