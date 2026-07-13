# Develop Environment Setup

The `develop` branch currently deploys a mock-backed development environment on Vercel.

> **Transition status:** the dedicated backend environment is being provisioned — see `stetsom-api/docs/DEPLOY-DEVELOP.md` for the AWS runbook. The cutover to real data (see [Planned: AWS Develop Backend Cutover](#planned-aws-develop-backend-cutover) below) has **not** happened yet. `USE_MOCK_DATA`, mock credentials, and fixture refreshes remain in effect until that section is executed.

## Vercel (current, active)

Configure the project variables in `Settings > Environment Variables`.

| Variable | Value | Purpose |
| --- | --- | --- |
| `USE_MOCK_DATA` | `1` | Serves data from `src/lib/mock/data.json` |
| `JWT_ACCESS_SECRET` | Development secret | Supports mock CMS authentication |
| `JWT_REFRESH_SECRET` | Development secret | Supports mock token refresh |
| `CMS_API_BASE_URL` | Optional | Not used while mock mode is enabled |
| `STORAGE_PUBLIC_HOSTNAME` | Optional | Not used while mock mode is enabled |

Push to `develop` to deploy the environment. Its current address is [stetsom-develop.vercel.app](https://stetsom-develop.vercel.app).

## Pull Request Preview

A release pull request from `develop` to `main` creates a Vercel preview. It currently uses the same mock-data configuration as development, since Vercel scopes Preview environment variables per branch and the release PR's head is `develop`.

## Local Development

```bash
git switch develop
git pull origin develop
cp .env.local.example .env.local
pnpm install
pnpm dev
```

Set `USE_MOCK_DATA=1` in `.env.local` to work without the API. This fallback is temporary and should not receive new behavior.

## Refresh Mock Data

When the API contract changes, update the fixtures from a local API instance running on port 3333:

```bash
pnpm mock:dump
```

This regenerates `src/lib/mock/data.json`. Commit the file when the development environment needs the updated data.

## Planned: AWS Develop Backend Cutover

Once `stetsom-api`'s `develop` branch deploys successfully to `https://develop.api.<yourdomain>` (see `stetsom-api/docs/DEPLOY-DEVELOP.md`), the `develop` Vercel environment can switch from mock data to the real develop API. **Do this last, only after the AWS develop environment is confirmed working** — verify with `curl https://develop.api.<yourdomain>/docs` and a manual login against it first.

Steps, in the Vercel dashboard (**Settings → Environment Variables**):

1. For each variable below, click **Add New**, set **Environment: Preview**, then use the branch picker to scope it to `develop` only. This does not affect the Production environment or any other preview branch.

   | Variable | Value |
   | --- | --- |
   | `CMS_API_BASE_URL` | `https://develop.api.<yourdomain>` |
   | `USE_MOCK_DATA` | leave unset, or delete the existing `develop`-scoped value |
   | `STORAGE_PUBLIC_HOSTNAME` | `stetsom-api-develop.s3.sa-east-1.amazonaws.com` |
   | `JWT_ACCESS_SECRET` | same value as `stetsom-api`'s `/srv/stetsom-api/.env.develop` |
   | `JWT_REFRESH_SECRET` | same value as `stetsom-api`'s `/srv/stetsom-api/.env.develop` |

2. Trigger a redeploy of `develop` — push any commit, or use Vercel's "Redeploy" action — so the new env vars take effect.
3. Verify `https://stetsom-develop.vercel.app` now shows real develop data, and that CMS login works against the develop JWT secrets.
4. Once confirmed, update this document to remove the "Planned" heading and the transition-status note above, and update `README.md`'s Deploy table (Development row → "Real API (develop)").

## Troubleshooting

### Development Site Has No Data

Before the cutover: confirm that `USE_MOCK_DATA=1` is configured in Vercel. Refresh and commit `src/lib/mock/data.json` if the fixtures are outdated.

After the cutover: confirm `CMS_API_BASE_URL` points to `https://develop.api.<yourdomain>` and that the develop API is reachable (`curl https://develop.api.<yourdomain>/docs`).

### CMS Login Does Not Work

Before the cutover: confirm that `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are configured in Vercel. Mock mode accepts any value for the `admin_token` cookie.

After the cutover: confirm the frontend's `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET` match exactly the values in `stetsom-api`'s `/srv/stetsom-api/.env.develop`.
