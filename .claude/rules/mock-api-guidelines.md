---
description: 'Use when backend is not available. Ensure mock APIs strictly follow Product Data Schema and live in `src/lib/mock/` and mock provider.'
applyTo: 'src/lib/mock/**/*'
---

# Mock API Guidelines (temporary backend)

- Until a real backend is integrated, implement all API endpoints through the mock provider (`src/lib/api/providers/mock-provider.ts`) using fixtures in `src/lib/mock/`.
- All mock payloads MUST strictly follow the Product Data Schema defined in `src/lib/api/contracts.ts`. The schema is the contract with the backend and the single source of truth for the frontend API shape.
- Endpoints should mirror planned backend responses. Example: `GET /api/products/:slug` → `{ product, blocks, files, category, subcategory? }`.

**Mock data quality**

- Use realistic data: UUIDs, ISO 8601 dates, canonical slugs, and site-root-relative or absolute URLs for assets.
- Product detail mocks must include representative `ProductBlock` types (TEXT, IMAGE, and where applicable VIDEO). Ensure `blocks.order` is sequential and unique per product.
- Maintain `files.version` values and `is_active` flags in mocks as the backend would.

**Implementation notes**

- Keep fixtures typed and co-located in `src/lib/mock/*` and export them for use in `src/lib/api/providers/mock-provider.ts` and API routes.
- Add lightweight runtime sanity checks in the mock provider to assert required keys (ids, dates, slug, blocks array) to catch regressions early.
- Do not hardcode schema differences in the frontend; change the contract file `src/lib/api/contracts.ts` first, then update mocks.
- When the real backend is available, switch provider in `src/lib/api/provider-contract.ts` instead of changing endpoint contracts.
