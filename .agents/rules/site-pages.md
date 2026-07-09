---
description: 'Use when creating or editing public site pages (home, produtos, sobre, suporte). Covers Server Component data fetching, page block composition, locale threading, and error fallback patterns.'
applyTo: 'src/app/\[locale\]/\(site\)/**/*.{ts,tsx}'
---

# Public Site Pages — Data Fetching & Composition

## Server Component Data Fetching

Every public page is a Server Component. Fetch all data at the top of the page using auto-generated `getApi*` server functions from `@/api/stetsom/server/<tag>/`:

```ts
const locale = await getLocale()
const apiLocale = toApiLocale(locale)
const [dataA, dataB] = await Promise.all([
  getApiEndpoint({ locale: apiLocale }).catch(err => {
    console.error("Failed to fetch A:", err)
    return fallbackValue
  }),
  // ...
])
```

- Always convert the next-intl locale via `toApiLocale()` from `@/lib/api/i18n-utils`
- Wrap every fetch in `.catch()` with a type-safe fallback and `console.error`
- Parallelize independent fetches with `Promise.all()`

## Page Block Composition

1. **Fetch** — all data in parallel
2. **Extract** — typed block data using local type aliases, decoupled from `PageBlock`
3. **Render** — each section conditionally behind `!data.hidden && <Section>`

```tsx
const pageData = getPageBlock<HeroSection>(pageRes.blocks, "hero")
// ...
return <>
  {!hero.hidden && <HeroCarousel slides={hero.slides} />}
  {!featured.hidden && <FeaturedProducts ... />}
</>
```

- Section components receive only the data they need as typed props
- Never embed data fetching inside section components — they are presentational
- Use local `type` aliases for section data shapes (not `interface`)

## Error Handling

- `.catch()` with fallback for recoverable fetch failures — the page renders with empty sections
- `notFound()` only when the page is meaningless without the data (e.g., invalid product slug)
- Reserve `loading.tsx` and `error.tsx` for route-level loading and error boundaries

## i18n in Public Pages

- Import translation functions from `next-intl`: `getTranslations` (server), `useTranslations` (client)
- Use `t.rich()` for messages with HTML link placeholders
- Add new messages to all three locale files (`pt-BR`, `en`, `es`) simultaneously