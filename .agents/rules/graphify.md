---
description: 'Use when regenerating or querying the graphify knowledge graph, or to understand per-agent (Claude Code / VSCode Copilot / Codex) graphify capabilities and the PreToolUse hook enforcement.'
---

# Graphify — Knowledge Graph Usage

## Overview

Graphify builds a codebase knowledge graph in `graphify-out/` (`graph.json`, `graph.html`, `GRAPH_REPORT.md`). PreToolUse hooks in `.claude/settings.json` enforce graphify-first queries before grep/find/read on source files — see "PreToolUse Hook Enforcement" below.

**Stetsom Front specific:**
- **God nodes:** `cn()` (41 edges), `Button()` (7 edges), `buttonVariants` (6 edges)
- **Communities:** Utilities, Pages & Routes, UI Components, Technology Stack

## How to Use

1. **Codebase orientation** — read `GRAPH_REPORT.md` first, identify the relevant community, check its god nodes.
2. **Impact analysis** — find the target symbol in `graph.json`, check its edges; high-degree targets are ripple-effect risks.
3. **Finding hidden dependencies** — check the "Surprising Connections" / INFERRED edges before refactoring.

```bash
graphify query "<question>"       # scoped subgraph
graphify explain "<concept>"
graphify path "<A>" "<B>"
```

### When to Use vs Grep

✅ Exploring an unfamiliar area, understanding dependencies, finding usages, tracing call chains, spotting hidden coupling.
❌ Modifying/debugging specific lines (graph is read-only), needing exact line numbers, literal string search, needing to see actual code.

## Per-Agent Capabilities

| Agent | Can query | Can regenerate | Notes |
|---|---|---|---|
| Claude Code CLI | Yes | Yes (`/graphify` skill or `graphify . --update`) | PreToolUse hooks in `.claude/settings.json` apply to all its tool calls |
| VSCode Copilot Chat | Yes — reads `graph.json` / `GRAPH_REPORT.md` directly | No — ask Claude Code CLI to rebuild | Skills/rules auto-discovered from `.agents/skills/`, `.agents/rules/` |
| Codex | Same as VSCode Copilot Chat | No | Depends on `multi_agent = true` in `~/.codex/config.toml`; use `AGENTS.md` for guidance |

## PreToolUse Hook Enforcement

`.claude/settings.json` wires two PreToolUse hooks for Claude Code CLI:
- **Bash matcher** — fires on commands containing `grep`, `rg`, `find`, `fd`, `ack`, `ag`
- **Read/Glob matcher** — fires on reads/globs of source-like paths (`.ts`, `.js`, `.md`, etc.)

Both inject additional context nudging toward `graphify query` first when `graphify-out/graph.json` exists. Include the same instruction in subagent prompts that explore code:

```markdown
Before using grep, run: `graphify query "<your question>"`
```

## Regenerating the Graph

Primary path, in Claude Code CLI:

```bash
/graphify
```

Under the hood (also runnable directly in a Claude Code CLI terminal):

```bash
graphify install --project
graphify .
```

Recommended after: adding or removing 5+ source files, major refactor or modularization pass, before a full design-fidelity-audit.

**Why graphify-first:** code extraction (AST via tree-sitter) is fast and needs no API key. Semantic extraction (INFERRED edges) needs an LLM call but is prioritized over plain AST edges — it captures business relationships grep can't see.

## If graphify-out Is Missing or Stale

- **Missing** — Claude Code should rebuild with `/graphify`; VSCode Copilot / Codex should ask Claude Code to rebuild, or ask the user.
- **Stale** — Claude Code should rebuild with `graphify . --update`; VSCode Copilot / Codex should notify the user with the last-run date and recommend a rebuild.

## Performance Notes

- AST extraction is fast. Semantic (INFERRED edge) extraction depends on the configured LLM backend and is slower.
- `graphify-out/cache/ast/` holds parsed ASTs for incremental builds — commit it to speed up subsequent runs.

## Resources

- Full usage docs: `.claude/skills/graphify/SKILL.md`
- Official docs: https://github.com/safishamsi/graphify