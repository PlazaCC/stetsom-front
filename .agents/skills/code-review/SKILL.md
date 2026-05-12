---
name: code-review
description: Use when a feature branch is complete and ready for PR — runs a full diff-based review of the current branch against main, reads every changed file, validates against project rules, and produces a concrete action plan. Do NOT use on main branch.
---

# Code Review — Branch vs Main

## Overview

Full review of current branch diff against `main`, grounded in actual file contents. No hallucination — every finding cites a file and line number.

**Core principle:** Read first, judge second. Every claim must be traceable to a real line in a real file.

**Announce at start:** "Running code-review skill — analyzing branch `<name>` vs `main`."

---

## Step 0 — Guard: Confirm Not on Main

```bash
git branch --show-current
```

If output is `main` or `master`: **STOP.** Report:

> "You are on `main`. Switch to your feature branch before running code review."

Do not continue.

---

## Step 1 — Gather the Diff

```bash
git diff --name-status main...HEAD
git diff main...HEAD
```

Record the file list. If empty → "No changes found vs main. Nothing to review."

---

## Step 2 — Read Every Changed File

For each file in the diff, read its **current state** using the Read tool (not just the patch). Understand context, not just the lines that changed.

Priority order:
1. New files (highest risk — no previous review)
2. Modified files in `src/lib/`, `src/components/ui/` (shared logic)
3. Modified files in `src/app/` (pages, layouts, routes)
4. Config files (`next.config.*`, `tsconfig.json`, `postcss.config.*`)

---

## Step 3 — Run Validators

```bash
pnpm tsc --noEmit
pnpm lint
```

> Note: No test runner is configured in this project. Skip test step.

Capture output. Include failures verbatim in the report.

---

## Step 4 — Review Against Project Rules

Check each changed file against the rules in `.claude/rules/`:

### Path Alias (`.claude/rules/path-alias.md`)
- `@/*` maps to `src/` — never `@/src/...`

### Next.js App Router (`.claude/rules/next-app-router.md`)
- `params` and `searchParams` must be `await`ed
- Do not edit generated `types/*.d.ts` files
- `"use client"` only when hooks or event handlers are present

### React Components (`.claude/rules/react-components.md`)
- Server Component by default
- Named exports (except page/layout)
- `cn()` for conditional class merging

### Tailwind v4 (`.claude/rules/tailwind-v4.md`)
- No arbitrary colors — use brand tokens (`bg-brand`, `bg-brand-dark`, `bg-off-white`)
- No `tailwind.config.*` changes — all config in `globals.css`
- `font-sans-condensed` for headings and spec numbers

### TypeScript (`.claude/rules/typescript.md`)
- No `any`
- Props types declared above the component
- No barrel `index.ts` files

### General
- `pnpm` — never `npm install` or `yarn add`
- No comments unless WHY is non-obvious
- No features beyond what the task requires

---

## Step 5 — Write the Report

```
## Code Review — <branch-name> vs main
Date: <today>
Files changed: <N> (<list file names>)

---

### Validator Results
- TypeScript: ✅ PASS / ❌ FAIL (<N errors>)
- ESLint:     ✅ PASS / ❌ FAIL (<N warnings/errors>)

---

### Critical Issues (must fix before PR)
> Issues that will cause runtime errors, security vulnerabilities, or broken behavior.

- [ ] **[FILE:LINE]** <issue> — <why it matters> — <suggested fix>

---

### Important Issues (fix before merging)
> Violations of project rules, incorrect patterns, missing validation.

- [ ] **[FILE:LINE]** <issue> — <rule violated> — <suggested fix>

---

### Minor Issues (note for later)
> Code style, naming, opportunities to simplify.

- [ ] **[FILE:LINE]** <issue> — <suggestion>

---

### Strengths
> Patterns done correctly that should be maintained.

- <positive finding with file reference>

---

### Assessment
**Ready for PR?** YES / NO — <one sentence reason>
```

Always end with one of:

```
## VERDICT: APPROVED
```

or

```
## VERDICT: NEEDS_FIXES
- [ ] [FILE:LINE] <what to fix>
```

APPROVED = zero Critical issues + all validators passed.
NEEDS_FIXES = at least one Critical issue or validator failure.

---

## Anti-Hallucination Rules

- Never report an issue not seen in an actual file read
- Never reference a function or import not confirmed in the diff
- Always include `[FILE:LINE]` for every issue
- Only flag code that appears in the current diff — pre-existing code is not in scope

---

## Integration

**Called after:** `/create-pr`
**If NEEDS_FIXES:** fix items → run `/create-pr` again → run `/code-review` again. Repeat until APPROVED.
