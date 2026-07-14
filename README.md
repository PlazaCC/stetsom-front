# Stetsom Front

[![CI](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml/badge.svg?event=pull_request)](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml)
[![Production](https://img.shields.io/badge/production-online-16a34a)](https://stetsom-prod.vercel.app)
[![Development](https://img.shields.io/badge/development-preview-2563eb)](https://stetsom-develop.vercel.app)
[![Sentry](https://img.shields.io/badge/Sentry-stetsom--front-362D59?logo=sentry&logoColor=white)](https://stetsom.sentry.io/projects/stetsom-front/)

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-20232a?logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Institutional website and admin CMS for [Stetsom](https://stetsom.com.br).

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
| Observability | Sentry                 | Production only         |

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

The deployed `develop` branch uses its dedicated API. Mock data remains only as
an explicit local fallback and must not receive new behavior.

| Variable | Description |
| --- | --- |
| `CMS_API_BASE_URL` | Fastify API base URL. Omit to use mock data. |
| `USE_MOCK_DATA` | Set `1` to serve GET requests from `src/lib/mock/*.ts` instead of the real API. |
| `MOCK_DUMP_EMAIL` / `MOCK_DUMP_PASSWORD` | Credentials for `pnpm mock:dump`. Required when refreshing mock fixtures after an API change. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Must match `stetsom-api/.env`. |
| `STORAGE_PUBLIC_HOSTNAME` | S3 bucket hostname for `next/image`. Use `{bucket}.s3.{region}.amazonaws.com`. |

[Sentry](https://stetsom.sentry.io/projects/stetsom-front/) is enabled only in Vercel Production. Local and Preview environments must not define `NEXT_PUBLIC_SENTRY_DSN`; the Vercel integration manages the production DSN, auth token, releases, and source maps.

## Code Quality

Before each commit, Husky formats staged supported files, fixes ESLint issues in staged TypeScript files, and runs `pnpm tsc --noEmit`.

CI runs on pull requests targeting `develop` or `main`. It type-checks, lints, and builds the application.

## Deploy

| Environment | Branch | Data | Trigger |
| --- | --- | --- | --- |
| [Production](https://stetsom-prod.vercel.app) | `main` | Real API | Merge into `main` |
| [Development](https://stetsom-develop.vercel.app) | `develop` | Real develop API | Push to `develop` |
| PR preview | `develop` to `main` | Real develop API | Release PR |

All deployments are handled by [Vercel](https://vercel.com). No manual deploy steps.

The final domain `https://stetsom.com.br` is not wired up yet. Production currently serves from the Vercel domain above.

See `CONTRIBUTING.md` for the full Git Flow and release workflow.
