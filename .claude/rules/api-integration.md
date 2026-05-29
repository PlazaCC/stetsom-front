---
description: 'Use when implementing API calls, BFF routes, auth flows, upload logic, or error handling. Covers provider abstraction, auth pattern, error contract, pagination styles, upload 3-step flow, admin auth guard.'
applyTo: 'src/**/*.{ts,tsx,js}'
---

# API Integration — Patterns & Rules

Reference for integrating with **stetsom-api** (Fastify). Consult OpenAPI/MCP for current endpoint paths and field names — this document covers stable architectural decisions.

---

## Provider Abstraction

All API calls go through `getCmsProvider()` (`src/lib/api/provider.ts`). The provider is a singleton that switches based on `CMS_API_BASE_URL`:

```
CMS_API_BASE_URL set → createRemoteCmsProvider()  (stetsom-api via HTTP)
(default/unset)      → createMockCmsProvider()    (local fixtures, no network)
CMS_FORCE_BFF=1      → forces remote even without CMS_API_BASE_URL (for testing)
```

**Rule:** never call `fetch()` directly in pages or hooks for data that belongs to the provider contract. Route handlers and `use-upload.ts` are the only exceptions (they need direct auth token forwarding or browser S3 access).

---

## BFF Layer

Next.js route handlers under `src/app/api/` are a thin BFF. Their sole responsibilities:

1. **Read auth token from the `admin_token` cookie** and forward as `Authorization: Bearer <token>`
2. **Parse and validate query params** before forwarding to the provider
3. **For data routes:** call `getCmsProvider()` and return provider output as-is
4. **For auth/upload routes:** forward directly to `stetsom-api` preserving status and error contract

Route handlers must not contain business logic.

---

## Auth Pattern

**Flow:**
1. `POST /api/auth/login` → returns `{ accessToken, refreshToken }` (both JWTs)
2. The BFF login route stores `admin_token` as an `HttpOnly` cookie
3. Every protected request reads this cookie and sends `Authorization: Bearer <accessToken>`
4. `POST /api/auth/refresh` + `{ refreshToken }` → returns `{ accessToken }`

**Rules:**
- The `admin_token` cookie is `HttpOnly` — never readable from JS; always handled server-side in route handlers
- `getAuthHeaders()` in `remote-provider.ts` reads the cookie via `next/headers` — only works in Route Handlers and Server Components (never in `"use client"` code)
- Client components trigger auth actions through the BFF route handlers, not directly
- Logout is stateless (`DELETE /api/auth/logout`) — the backend does not invalidate JWTs server-side; token expiry is the security boundary

**Public routes** (no auth needed): all `/api/pages/*`, `/api/categories/`, `/api/products/` (listing), `/api/products/:slug` (detail), `/api/contact/`

**Protected routes** (require `Authorization: Bearer`): all `/api/dashboard/`, `/api/users/`, `/api/banners/`, `/api/library/`, `/api/messages/`, `/api/audit/`, `/api/config/`, `/api/upload/*`, `/api/products/admin*`

---

## Error Contract

Every error from the API follows a single shape — never assume plain text or other formats:

```ts
// ApiErrorPayload
{
  error: {
    code: string    // machine-readable: "UNAUTHORIZED", "NOT_FOUND", "VALIDATION_ERROR", ...
    message: string // human-readable description
  }
}
```

**Common HTTP status → code mappings:**
| Status | Typical `code` |
|--------|---------------|
| 401 | `UNAUTHORIZED` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `VALIDATION_ERROR` |
| 503 | `SERVICE_UNAVAILABLE` |

**Rule:** always check `error.code` for programmatic branching, not the message string. The message is for user display only.

---

## Pagination

Two coexisting pagination styles — know which endpoint uses which:

**Page-based** (catalog products, CMS products):
```ts
{ items: T[], total: number, page: number, pageSize: number, totalPages: number }
```
Query params: `page` (1-indexed, default 1), `pageSize` (default 20, max 100)

**Offset-based** (users, messages, audit, library, banners):
```ts
{ items: T[], total: number }
```
Query params: `limit` (max 200), `offset`

**Rule:** never mix the two styles on the same endpoint. When implementing a new list hook, match the style used by the endpoint.

---

## Product Data Model

Products have a richer model than a flat key-value structure:

