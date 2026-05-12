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

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Production build         |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |

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
│   ├── (site)/          ← Public site (header + footer layout)
│   │   ├── page.tsx     ← Home page
│   │   ├── produtos/    ← Products listing and detail
│   │   ├── sobre/       ← About page
│   │   └── suporte/     ← Support page
│   ├── admin/           ← Admin panel (planned)
│   └── cms/             ← CMS panel (planned)
└── components/ui/       ← Shared UI components
```

## Code Quality

Pre-commit hooks (husky + lint-staged) run automatically on every commit:

- **lint-staged**: ESLint auto-fix on staged `*.ts` / `*.tsx` files
- **tsc**: Full type-check (`--noEmit`) before commit

CI (GitHub Actions) runs on every push and pull request: type-check → lint → build.

## Deploy

Production deployments are handled by [Vercel](https://vercel.com). Preview deployments are created automatically for every pull request.
