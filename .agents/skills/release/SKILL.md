---
name: release
description: Use when develop is ready to ship — opens a release PR from develop into main with a conventional description. Vercel creates a preview automatically. Merge the PR to trigger automatic versioning, tagging, and production deployment.
---

# Release — Develop → Main PR

## Overview

Opens a pull request from `develop` into `main`. This is the **only** type of PR in the trunk-based Git Flow — there are no feature-branch PRs.

On merge, `semantic-release` auto-tags the version, generates release notes, and Vercel deploys to production.

---

## When to Use

- When `develop` has accumulated changes ready to ship
- When you want to preview what will go to production
- Before merging a release into `main`

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

<bullet points of changes since last release>

## What changed

<key features, fixes, refactors>

## Why

<rationale for this release>

## Checklist

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Build passes
- [ ] Preview URL approved
- [ ] Ready to release
```

---

### Step 5 — Ask the User What to Do Next

After presenting the copy-paste blocks, **always ask**:

> **What would you like to do next?**
>
> **A)** Open the release PR now (`gh pr create` will run)
> **B)** Review preview URL first (share the Vercel preview link for validation)
> **C)** Run code-review first (runs the `code-review` skill before the PR)

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

Once the PR is merged into `main`:

1. `.github/workflows/release.yml` runs on the push to `main`
2. `semantic-release` analyzes commits since the last tag
3. Determines version bump: `feat:` → minor, `fix:` → patch
4. Creates Git tag (e.g., `v0.2.0`)
5. Generates release notes from commit history
6. Creates GitHub Release
7. Updates `CHANGELOG.md` and `package.json`
8. Commits those changes back to `main`
9. Vercel auto-deploys `main` to production

---

## Title Convention

- Use `release: <version>` format
- The actual version is determined by semantic-release after merge
- Examples:
  - `release: develop → main`
  - `release: v0.2.0`

---

## Integration

**Called after:** development on `develop` is complete
**After merge:** `/code-review` on the release branch (optional, for final sanity check)
**Automated by:** `.github/workflows/release.yml` (tagging, changelog, GitHub Release)