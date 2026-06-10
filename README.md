# Stetsom Front

[![CI](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml/badge.svg)](https://github.com/PlazaCC/stetsom-front/actions/workflows/ci.yml)

Institutional website and admin CMS for [Stetsom](https://stetsom.com.br) — a Brazilian automotive amplifier brand with 35+ years in the market.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `pnpm dev`           | Start development server                 |
| `pnpm build`         | Production build                         |
| `pnpm start`         | Start production server                  |
| `pnpm lint`          | Run ESLint                               |
| `pnpm tsc --noEmit`  | Type-check without emitting              |
| `pnpm api:generate`  | Regenerate Orval types and hooks         |
| `pnpm mock:dump`     | Refresh `src/lib/mock/data.json` from API |

## Stack

| Layer         | Tech                  | Version |
| ------------- | --------------------- | ------- |
| Framework     | Next.js               | 16.2.4  |
| UI            | React                 | 19.2.4  |
| Language      | TypeScript            | 5       |
| Styling       | Tailwind CSS          | v4      |
| UI Primitives | @base-ui/react        | 1.4.1   |
| Components    | shadcn/ui (base-nova) | —       |
| Icons         | lucide-react          | 1.8.0   |
| Animation     | motion                | 12      |
| Carousel      | swiper                | 12.1.4  |
| Data Fetching | @tanstack/react-query | 5       |

## Project Structure

```
src/
├── app/
│   ├── [locale]/        ← next-intl locale wrapper (pt-BR = no prefix)
│   │   └── (site)/      ← Public site (header + footer layout)
│   │       ├── page.tsx ← Home page
│   │       ├── produtos/ ← Products listing and detail
│   │       ├── sobre/   ← About page
│   │       └── suporte/ ← Support page
│   ├── admin/           ← Admin CMS panel
│   └── api/             ← BFF route handlers + auth + upload
├── api/stetsom/         ← Orval-generated types and React Query hooks
├── components/ui/       ← Shared UI components
└── lib/mock/            ← Mock data loader (USE_MOCK_DATA=1)
```

## Development with Mock Data

To run without the backend API:

```bash
# 1. Populate the fixture file (requires real API + credentials)
MOCK_DUMP_EMAIL=admin@example.com MOCK_DUMP_PASSWORD=secret pnpm mock:dump

# 2. Enable mock mode
echo "USE_MOCK_DATA=1" >> .env.local

# 3. Start the dev server
pnpm dev
```

All `GET` requests are served from `src/lib/mock/data.json`. Mutations return `{ _mock: true }` so the UI doesn't show errors.

## Code Quality

Pre-commit hooks (husky + lint-staged) run automatically on every commit:

- **lint-staged**: ESLint auto-fix on staged `*.ts` / `*.tsx` files
- **tsc**: Full type-check (`--noEmit`) before commit

CI (GitHub Actions) runs on every push and pull request: type-check → lint → build.

## Deploy

Production deployments are handled by [Vercel](https://vercel.com). Preview deployments are created automatically for every pull request.
