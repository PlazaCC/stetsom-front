---
description: 'Use when writing TypeScript, importing modules, or setting up any .ts/.tsx file. Covers strict mode, path alias, type vs interface, and import rules.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Code Conventions

## TypeScript

- Strict mode + `moduleResolution: bundler` — trust type inference; don't fight the compiler
- `type` for unions and data shapes; `interface` for extensible contracts (component props)
- Never `any` → use `unknown` for genuinely unknown types
- Props types in the same file, above the component
- `React.ComponentPropsWithoutRef<"element">` to extend native HTML element props
- No unnecessary barrel `index.ts` files — import directly from the source file

## Path Alias

- `@/*` maps to `src/` — never write `@/src/...` (resolves to `src/src/...` and fails)
- Correct: `@/lib/utils`, `@/components/ui/button`, `@/api/stetsom/model`
- Relative imports (`../`) only within the same feature or route

## Naming

All code-level identifiers MUST be in English. Portuguese only in user-facing string content.

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

**Do NOT translate:** URL route segments (`/sobre`, `/produtos`), user-facing strings (may be Portuguese), API field names (match backend verbatim), CSS class values, Next.js reserved files (`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
