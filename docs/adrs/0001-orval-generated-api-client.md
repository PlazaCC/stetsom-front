# 0001: Orval-generated API client

Status: Accepted

## Context

The front end consumes stetsom-api, which serves an OpenAPI spec. Types and request logic written by hand drift from the API contract as endpoints change, and every consumer has to duplicate that work.

## Decision

Orval generates TypeScript types and React Query hooks directly from the stetsom-api OpenAPI spec. Generated output lives in `src/api/stetsom/`:

- Types: `src/api/stetsom/model/`, barrel `index.ts`.
- Hooks: `src/api/stetsom/endpoints/<tag>/<tag>.ts`.

Regenerate with `pnpm api:generate` after any API contract change. Never define API request or response shapes by hand, and never call `fetch()` directly for stetsom-api data.

## Consequences

API shape changes require running `pnpm api:generate` and reviewing the diff, not editing generated files. `types/routes.d.ts`, `types/cache-life.d.ts`, and `types/validator.ts` are also generated and follow the same rule.

Full integration rules: `.agents/rules/api-integration.md` and `.agents/rules/product-data-schema.md`.
