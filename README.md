# Stetsom Front

[![CI](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml/badge.svg)](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml)

Institutional website and admin CMS for [Stetsom](https://stetsom.com.br).

Built with **Next.js 16**, **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

---

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
| `pnpm mock:dump`    | Refresh mock fixtures from the real API |

## Stack

| Layer         | Tech                  | Version |
| ------------- | --------------------- | ------- |
| Framework     | Next.js               | 16.2.4  |
| UI            | React                 | 19.2.4  |
| Language      | TypeScript            | 5       |
| Styling       | Tailwind CSS          | v4      |
| UI Primitives | @base-ui/react        | 1.4.1   |
| Components    | shadcn/ui             | base-nova |
| Icons         | lucide-react          | 1.8.0   |
| Animation     | motion                | 12      |
| Carousel      | swiper                | 12.1.4  |
| Data Fetching | @tanstack/react-query | 5       |

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

| Variable                                  | Description                                                                                     |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `CMS_API_BASE_URL`                        | Fastify API base URL. Omit to use mock data.                                                    |
| `USE_MOCK_DATA`                           | Set `1` to serve GET requests from `src/lib/mock/*.ts` instead of the real API.         |
| `MOCK_DUMP_EMAIL` / `MOCK_DUMP_PASSWORD`  | Credentials for `pnpm mock:dump`. Required only when refreshing mock fixtures after an API change. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`| Must match `stetsom-api/.env`.                                                                     |
| `STORAGE_PUBLIC_HOSTNAME`                 | S3 bucket hostname for `next/image`. Format: `{bucket}.s3.{region}.amazonaws.com`.                |

## Code Quality

Pre-commit hooks run on every commit: ESLint auto-fix on staged `.ts`/`.tsx` files and a full `tsc --noEmit` type-check.

CI runs on every push to `develop` and `main`, and on all pull requests. Pipeline: type-check → lint → build.

## Deploy

| Environment | Branch | Data | Trigger |
|-------------|--------|------|---------|
| **Production** | `main` | Real API | Auto-deploy on push |
| **Development** | `develop` | Mock (`USE_MOCK_DATA=1`) | Auto-deploy on push |
| **PR Preview** | Release PR (`develop`→`main`) | Mock | Auto-deploy on PR open |

All deployments are handled by [Vercel](https://vercel.com). No manual deploy steps.

See `CONTRIBUTING.md` for the full Git Flow and release workflow.