```
Product
  └── variations[]        // size/power variants, each with ordered specs[]
  └── highlight_attributes[] // which spec attributes to show in card/header
  └── blocks[]            // ordered page-builder content (IMAGE, VIDEO, HTML, MODEL3D, TEXT)
  └── files[]             // downloadable assets (MANUAL, CATALOG, CERTIFICATE, IMAGE, OTHER)
```

**Key rules:**
- `variations` + `specs` replace flat `specifications: Record<string,any>` — specs are typed rows with `attribute` + `value` + `order`
- `blocks` are ordered by `order` (ascending) — always sort before rendering
- `files.version` increments per `product_id + type` combination — display the highest version as current
- `files.is_active` must be checked — inactive files should not be shown publicly
- `badge` is nullable — render conditionally; never assume it exists
- `markets?: string[]` is an optional filter — if present, only show in listed locales; absence means all locales

---

## Upload Flow (3 steps, no BFF stream)

Files are uploaded directly from the browser to S3 using presigned URLs. The BFF only handles auth:

```
1. POST /api/upload  (BFF → backend)
   body: { fileName, mimeType, sizeBytes, scope? }
   → returns: { uploadUrl, file_url, headers, assetType, ... }

2. PUT {uploadUrl}  (browser → S3, no Authorization header)
   headers: presign.headers  ← must include Content-Type as returned by backend
   body: File binary
   → S3 validates the signature; extra unsigned headers cause SignatureDoesNotMatch

3. POST /api/upload/complete  (BFF → backend)
   body: { name, file_url, type, size_bytes, width?, height?, alt?, product_id?, revision? }
   → returns: { asset: LibraryAsset }
```

**Rules:**
- Send **only** the headers from `presign.headers` to S3 — do not add `Authorization` or any other header not included in the presigned signature
- `file_url` from step 1 is the permanent public URL — store it in resource fields (banner images, product thumbnails, block data)
- `uploadUrl` is a presigned URL with embedded expiry (default 15 min) — do not cache or reuse
- Always call step 3 after step 2 succeeds — the asset is not in the library until registered

---

## List Response Patterns (Library, Banners, Users)

Admin list endpoints return `{ items, total }` without page/pageSize metadata. The current front-end pattern for these is to load all items and paginate client-side (acceptable given volume). When datasets grow, switch to offset-based queries using `limit` + `offset` query params.

---

## User Roles

Three roles — access control is enforced server-side; the frontend only uses role for UI display:

| Role | Label |
|------|-------|
| `SUPER_ADMIN` | Full access including user management |
| `ADMIN` | Content management, no user admin |
| `EDITOR` | Read + draft; no publish or destructive actions |

---

## Site Payload Pattern

Site pages (`/api/pages/home`, `/api/pages/about`, `/api/pages/catalog`, `/api/pages/support`) return **full page payloads** — a single request returns all data needed to render the entire page. This is intentional (avoids waterfall requests from RSC pages).

**Rule:** do not break these into multiple smaller fetches. Each payload is cached at the CDN/ISR layer on the backend side.

Site endpoints return `503` (not `404`) when a content dependency is unavailable — handle this gracefully with a fallback state, not a 404 page.

---

## Audit Log

`AuditEntry.action` is one of: `CREATE | UPDATE | DELETE | LOGIN | LOGOUT | PUBLISH`

`action_sentence` is a pre-formatted human-readable string — render it directly without reformatting. Filter by `entity` query param to scope the log to a specific resource type.

---

## Admin Route Auth Guard

**Every** admin route handler MUST call `getAdminToken()` as its **first** statement and return `unauthorizedResponse()` when the result is `null`:

```ts
export async function GET(request: NextRequest, ...) {
  const token = await getAdminToken();
  if (!token) return unauthorizedResponse();
  // ...
}
```

**Why:** The Next.js proxy (`proxy.ts`) no longer covers `/api/*` routes in its matcher — route-level auth is the **sole security boundary** for API routes. A handler that omits this guard is publicly accessible. There is no fallback layer.

---

## Type Source of Truth

`src/lib/api/contracts.ts` is the canonical TypeScript type file for all API shapes. Rules:
- Never define API shapes inline in components or hooks — import from contracts
- When the backend schema changes, update `contracts.ts` first, then fix all consumers
- Mock data in `src/lib/mock/` must conform to these types — use them as a compatibility test
