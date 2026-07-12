---
name: deliver
description: Full-cycle delivery orchestrator — implements on develop, runs code-review, opens a release PR, fixes issues and repeats until review passes. Trigger keywords: deliver, full cycle, implement and ship, next delivery.
---

# Deliver — Full-Cycle Orchestrator

## Overview

Orchestrates the complete delivery cycle from implementation to a passing release. Chains the core delivery skills automatically.

**Cycle:** implement on `develop` → `/code-review` → fix (if needed) → repeat until passes → `/release`

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

Implement directly on `develop`. This is trunk-based development — commit and push to `develop` directly.

Confirm: implementation complete, pushed to `develop`.

### Step 3 — Review

Run `/code-review` to validate the diff from `develop` against `main`.

#### If review PASSES (no blocking issues):

→ Go to Step 4

#### If review FAILS (blocking issues found):

→ Go to Fix Loop

### Fix Loop

Address each blocking issue identified by `/code-review`:

1. Apply fixes to affected files
2. Commit with message: `fix: address review feedback`
3. Push to `develop`
4. Return to Step 3 (review again)

**Maximum 3 review loops.** If still failing after 3 iterations, surface all remaining issues to the user and stop.

### Step 4 — Release

Run `/release` to open a release PR from `develop` into `main`.

Vercel creates a preview deployment automatically.

### Step 5 — Merge and Ship

Once the preview is approved:

1. Merge the release PR
2. Vercel deploys `main` to production
3. `sync-develop.yml` auto-fast-forwards `develop` to `main`

### Step 6 — Report Done

Announce delivery complete:

- Feature name
- PR URL
- Review result summary

---

## Constraints

- Max 3 review loops before escalating to user
- Never force-push or amend published commits

---

## Integration

**Chains:** implement on `develop` → `/code-review` → `/release`
**Optional pre-step:** `/refine-design` (if task has design pass flag)
**After merge:** Vercel deploys production + sync-develop fast-forwards develop
