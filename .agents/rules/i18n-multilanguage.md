---
description: 'Use when adding UI text, translations, locale routing, language switching, or any user-facing string. Covers next-intl v4 usage, I18nString API fields, locale threading.'
applyTo: 'src/**/*.{ts,tsx}'
---

# i18n & Multi-language Guidelines

## next-intl v4 — App Router, RSC-first

- Locales: `pt-BR` (default, no URL prefix), `en` → `/en/*`, `es` → `/es/*`
- Config: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
- Messages: `src/i18n/messages/{pt-BR,en,es}.json`

| Context | Get translations | Get current locale |
|---|---|---|
| Server Component | `import { getTranslations } from 'next-intl/server'` → `await getTranslations('NS')` | `await getLocale()` |
| Client Component | `import { useTranslations } from 'next-intl'` → `useTranslations('NS')` | `useLocale()` |

- Navigation: always import `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` — never from `next/link` / `next/navigation`
- All visible UI text in `src/i18n/messages/*.json` — add to all 3 files simultaneously
- Dynamic API content (product names, descriptions) is localized at the data layer, not in message files

## I18nString — API Multilingual Fields

API fields with multilingual content use `I18nString`: `{ pt: string, en?: string, es?: string }`.

**Critical:** backend locale key is `pt`, not `pt-BR`. When reading I18nString from API data:

```ts
// ❌ Wrong — pt-BR is the next-intl locale, not the I18nString key
const name = product.name['pt-BR']

// ✅ Correct — map next-intl locale to I18nString key before access
const key = locale === 'pt-BR' ? 'pt' : locale   // 'pt-BR' → 'pt'
const name = product.name[key] ?? product.name.pt  // always fall back to pt
```

Mock data with I18nString fields must use `{ pt: '...', en?: '...', es?: '...' }` (never `pt-BR` as key).

## Locale Threading (public site / provider pattern)

```
[locale] page param → server.ts (tryGetLocale)
  → provider-contract.ts (locale?: string)
    → mock-provider / remote-provider
      → *-i18n.ts helpers
```

- API routes have no next-intl context — read locale from `?locale=xx` query param
- Orval React Query hooks: include locale in `queryKey` so data re-fetches on locale switch

## Mock Localization Structure

```
src/lib/mock/
  *.ts          → base data in pt (source of truth)
  *-i18n.ts     → get*ForLocale(locale?) with en/es variants
```

- `mock-provider.ts` always calls `-i18n` functions, never raw arrays for user-visible data
- Product badges: translate (`LANÇAMENTO` → `NEW`/`LANZAMIENTO`)
- Product names (brand names like "ST-4000EQ") are not translated
- Slugs and IDs are never translated
- Public endpoint values use flat strings (backend resolves locale); CMS endpoints use `I18nString`

## Message Namespaces

| Namespace | Source | Scope |
|---|---|---|
| `Nav` | header.tsx | Nav links + category menu |
| `Header` | header.tsx | Search placeholder |
| `Footer` | footer.tsx | Columns, copyright, legal |
| `Catalog` | catalog-content/sidebar | Full catalog UI |
| `ProductDetail` | product-detail-content, block-renderer | Product page |
| `Support.*` | suporte/_components/* | Contact, FAQ, docs, service centers |
| `About` | sobre/page.tsx, our-foundations | About page |
| `NotFound` | not-found.tsx | 404 page |
| `LanguageSwitcher` | language-switcher.tsx | Locale selector labels |
| `Meta` | layouts | SEO titles + descriptions |

## Checklist — New Translatable Content

- [ ] Added to all 3 message files (pt-BR · en · es)
- [ ] Component uses `useTranslations` (client) or `getTranslations` (server)
- [ ] Mock: `-i18n.ts` function updated with I18nString `{ pt, en?, es? }` format
- [ ] API route: accepts `?locale=xx` param
- [ ] React Query queryKey includes locale if data varies by language
