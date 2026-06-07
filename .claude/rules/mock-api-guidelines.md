---
description: 'Use when working with local mock data. Mocks are auto-fallback when CMS_API_BASE_URL is unset and must stay contract-compatible.'
applyTo: 'src/lib/mock/**/*'
---

# Mock API Guidelines (fallback mode)

## Single Pattern — Unified BFF + Server Mock

All mock data (public site RSC pages, admin/CMS client components) is served from a single source:

- Toggle: `USE_MOCK_DATA=1` in `.env.local`
- Data: `src/lib/mock/data.json` — keyed by URL path segments joined with `--` (e.g. `pages--home--cms`)
- Loader: `src/lib/mock/loader.ts` — `loadMockData(segments: string[])`, cached at module level
- Intercept points:
  - **BFF** (`/api/bff/[...path]`): GETs served from `data.json`; mutations return `{ _mock: true, 200 }`
  - **Server Orval** (`orval-server.ts`): GETs served from `data.json`; mutations return `{}`
  - **Auth routes** (`/api/auth/login|refresh`): return mock cookies; proxy skips JWT verification
- Refresh data: `pnpm mock:dump` (requires real API + credentials in `.env.local`)

All types source from Orval models in `src/api/stetsom/model/`.

## Data Quality Rules

- Use realistic values: UUIDs, ISO 8601 dates, canonical slugs, valid URLs
- Multilingual fields must use `I18nString` format: `{ pt: '...', en?: '...', es?: '...' }` (key is `pt`, not `pt-BR`)
- `ProductBlock` combos: include TEXT/IMAGE/VIDEO where applicable with unique sequential `order`
- `ProductFile`: keep `version`, `is_active`, and `type` semantics coherent
- Never introduce mock-only fields in UI code paths — if a field is not in the Orval model, don't use it
- Use mocks as a compatibility safety net, not the primary source of behavior
