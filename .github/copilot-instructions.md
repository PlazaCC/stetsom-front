# Stetsom Front — Copilot Workspace Instructions

> Full project context, stack details, conventions, and route structure are in [`AGENTS.md`](../AGENTS.md).
> Read it before generating any code.

## Agent Skills (`npx skills` / skills.sh)

Skills are stored in `.agents/skills/` and discovered automatically. Invoke the matching skill before starting any task in its domain:

| Skill                           | When to use                                         |
| ------------------------------- | --------------------------------------------------- |
| `frontend-design`               | Building UI components, pages, layouts              |
| `ui-ux-pro-max`                 | Design reviews, color/typography choices, UX audits |
| `web-design-guidelines`         | Accessibility audits, design best-practice checks   |
| `figma`                         | Fetching Figma designs, design-to-code tasks        |
| `vercel-react-best-practices`   | React/Next.js performance, data fetching patterns   |
| `vercel-composition-patterns`   | Component architecture, compound components         |
| `vercel-react-view-transitions` | Page transitions, animated route changes            |
| `deploy-to-vercel`              | Deploying the app, creating preview deployments     |
| `quick-commit`                  | Generating commit messages from staged/unstaged changes |

## Quick Rules

- Path alias `@/*` → `src/` — never write `@/src/...`
- `params` and `searchParams` are `Promise` — always `await` them
- Tailwind v4: no config file — all tokens in `src/app/globals.css` via `@theme`
- Brand colors: `bg-brand` (red), `bg-brand-dark` (dark), `text-off-white`
- Server Components by default — add `"use client"` only when required

## Knowledge Graph

Knowledge graph at `graphify-out/` — consult `graphify-out/GRAPH_REPORT.md` when exploring
unfamiliar areas of the codebase. Use `/graphify` in Copilot Chat to build or update it.
