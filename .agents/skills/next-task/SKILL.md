---
name: next-task
description: Use to start or resume implementation of the next available task — picks the next TODO task, reads its acceptance criteria, and drives implementation to completion. Trigger keywords: next task, start task, implement task, execute task.
---

# Next Task — Execution Entry Point

## Overview

Picks the next available task from the task list and drives its full implementation cycle.

**Core principle:** One task at a time. Finish before moving on.

---

## When to Use

- Tasks exist in the backlog with `Status: TODO`
- Resuming a task that is `IN_PROGRESS`
- Any time implementation work should start

---

## Procedure

### Step 1 — Find the Next Task

Read the next task file and find the first with `Status: TODO` or `Status: IN_PROGRESS`. Prioritize `IN_PROGRESS` tasks.

If no tasks exist → "No tasks in the backlog. Run `/brainstorm` to create one."

### Step 2 — Load Task Context

Read the task file fully. Extract:

- Objective
- Acceptance criteria
- Implementation notes
- Whether a design pass is needed

If `Needs design pass: YES` and no Figma work has been done → suggest running `/refine-design` before implementation.

### Step 3 — Update Task Status

Edit the task file: change `Status: TODO` → `Status: IN_PROGRESS`.

Confirm the correct git branch is active:

```bash
git branch --show-current
```

If not on the task's branch, switch:

```bash
git checkout feat/<slug>
```

### Step 4 — Implement

Execute the implementation guided by the acceptance criteria. Apply all project rules:

- Server Components by default (`"use client"` only when needed)
- `@/*` path alias, never `@/src/...`
- Brand tokens: `bg-brand`, `bg-brand-dark`, `bg-off-white`
- `font-sans-condensed` for headings and specs
- `cn()` for conditional classes
- No comments unless WHY is non-obvious

Read relevant existing files before writing new code. Extend don't replace.

### Step 5 — Validate

```bash
pnpm tsc --noEmit
pnpm lint
```

Fix all errors before proceeding.

### Step 6 — Verify Acceptance Criteria

Go through each criterion in the task file. Mark completed ones:

```
- [x] <criterion>
```

### Step 7 — Update Task Status

Edit the task file: change `Status: IN_PROGRESS` → `Status: REVIEW`.

### Step 8 — Announce Completion

Report:

- What was implemented (summary)
- Files changed
- All acceptance criteria met: YES/NO
- Next step: run `/create-pr`

---

## Integration

**Called after:** `/create-task` (or directly if tasks exist)
**Optional next:** `/refine-design` (if design pass needed)
**Required next:** `/create-pr` → `/code-review`
