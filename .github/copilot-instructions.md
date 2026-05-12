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

## Quick Rules

- Path alias `@/*` → `src/` — never write `@/src/...`
- `params` and `searchParams` are `Promise` — always `await` them
- Tailwind v4: no config file — all tokens in `src/app/globals.css` via `@theme`
- Brand colors: `bg-brand` (red), `bg-brand-dark` (dark), `text-off-white`
- Server Components by default — add `"use client"` only when required

## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your **first tool call must be** to read `graphify-out/GRAPH_REPORT.md` (if it exists).

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

After reading the report (and `graphify-out/wiki/index.md` for deep questions), answer from the
graph. Only read source files when (a) modifying/debugging specific code, (b) the graph lacks
the needed detail, or (c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.
