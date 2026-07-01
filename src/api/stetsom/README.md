# Stetsom API Client (Orval-generated)

Types and React Query hooks generated from the stetsom-api OpenAPI spec.

## Regenerate

```bash
# stetsom-api must be running (pnpm dev) so /docs/json is reachable
pnpm api:generate     # one-shot
pnpm api:watch        # regenerate on spec change
```

Source of truth: `http://localhost:3333/docs/json` (Fastify + Zod OpenAPI).
Config: `orval.config.ts`.

## Layout

Two Orval targets from the same spec:

```
src/api/stetsom/
├── model/             # generated TS types, shared by both targets (barrel: index.ts)
├── endpoints/         # target `stetsom`: React Query hooks (client), mutator orvalClient (BFF)
├── server/            # target `stetsomServer`: plain typed functions (RSC), mutator serverOrvalClient
├── orval-client.ts    # CLIENT mutator — routes via BFF proxy (/api/bff/*)
├── orval-server.ts    # SERVER mutator — direct call + cookie via next/headers + mock
└── index.ts           # client barrel (models + hooks) — NEVER re-exports server/
```

Do **not** edit `model/`, `endpoints/` or `server/` — overwritten on regenerate.
`server/**` imports `next/headers`; import it ONLY from server code, never from the
client barrel, or the client build fails.

## Usage

### Client Component (React Query hooks)

```tsx
"use client";
import { useGetApiProducts, usePostApiBanners } from "@/api/stetsom";

function Catalog() {
  const { data, isLoading } = useGetApiProducts({ page: 1, pageSize: 20 });
  const createBanner = usePostApiBanners();
  // ...
}
```

Requests route through `/api/bff/<path>` — the Next.js BFF passthrough
(`src/app/api/bff/[...path]/route.ts`) injects the `admin_token` HttpOnly
cookie as a Bearer header. The JWT never reaches the browser.

### Server Component / Server Action (direct, no proxy)

Use the generated `server/**` functions — typed params and responses, no manual URLs:

```tsx
import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";

export default async function Page() {
  const products = await getApiProducts({ page: 1, pageSize: 20, locale: "pt" });
  // ...
}
```

These call `serverOrvalClient` (direct to stetsom-api, cookie injected server-side).

## Auth

Login / refresh / logout are **not** done through the generated hooks — they
use the dedicated `/api/auth/*` routes that set the HttpOnly cookies. The
generated auth hooks exist but should not be used for the login flow.

## Errors

All client calls reject with `OrvalApiError { status, code, message }` mirroring
the API's `{ error: { code, message } }` envelope.
