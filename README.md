# Stetsom Front

[![CI](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml/badge.svg)](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml)
[![Production](https://img.shields.io/badge/production-online-16a34a)](https://stetsom-prod.vercel.app)
[![Development](https://img.shields.io/badge/development-preview-2563eb)](https://stetsom-develop.vercel.app)

Institutional website and admin CMS for [Stetsom](https://stetsom.com.br).

Built with **Next.js 16**, **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Commands

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Start development server                  |
| `pnpm build`        | Production build                          |
| `pnpm start`        | Start production server                   |
| `pnpm lint`         | Run ESLint                                |
| `pnpm tsc --noEmit` | Type-check without emitting               |
| `pnpm api:generate` | Regenerate Orval types and hooks          |
| `pnpm mock:dump`    | Refresh mock fixtures from the real API  |

## Stack

| Layer         | Tech                  | Version |
| ------------- | --------------------- | ------- |
| Framework     | Next.js               | 16.2.4  |
| UI            | React                 | 19.2.4  |
| Language      | TypeScript            | 5       |
| Styling       | Tailwind CSS          | v4      |
| UI Primitives | @base-ui/react        | 1.4.1   |
| Components    | shadcn/ui             | base-nova               |
| Icons         | lucide-react          | 1.8.0                   |
| Animation     | motion                | 12                      |
| Carousel      | swiper                | 12.1.4                  |
| Data Fetching | @tanstack/react-query | 5                       |

## Project Structure

```
src/
├── app/
│   ├── [locale]/         ← next-intl locale wrapper
│   │   └── (site)/       ← public site
│   │       ├── page.tsx  ← home page
│   │       ├── produtos/ ← product listing and detail
│   │       ├── sobre/    ← about page
│   │       └── suporte/  ← support page
│   ├── admin/            ← admin CMS panel
│   └── api/              ← BFF route handlers, auth, upload
├── api/stetsom/          ← Orval-generated types and React Query hooks
├── components/ui/        ← shared UI components
└── lib/mock/             ← mock data loader
```

## Environment Variables

Copy `.env.local.example` to `.env.local`.

> **Transition note:** Mock data is temporary. The `develop` environment will move to a dedicated API environment, then `USE_MOCK_DATA` and the mock fixtures will be deprecated. Do not add mock-only behavior.

| Variable | Description |
| --- | --- |
| `CMS_API_BASE_URL` | Fastify API base URL. Omit to use mock data. |
| `USE_MOCK_DATA` | Set `1` to serve GET requests from `src/lib/mock/*.ts` instead of the real API. |
| `MOCK_DUMP_EMAIL` / `MOCK_DUMP_PASSWORD` | Credentials for `pnpm mock:dump`. Required when refreshing mock fixtures after an API change. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Must match `stetsom-api/.env`. |
| `STORAGE_PUBLIC_HOSTNAME` | S3 bucket hostname for `next/image`. Use `{bucket}.s3.{region}.amazonaws.com`. |

## Code Quality

Before each commit, Husky formats staged supported files, fixes ESLint issues in staged TypeScript files, and runs `pnpm tsc --noEmit`.

CI runs on pull requests targeting `develop` or `main`. It type-checks, lints, and builds the application.

## Deploy

| Environment | Branch | Data | Trigger |
| --- | --- | --- | --- |
| [Production](https://stetsom-prod.vercel.app) | `main` | Real API | Merge into `main` |
| [Development](https://stetsom-develop.vercel.app) | `develop` | Mock data during the migration | Push to `develop` |
| PR preview | `develop` to `main` | Mock data during the migration | Release PR |

All deployments are handled by [Vercel](https://vercel.com). No manual deploy steps.

The final domain `https://stetsom.com.br` is not wired up yet. Production currently serves from the Vercel domain above.

See `CONTRIBUTING.md` for the full Git Flow and release workflow.
