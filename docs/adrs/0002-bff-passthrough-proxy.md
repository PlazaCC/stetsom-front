# 0002: BFF passthrough proxy

Status: Accepted

## Context

The admin panel needs an authenticated session, but JavaScript cannot read an HttpOnly cookie. Something server-side has to turn that cookie into the `Authorization: Bearer` header stetsom-api expects, without duplicating stetsom-api's business logic in the front end.

## Decision

`src/app/api/bff/[...path]` proxies browser requests to stetsom-api. It reads the `admin_token` HttpOnly cookie and forwards it as an `Authorization: Bearer` header. stetsom-api validates the JWT and enforces roles. The BFF adds no business logic beyond that header injection.

Two client entry points select the path by rendering context:

| Context | Client | Route |
| --- | --- | --- |
| Client component, React Query | `orvalClient` from `@/api/stetsom/orval-client` | `/api/bff/*`, BFF adds the Bearer token |
| Server component, route handler | `serverOrvalClient` from `@/api/stetsom/orval-server` | Direct to stetsom-api |

Dedicated route handlers exist for operations the generic proxy cannot cover: `api/auth/login`, `api/auth/logout`, `api/auth/refresh`, and `api/upload` for presigned S3 uploads.

The browser never calls stetsom-api directly. Server-rendered pages call stetsom-api server-to-server through `serverOrvalClient`. Interactive screens call this app's own `/api/*` routes, which relay to stetsom-api.

## Consequences

`ALLOWED_ORIGINS`/CORS on stetsom-api does not gate whether data loads on the site. CORS is a restriction the browser enforces on cross-origin calls, and the browser only ever talks to this app's own domain in this flow. Restricting `ALLOWED_ORIGINS` on the API is still good defense-in-depth, but it is not what makes data appear on the site. If pages load without data, the cause is `CMS_API_BASE_URL` or the JWT secrets, not CORS.

The one exception is file upload. The admin panel requests a presigned URL through an internal route, then the browser issues the `PUT` directly to the S3 bucket. That is the only direct browser-to-third-party call in the system, and it is why CORS must be configured on the S3 bucket, not on stetsom-api.
