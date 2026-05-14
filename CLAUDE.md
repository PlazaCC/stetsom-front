# CLAUDE.md

Claude Code-specific guidance for this repository.

@AGENTS.md

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
| `graphify` | `/graphify` | (Re)generate the codebase knowledge graph |

Full delivery workflow: `docs/ia/AI-DRIVEN-WORKFLOW.md`  
Task backlog: `docs/ia/tasks/TASKS.md`

## Multi-Agent Coordination

Both Claude Code (CLI) and VSCode Copilot Chat agents operate in this repo.

**REQUIRED — changelog rule:** Any agent that edits files **must** append one entry to `docs/ia/context.json` before finishing. This is the coordination layer between agents. Schema and rules: `.claude/rules/llm-owned-context-json.md`.

- Claude Code rules: `.claude/rules/` (auto-loaded by harness)
- VSCode agent skills: `.agents/skills/`
- Shared tasks: `docs/ia/tasks/`
