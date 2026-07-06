---
description: 'Use when working with local mock data. Mocks are auto-fallback when CMS_API_BASE_URL is unset and must stay contract-compatible.'
applyTo: 'src/lib/mock/**/*'
---

# Mock API Guidelines (fallback mode)

## Two Patterns Coexist

| Pattern | Used for | Type source |
|---|---|---|
| Mock provider (`createMockCmsProvider`) | Public site RSC pages (no auth needed) | Orval models in `src/api/stetsom/model/` |
| Orval React Query hooks + BFF | Admin/CMS client components | Orval models in `src/api/stetsom/model/` |

Both patterns share the same Orval-generated types as their contract.

## Mock Fallback (public site)

- Active when `CMS_API_BASE_URL` is unset (default for local dev without backend)
- Fixtures: `src/lib/mock/*.ts` → consumed by `src/lib/api/providers/mock-provider.ts`
- Mock payloads must conform to Orval-generated types — import from `@/api/stetsom/model`

## Data Quality Rules

- Use realistic values: UUIDs, ISO 8601 dates, canonical slugs, valid URLs
- Multilingual fields must use `I18nString` format: `{ pt: '...', en?: '...', es?: '...' }` (key is `pt`, not `pt-BR`)
- `ProductBlock` combos: include TEXT/IMAGE/VIDEO where applicable with unique sequential `order`
- `ProductFile`: keep `version`, `is_active`, and `type` semantics coherent
- Never introduce mock-only fields in UI code paths — if a field is not in the Orval model, don't use it
- Use mocks as a compatibility safety net, not the primary source of behavior