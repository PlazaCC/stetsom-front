---
name: release
description: Opens a release pull request from develop into main after local validation. CI and Vercel validate the pull request before production.
---

# Release: Develop to Main

## Purpose

Open a pull request from `develop` into `main`. Merging it deploys production and fast-forwards `develop` to `main`.

Use this skill when `develop` is ready for production or when a release preview is needed.

## Procedure

### 1. Confirm Develop

```bash
git branch --show-current
```

If needed:

```bash
git switch develop
git pull origin develop
```

### 2. Review the Release Candidate

Compare against the remote production branch:

```bash
git fetch origin main
git diff --name-status origin/main...HEAD
git log origin/main...HEAD --oneline
```

### 3. Run Local Validation

```bash
pnpm tsc --noEmit
pnpm lint
pnpm build
```

Stop if any command fails.

### 4. Prepare the Pull Request

Present a conventional title and this body. Do not create the PR yet.

```markdown
## Summary

- <change>

## Validation

- [ ] `pnpm tsc --noEmit`
- [ ] `pnpm lint`
- [ ] `pnpm build`
- [ ] Vercel preview reviewed
- [ ] Manually tested
```

Ask whether to open the PR, review the preview first, or run code review first. Wait for the answer.

### 5. Create the Pull Request

```bash
gh pr create \
  --base main \
  --head develop \
  --title "<confirmed-title>" \
  --body "<confirmed-body>"
```

## After Merge

1. Vercel deploys `main` to production.
2. `sync-develop.yml` fast-forwards `develop` to `main`.

The `main` ruleset must require the pull request, `build-and-lint`, and the Vercel deployment before merge.

## Title Format

Use a conventional commit prefix and keep the title under 70 characters.

```text
feat: add product detail page
fix: await params in sobre page
release: develop to main
```
