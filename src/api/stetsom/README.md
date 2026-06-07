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

```
src/api/stetsom/
├── model/             # generated TypeScript types (Product, Banner, PagePayload…)
├── endpoints/         # generated React Query hooks, split by OpenAPI tag
├── orval-client.ts    # mutator for CLIENT components (routes via BFF proxy)
├── orval-server.ts    # helper for SERVER components / Server Actions (direct call)
└── index.ts           # barrel re-export
```

Do **not** edit `model/` or `endpoints/` — they are overwritten on regenerate.

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

```tsx
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type { ProductCatalogResponse } from "@/api/stetsom";

export default async function Page() {
  const products = await serverOrvalClient<ProductCatalogResponse>({
    method: "GET",
    url: "/api/products",
    params: { page: 1, pageSize: 20 },
  });
  // ...
}
```

## Auth

Login / refresh / logout are **not** done through the generated hooks — they
use the dedicated `/api/auth/*` routes that set the HttpOnly cookies. The
generated auth hooks exist but should not be used for the login flow.

## Errors

All client calls reject with `OrvalApiError { status, code, message }` mirroring
the API's `{ error: { code, message } }` envelope.
