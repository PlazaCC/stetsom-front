---
name: release
description: Use when develop is ready to ship — opens a release PR from develop into main. Vercel creates a preview automatically. Merge the PR to deploy to production. Branches stay synchronized automatically.
---

# Release — Develop → Main

## Overview

Opens a pull request from `develop` into `main`. This is the **only** type of PR in the trunk-based Git Flow — there are no feature-branch PRs.

On merge, Vercel deploys `main` to production automatically.

---

## When to Use

- When `develop` has accumulated changes ready to ship
- When you want a preview deployment before going to production

---

## Implementation

### Step 1 — Guard: Confirm on Develop

```bash
git branch --show-current
```

If not on `develop`, switch:

```bash
git checkout develop
git pull origin develop
```

### Step 2 — Analyze Changes

```bash
git diff --name-status main...HEAD
git log main...HEAD --oneline
```

### Step 3 — Run Validators

```bash
pnpm tsc --noEmit
pnpm lint
pnpm build
```

Report any failures. Do not proceed if TypeScript, lint, or build errors exist.

### Step 4 — Present PR Content for Review

Output the generated title and body as copy-paste ready blocks — **do not run `gh pr create` yet**:

---

**PR Title** _(copy and paste)_

```
<conventional-title>
```

---

**PR Body** _(copy and paste)_

```markdown
## Summary

<bullet points of changes>

## What changed

<key features, fixes, refactors>

## Checklist

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Build passes
- [ ] Preview URL approved
- [ ] Ready to merge
```

---

### Step 5 — Ask the User What to Do Next

After presenting the copy-paste blocks, **always ask**:

> **What would you like to do next?**
>
> **A)** Open the PR now (`gh pr create` will run)
> **B)** Review preview URL first
> **C)** Run code-review first

Wait for the user's answer before taking any action.

### Step 6 — Create the PR

```bash
gh pr create \
  --base main \
  --head develop \
  --title "<confirmed-title>" \
  --body "$(cat <<'EOF'
<confirmed-body>
EOF
)"
```

---

## What happens after merge

On merge into `main`:

1. Vercel deploys to production
2. `develop` is auto-synced (fast-forward to `main`) — no manual back-merge needed

Branches always stay synchronized — no "behind" message.

---

## Title Convention

- Use imperative mood: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep under 70 characters
- Examples:
  - `feat: add product detail page`
  - `fix: await params in sobre/page.tsx`
  - `release: develop → main`

---

## Integration

**Called after:** development on `develop` is complete
**After merge:** `sync-develop.yml` fast-forwards develop + Vercel deploys production