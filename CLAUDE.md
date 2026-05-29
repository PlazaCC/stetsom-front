# CLAUDE.md

Claude Code-specific guidance for this repository.
Full stack reference and data schemas: `AGENTS.md`

## Stack

| Layer           | Tech                  | Version   | Critical notes                                                              |
| --------------- | --------------------- | --------- | --------------------------------------------------------------------------- |
| Framework       | Next.js               | 16.2.4    | App Router, `src/app/` — breaking changes; read `node_modules/next/dist/docs/` |
| UI              | React                 | 19.2.4    | Server Components by default; `params`/`searchParams` are Promises          |
| Language        | TypeScript            | 5         | strict mode, `moduleResolution: bundler`                                    |
| Styling         | Tailwind CSS          | v4        | PostCSS-based, **no `tailwind.config.*`** — tokens in `src/app/globals.css` |
| UI Primitives   | @base-ui/react        | 1.4.1     | Used for navigation, composition                                            |
| Components      | shadcn/ui             | base-nova | RSC enabled, CSS variables                                                  |
| Icons           | lucide-react          | 1.8.0     |                                                                             |
| Carousel        | swiper                | 12.1.4    | Hero carousel                                                               |
| Data Fetching   | @tanstack/react-query | 5         | Via `QueryProvider` wrapper                                                 |
| Animation       | motion                | 12        |                                                                             |
| Package manager | pnpm                  | —         | `pnpm-workspace.yaml` present                                               |

## Route Structure

```
src/app/
├── [locale]/                ← next-intl locale (pt-BR = no URL prefix)
│   ├── layout.tsx           ← Fonts, providers, NextIntlClientProvider
│   └── (site)/              ← Public site (no URL impact from group name)
│       ├── layout.tsx       ← Wraps with <Header> + <Footer>
│       ├── page.tsx         ← Home: imports from ./_components/
│       ├── _components/     ← Co-located home sections (not shared)
│       ├── produtos/
│       ├── sobre/
│       └── suporte/
├── admin/                   ← Admin panel
├── cms/                     ← CMS
├── layout.tsx               ← Root layout (globals.css + children only)
└── globals.css
```

## UI Components (`src/components/ui/`)

| File                  | Type   | Purpose                                          |
| --------------------- | ------ | ------------------------------------------------ |
| `header.tsx`          | Client | Sticky nav, desktop + mobile, uses `usePathname` |
| `footer.tsx`          | Server | 4-column dark footer                             |
| `container.tsx`       | Server | Max-width wrapper                                |
| `navigation-menu.tsx` | Client | Built on `@base-ui/react/navigation-menu`        |
| `section-label.tsx`   | Server | Section heading label                            |
| `product-card.tsx`    | Server | Product card                                     |
| `button.tsx`          | —      | shadcn button                                    |
| `accordion.tsx`       | —      | shadcn accordion                                 |
| `dropdown-menu.tsx`   | —      | shadcn dropdown                                  |

## Generated Files — Do Not Edit

- `types/routes.d.ts`
- `types/cache-life.d.ts`
- `types/validator.ts`

## Commands

```bash
pnpm dev        # start dev server at localhost:3000
pnpm build      # production build
pnpm lint       # run ESLint
pnpm tsc --noEmit  # type-check without emitting
```

No test runner is configured yet.

## Knowledge Graph

A codebase knowledge graph lives in `graphify-out/`. **Read it before exploring unfamiliar parts of the codebase.**

- `graphify-out/GRAPH_REPORT.md` — community map, god nodes, knowledge gaps (start here)
- `graphify-out/graph.html` — interactive visualization (open in browser)

Last run: 2026-05-12 · 58 files · 172 nodes · 32 communities
Key insight: `cn()` is the central utility (41 edges, present in virtually every component).
Regenerate with `/graphify` after major structural changes.

## Skills

Skills in `.claude/skills/` are auto-discovered by the harness. Quick reference:

| Skill | Trigger | When to use |
|---|---|---|
| `next-task` | `/next-task` | Pick + implement the next backlog task |
| `deliver` | `/deliver` | Full cycle: next-task → create-pr → code-review |
| `create-pr` | `/create-pr` | Generate PR description and open PR on GitHub |
| `code-review` | `/code-review` | Review branch diff vs `main` before merging |
| `brainstorm` | `/brainstorm` | Refine a new feature idea before creating a task |
| `create-task` | `/create-task` | Create a tracked task in `docs/ia/tasks/` |
| `modularize` | `/modularize` | Refactor large components into focused modules |
| `design-fidelity-audit` | `/design-fidelity-audit` | Full-site Figma fidelity pass |
| `refine-design` | `/refine-design` | Single-component Figma alignment |
| `screen-audit` | `/screen-audit` | Audit screens/flows vs Figma — matrix + plan before any code |
| `graphify` | `/graphify` | (Re)generate the codebase knowledge graph |

Full delivery workflow: `docs/ia/AI-DRIVEN-WORKFLOW.md`
Task backlog: `docs/ia/tasks/TASKS.md`

## Multi-Agent Coordination

Both Claude Code (CLI) and VSCode Copilot Chat agents operate in this repo.

- Claude Code rules: `.claude/rules/` (auto-loaded by harness)
- VSCode agent skills: `.agents/skills/`
- Shared tasks: `docs/ia/tasks/`
