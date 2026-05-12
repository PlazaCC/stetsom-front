---
name: deliver
description: Full-cycle delivery orchestrator — runs next-task, create-pr, code-review, fixes issues and repeats until review passes. Trigger keywords: deliver, full cycle, implement and ship, next delivery.
argument-hint: '<optional: task ID or feature name>'
---

# Deliver — Full-Cycle Orchestrator

## Overview

Orchestrates the complete delivery cycle from task implementation to a passing PR. Chains the core delivery skills automatically.

**Cycle:** `/next-task` → `/create-pr` → `/code-review` → fix (if needed) → repeat until passes

---

## When to Use

- When you want to fully implement, document, and ship the next task end-to-end
- When you want autonomous delivery with minimal manual intervention

---

## Procedure

### Step 1 — Optional Design Pass

If the task has `Needs design pass: YES` in its task file:
→ Run `/refine-design` first to produce implementation-ready specs, then proceed to Step 2.

Otherwise skip to Step 2.

### Step 2 — Implement

Run `/next-task` to pick up and implement the next TODO task.

Confirm: task moved to `IN_PROGRESS`, implementation complete.

### Step 3 — Open PR

Run `/create-pr` to generate a conventional PR description and open the pull request.

Confirm: PR created with branch, title, and description.

### Step 4 — Review

Run `/code-review` against the open PR diff.

#### If review PASSES (no blocking issues):

→ Go to Step 5

#### If review FAILS (blocking issues found):

→ Go to Fix Loop

### Fix Loop

Address each blocking issue identified by `/code-review`:

1. Apply fixes to affected files
2. Commit with message: `fix: address review feedback`
3. Push to PR branch
4. Return to Step 4 (review again)

**Maximum 3 review loops.** If still failing after 3 iterations, surface all remaining issues to the user and stop.

### Step 5 — Report Done

Announce delivery complete:

- Task ID and feature name
- PR URL and branch
- Review result summary
- Any remaining non-blocking notes

Update task status to `REVIEW` in task file.

---

## Constraints

- Max 3 review loops before escalating to user
- Never force-push or amend published commits
- If `/next-task` finds no TODO tasks, report "Nothing to deliver" and exit
- Always append an entry to `docs/ia/context.json` upon completion

---

## Integration

**Chains:** `/next-task` → `/create-pr` → `/code-review`
**Optional pre-step:** `/refine-design` (if task has design pass flag)
**Called after:** `/create-task`
**Updates:** task file status → `REVIEW`, `docs/ia/context.json` log
