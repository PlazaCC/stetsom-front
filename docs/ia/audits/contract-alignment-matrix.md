# Contract Alignment Matrix — Front-end vs stetsom-api (generated Orval contract)

> Audit date: 2026-06-16 · Branch: `refactor/cms-api-contract`
> Source of truth: generated models in `src/api/stetsom/model/` (Orval, in sync with the
> deployed backend at `CMS_API_BASE_URL`). UX contract: Figma (incomplete vs backend).

The closed backend contract is the source of truth; where the front-end diverges, the
front-end is treated as wrong. This matrix lists **verified** divergences only. A prior
exploratory report overstated gaps — see "Already aligned" below for the corrected record.

## 🔴 High

| # | Divergence | Evidence | Impact |
|---|---|---|---|
| 1 | `GALLERY` product block is not rendered | `produtos/[slug]/_components/block-renderer.tsx` handles TEXT/IMAGE/VIDEO/HTML/MODEL3D, `return null` (L148) for GALLERY | Contract has 6 block types; GALLERY content silently disappears |

## 🟡 Medium

| # | Divergence | Evidence | Impact |
|---|---|---|---|
| 2 | Catalog is client-side (no pagination/sort) + hardcoded category/hero images | `produtos/_components/catalog-content.tsx`: fixed `page:1, pageSize:24`; `CATEGORY_IMAGE_BY_ID`, `DEFAULT_HERO_IMAGE` | Decision: migrate to server-side URL-driven; category images should come from `category.icon_library_id` |
| 3 | Header nav categories hardcoded | `components/ui/header.tsx`: `CATEGORY_NAV_ITEMS` (no `useGetApiCategories`) | New categories / i18n names don't reflect in nav |
| 4 | Library "add new version" not wired | `postApiLibraryIdVersions` unused; UI only displays existing versions | Backend versioning unusable from UI |
| 5 | Error handling does not branch on `err.code` | 0 usages of `toApiError`/`OrvalApiError.code` in `src/app` | No specific UX for 409 CONFLICT, 422 VALIDATION_ERROR, 503→fallback (contract rule) |

## 🟢 Low

| # | Divergence | Evidence | Impact |
|---|---|---|---|
| 6 | Admin lists omit pagination params | `mensagens`/`banners`/`usuarios` call hooks without `limit/offset` | Rely on backend default; may truncate large lists |
| 7 | Watermark "1989" hardcoded | `sobre/page.tsx:105`, `_components/quality-section.tsx:52` | Static brand fact; could be config-driven |
| 8 | `DEPARTMENTS` hardcoded in messages | `admin/mensagens/page.tsx:23` | Canonical list is the contact department enum; cosmetic |
| 9 | Mock refresh deferred / graphify graph stale | needs `MOCK_DUMP_EMAIL/PASSWORD`; graph points to old `(site)` structure | Drift risk; regenerate |

## ✅ Already aligned (false gaps from the initial exploratory report)

- Categories CRUD + nested templates, Templates screen, Attributes screen — all exist.
- Product wizard complete (specs, files, blocks, dnd `sortable-list`, block builder).
- Contact form wired: `suporte/_components/actions.ts` (server action → `POST /api/contact`),
  `contact-form.tsx` with validation + success/error states + department enum.
- Library alt-text I18n (pt/en/es via `I18nInput`).
- Product detail is server-side (`serverOrvalClient<GetApiProductsSlug200>`) + flat strings.
- Product status enum select (DRAFT/PUBLISHED/SCHEDULED) in wizard.
- Audit list uses offset pagination correctly.
- Public pages never resolve i18n — only `toApiLocale` for the `?locale=` param.

## Scope decision

User approved implementing **all items (1–9)** on a single branch/PR
(`refactor/cms-api-contract`). Catalog → server-side URL-driven (item 2) per prior decision.

## Implementation status (this PR)

| # | Item | Status | Notes |
|---|---|---|---|
| 1 | GALLERY block render | ✅ done | `toGalleryBlockData` + GALLERY case in `block-renderer.tsx` + i18n (pt/en/es) |
| 2 | Catalog → server-side URL-driven | ✅ done | `produtos/page.tsx` fetches via `serverOrvalClient` (page/pageSize/q/category); `catalog-content.tsx` is now presentational with debounced search + pagination control; dead `CATEGORY_IMAGE_BY_ID` removed. Verified in app: 325 produtos SSR, "Página 2 de 22" via `?page=`, 0 console errors |
| 3 | Header categories from API | ✅ done | `(site)/layout.tsx` server-fetches categories → `Header` props; curated image/description fallback by slug (contract has no category image URL / description) |
| 4 | Library add-version | ✅ done | `useLibraryUpload().uploadVersion` (presign→PUT→`postApiLibraryIdVersions`) + "Nova versão" UI in `EditAssetModal`. Also fixed library list invalidation to use the generated query key |
| 5 | Error handling by `err.code` | ✅ done | `getApiErrorMessage` + `adminToast.apiError`; category/template/config handlers branch on code (409/422/503…) |
| 7 | Founding-year watermark | ✅ done | `foundedYear` added to About hero block data (CMS-editable via section spec); public watermarks read it. CmsConfig NOT used (it is protected; About page payload is the public source) |
| 8 | Messages departments | ✅ done (was a real bug) | Grouping compared display labels to stored enum values → never matched. Now uses `PostApiContactBodyDepartment` enum + label map |
| 6 | Admin list pagination params | ⏳ deferred (low value) | Backend offset default (≤200) is acceptable for an internal tool; full pagination UI on messages/users/banners is a low-value future enhancement (pattern already exists in `historico`) |
| 9 | Mock refresh / graphify | ⏳ partial | Mock refresh needs `MOCK_DUMP_EMAIL/PASSWORD` (unavailable) — deferred. Orval client already in sync with the deployed backend. Regenerate graphify with `/graphify` (graph is stale) |

Contract limitations recorded: `PublicCategory` exposes only `icon_library_id` (no resolved
image URL) and no description; `CmsConfig` is protected and not consumed publicly. These shaped
the curated-fallback (item 3) and About-block (item 7) decisions.
