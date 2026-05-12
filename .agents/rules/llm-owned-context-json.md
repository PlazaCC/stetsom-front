---
description: 'MANDATORY after any AI-driven project change — editing files, implementing features, fixing bugs, refactoring, adding components, updating config, or creating docs. Covers LLM-owned changelog at docs/ia/context.json so every agent knows what was changed and why.'
applyTo: '**/*'
---

# LLM-Owned Context Changelog

`docs/ia/context.json` is the cross-agent changelog. Every AI agent that modifies this project **must** append an entry before finishing its work. This is not optional.

## When to append

Append **once per work batch** (not per file) whenever you:
- Edit, create, or delete any source file
- Install or remove a dependency
- Change configuration (Next.js, Tailwind, tsconfig, etc.)
- Create or update docs, rules, or task files
- Execute a skill that produces project changes

Do **not** append for: read-only lookups, failed attempts with no file changes, or pure analysis responses.

## Entry schema

```json
{
  "ts": "<ISO8601 UTC — e.g. 2026-05-12T14:30:00Z>",
  "agent": "<model ID — e.g. claude-sonnet-4-6>",
  "type": "<feat | fix | refactor | chore | docs | style | config | test>",
  "summary": "<one sentence, max 120 chars>",
  "files": ["<relative path from repo root>"],
  "rationale": "<why this was done — constraint, user request, design decision>",
  "outcome": "<observable result or impact>"
}
```

### Field rules
- `ts` — always UTC ISO8601; use current date/time, never a placeholder
- `agent` — the model ID string you are running as (e.g. `claude-sonnet-4-6`, `claude-opus-4-7`)
- `type` — pick the single best fit; use `chore` for tooling/config/rule changes
- `summary` — imperative mood, no period, max 120 chars ("Add HeroCarousel component")
- `files` — list only files you actually wrote or deleted; omit reads
- `rationale` — the *why*, not the *what* (the what is already in `summary`)
- `outcome` — what changed for the end user or next agent reading this log

## How to append

Read the current `docs/ia/context.json`, push your new entry to the end of the `"log"` array, then write the file back. Never rewrite the entire log from memory — always read first.

```jsonc
// Minimal valid entry example
{
  "ts": "2026-05-12T15:00:00Z",
  "agent": "claude-sonnet-4-6",
  "type": "feat",
  "summary": "Add RedBanner component to SobrePage",
  "files": ["src/app/(site)/sobre/_components/RedBanner.tsx"],
  "rationale": "User requested visual separator matching Figma design token bg-brand",
  "outcome": "RedBanner renders full-width red strip with heading text on /sobre route"
}
```

## Compaction rules

Run compaction only when `log` exceeds **50 entries**:
1. Merge sequential entries that touch the same files and share the same `type` into one summarized entry.
2. Preserve all entries newer than 14 days as-is.
3. Keep one entry per major feature/fix even in the compacted range.
4. Never delete the oldest entry — it anchors the project history.
5. Add `"compacted": true` on merged entries so agents know they are summaries.

## Hard constraints

- Never store secrets, tokens, credentials, or raw code blocks
- Preserve JSON validity at all times — invalid JSON breaks all agents
- Keep stable key ordering (`ts`, `agent`, `type`, `summary`, `files`, `rationale`, `outcome`)
- File path: always `docs/ia/context.json` (not the Figma context at `docs/ia/figma/context.json`)
