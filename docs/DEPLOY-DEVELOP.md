# Develop Environment Setup

The `develop` branch deploys to Vercel and uses the dedicated stetsom-api
develop environment. Production variables and data remain isolated.

Sentry is disabled in develop and all Vercel Previews. Keep
`NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and
`SENTRY_PROJECT` scoped to Vercel Production only.

## Vercel

Branch-specific variables in **Settings → Environment Variables**:

| Variable | Scope | Value |
|---|---|---|
| `CMS_API_BASE_URL` | Preview / `develop` | Develop API endpoint |
| `USE_MOCK_DATA` | Preview / `develop` | `0` |
| `STORAGE_PUBLIC_HOSTNAME` | Preview / `develop` | `stetsom-api-develop.s3.sa-east-1.amazonaws.com` |
| `JWT_ACCESS_SECRET` | Preview / `develop` | Same as the develop API |
| `JWT_REFRESH_SECRET` | Preview / `develop` | Same as the develop API |

The current site is
[stetsom-develop.vercel.app](https://stetsom-develop.vercel.app). It is
protected by Vercel Authentication.

The API temporarily uses an HTTP Elastic IP. Replace `CMS_API_BASE_URL` with an
HTTPS hostname when DNS access is available; no code change is required.

## Pull Request Preview

The release pull request from `develop` to `main` inherits the branch-specific
develop Preview variables. It therefore uses the develop API, never production
data.

## Local Development

```bash
git switch develop
git pull origin develop
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Set `CMS_API_BASE_URL` and matching JWT secrets to use a real API locally. Set
`USE_MOCK_DATA=1` only when explicitly working offline. The mock provider is a
temporary fallback and must stay contract-compatible.

## Refresh Mock Data

Run a local API on port 3333, configure mock dump credentials, then execute:

```bash
pnpm mock:dump
```

This regenerates `src/lib/mock/data.json`. Commit it only when the offline
fallback must be synchronized with a contract change.

## Troubleshooting

### Development Site Has No Data

Confirm the branch-specific `CMS_API_BASE_URL`, verify `USE_MOCK_DATA=0`, and
check the develop API directly. The minimal database baseline intentionally has
no products, banners, partners, templates, attributes, or library assets.

### CMS Login Does Not Work

Confirm the frontend JWT secrets exactly match `/srv/stetsom-api/.env.develop`
and that the seeded develop user credentials are being used.

### Images Fail to Load

Confirm `STORAGE_PUBLIC_HOSTNAME` points to the develop bucket and that uploaded
objects exist. The minimal seed does not create S3 objects.
