# Develop Environment Setup

The `develop` branch currently deploys a mock-backed development environment on Vercel.

> **Transition note:** This setup is temporary. `develop` will move to a dedicated API environment, after which `USE_MOCK_DATA`, mock credentials, and fixture refreshes will be deprecated.

## Vercel

Configure the project variables in `Settings > Environment Variables`.

| Variable | Value | Purpose |
| --- | --- | --- |
| `USE_MOCK_DATA` | `1` | Serves data from `src/lib/mock/data.json` |
| `JWT_ACCESS_SECRET` | Development secret | Supports mock CMS authentication |
| `JWT_REFRESH_SECRET` | Development secret | Supports mock token refresh |
| `CMS_API_BASE_URL` | Optional | Not used while mock mode is enabled |
| `STORAGE_PUBLIC_HOSTNAME` | Optional | Not used while mock mode is enabled |

Push to `develop` to deploy the environment. Its current address is [stetsom-front-git-develop-plazas-cc.vercel.app](https://stetsom-front-git-develop-plazas-cc.vercel.app).

## Pull Request Preview

A release pull request from `develop` to `main` creates a Vercel preview. It currently uses the same mock-data configuration as development.

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

## Troubleshooting

### Development Site Has No Data

Confirm that `USE_MOCK_DATA=1` is configured in Vercel. Refresh and commit `src/lib/mock/data.json` if the fixtures are outdated.

### CMS Login Does Not Work

Confirm that `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are configured in Vercel. Mock mode accepts any value for the `admin_token` cookie.
