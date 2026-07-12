# Develop Environment Setup

How we created the `develop` environment and how to recreate it from scratch.

## What was done (migration history)

1. Merged `feat/cms-product-wizard-visual-proposal` into `main`
2. Deleted the feature branch and all obsolete remote branches
3. Created `develop` from `main`:
   ```bash
   git checkout main
   git checkout -b develop
   git push -u origin develop
   ```
4. Configured Vercel to auto-deploy the `develop` branch

## Vercel — develop environment

### Current configuration

The develop environment is configured in the Vercel dashboard under the project's **Settings → Environment Variables**.

All variables are scoped to the **Development** environment (matching the `develop` branch):

| Variable | Value | Notes |
|----------|-------|-------|
| `USE_MOCK_DATA` | `1` | Entire site runs against `src/lib/mock/data.json` |
| `JWT_ACCESS_SECRET` | `mock-dev-access-secret` | Mock auth for admin CMS login |
| `JWT_REFRESH_SECRET` | `mock-dev-refresh-secret` | Mock auth token refresh |
| `CMS_API_BASE_URL` | _(placeholder)_ | Not used when `USE_MOCK_DATA=1` |
| `STORAGE_PUBLIC_HOSTNAME` | _(placeholder)_ | Not used when `USE_MOCK_DATA=1` |

### How to recreate from scratch

1. Go to the Vercel project dashboard
2. **Settings → Environment Variables**
3. Select the **Development** environment scope
4. Add each variable from the table above
5. Push to `develop` to trigger the first deploy:
   ```bash
   git checkout develop
   git commit --allow-empty -m "chore: trigger initial dev deploy"
   git push origin develop
   ```
6. Wait for the Vercel build to finish — the dev site will be at the auto-generated Vercel URL

### Domain

The develop environment uses Vercel's auto-generated domain (e.g., `stetsom-front-git-develop-plazacc.vercel.app`). No custom domain is configured for dev.

The exact URL is visible in the Vercel dashboard under **Deployments** after the first successful build.

## PR Preview

When a release PR is opened (`develop` → `main`), Vercel automatically creates a preview deployment. This uses the same mock-data configuration inherited from the develop environment.

## Local development

```bash
# Clone and switch to develop
git checkout develop
git pull origin develop

# Copy env file
cp .env.local.example .env.local

# Optional: enable mock mode to work offline
# Uncomment USE_MOCK_DATA=1 in .env.local

pnpm install
pnpm dev
```

### Refreshing mock data

When the backend API changes and you want updated mock fixtures:

```bash
# Ensure the API is running locally on port 3333
pnpm mock:dump
```

This regenerates `src/lib/mock/data.json` from the live API. Commit the updated file if the changes should be available to the dev environment.

## Troubleshooting

**Dev site shows empty data:**
- Check that `USE_MOCK_DATA=1` is set in Vercel dev environment variables
- Run `pnpm mock:dump` locally and push the updated `data.json` to `develop`

**Can't log into admin CMS on dev:**
- The mock login uses any value for the `admin_token` cookie
- Make sure `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set in Vercel