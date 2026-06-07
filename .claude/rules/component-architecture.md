---
description: 'Use when creating, moving, or refactoring React components. Covers Server vs Client decision, folder structure, dummy/presentational pattern, composable vs monolithic, subcomponent extraction.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Component Architecture

## Component Basics

- **Server Component by default** — add `"use client"` only for: event handlers, state/effect hooks, browser APIs, `usePathname`
- Named exports for all components except `page.tsx` and `layout.tsx` (default export)
- Use `cn()` from `@/lib/utils` for conditional Tailwind class merging
- Static data constants at the top of the file in `SCREAMING_SNAKE_CASE`
- Avoid excessive prop drilling — prefer component composition

## Folder Structure — Three Destinations

| Folder | Purpose | Rules |
|---|---|---|
| `src/components/ui/` | Global reusable primitives | Dummy/presentational only; no data hooks; usable in 2+ routes |
| `src/components/` | Infrastructure | Providers, context wrappers only — no visual UI |
| `src/app/[route]/_components/` | Route-co-located sections | May contain data hooks; not imported by other routes |

If a `_components/` file is needed in 2+ routes → move to `components/ui/`.

## Dummy Components (Presentational)

Components in `components/ui/` receive data via props and render UI only:
- No `useQuery`, `useCatalogProducts`, or other data hooks
- No business side-effects
- `useRouter` / `usePathname` only in explicit navigation components (Header, LanguageSwitcher)

```tsx
// ❌ Data logic in a primitive
export function FeaturedProducts() {
  const { data } = useCatalogProducts() // data must come from props
}
// ✅ Container in the route fetches, primitive renders
export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return <div>...</div>
}
```

## Subcomponent Extraction

| Situation | Action |
|---|---|
| File > 150 lines | Evaluate subcomponent extraction |
| Subcomponent has its own state/effect | Extract to separate file — mandatory |
| Visual-only, not reusable | Can stay in file as internal function (below main export) |
| Reusable in 2+ places | Extract to `components/ui/` — mandatory |

## Composable vs Monolithic

| Pattern | Where | Example |
|---|---|---|
| Composable | `components/ui/` | `navigation-menu.tsx` (Root, List, Item, Trigger, Content — each usable independently) |
| Atomic | `components/ui/` | `button.tsx`, `product-card.tsx`, `container.tsx` |
| Monolithic container | `_components/` | `catalog-content.tsx`, `hero-carousel.tsx` |

Never put feature-specific business logic inside a `components/ui/` primitive.
