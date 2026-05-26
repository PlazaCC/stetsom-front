---
description: 'Use when working with local mock data. Mocks are auto-fallback when CMS_API_BASE_URL is unset and must stay contract-compatible.'
applyTo: 'src/lib/mock/**/*'
---

# Mock API Guidelines (fallback mode)

- The app uses `createMockCmsProvider()` by default when `CMS_API_BASE_URL` is not set.
- Mocks are used automatically in local dev without a backend running.
- Mock payloads MUST stay aligned with `src/lib/api/contracts.ts` and mirror backend responses.

**Mock data quality**

- Use realistic values: UUIDs, ISO 8601 dates, canonical slugs, and valid URLs.
- Keep representative `ProductBlock` combinations (TEXT/IMAGE/VIDEO where applicable) with unique sequential `order`.
- Keep file semantics coherent (`version`, `is_active`, `type`, optional metadata).

**Implementation notes**

- Keep fixtures typed in `src/lib/mock/*` and consumed by `src/lib/api/providers/mock-provider.ts`.
- Update `contracts.ts` first when schema changes, then update mocks and consumers.
- Never introduce mock-only fields in UI code paths; if a field does not exist in contracts, do not use it.
- Use mocks as a compatibility safety net, not as the primary source of behavior.
