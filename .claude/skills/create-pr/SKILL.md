---
name: create-pr
description: Use when the implementation of a feature or bugfix is complete and you need to generate a professional, conventional pull request description summarizing the changes against the main branch.
---

# Create PR — Conventional Pull Request Generator

## Overview

Analyzes current branch changes relative to `main` and generates a structured, professional PR description in English following Conventional Commits and project best practices.

**Core principle:** Summarize the "What" and "Why" while providing a clear checklist for reviewers.

---

## When to Use

- When a development branch is finished and all tasks pass validation.
- When you are about to create a PR on GitHub.
- When asked to "summarize my changes" or "prepare a PR description".

---

## Implementation

### Step 1 — Analyze Changes

```bash
git branch --show-current
git diff --name-status main...HEAD
git diff main...HEAD
git log main...HEAD --oneline
```

Include all staged and unstaged changes in your mental model of the current state.

### Step 2 — Summarize Scope

1. List affected files and change types (added, modified, deleted).
2. Highlight key features, bug fixes, refactors, or breaking changes.
3. Note dependency updates or config changes.

### Step 3 — Run Validators

```bash
pnpm tsc --noEmit
pnpm lint
```

Report any failures. Do not create the PR if TypeScript or lint errors exist.

### Step 4 — Generate and Open PR

Use `gh pr create` with the generated description:

```bash
gh pr create --title "<conventional-title>" --body "$(cat <<'EOF'
## Summary
<bullet points>

## What changed
<what>

## Why
<why / rationale>

## Checklist
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Tested locally
- [ ] Ready for review

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Title Convention

- Use imperative mood: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`
- Keep under 70 characters
- Examples:
  - `feat: add product detail page`
  - `fix: await params in sobre/page.tsx`
  - `refactor: extract HeroCarousel to shared component`

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Incomplete diff | Include both staged and unstaged changes. |
| Vague title | Use imperative mood and type prefix. |
| Missing breaking changes | Clearly highlight backward-incompatible changes. |
| Non-English description | Always write the PR description in English. |
| Creating PR with errors | Run validators first — fix before opening. |

---

## Integration

**Called after:** `/poc-next-task` (implementation complete)
**Called before:** `/code-review`
**If review finds fixes:** address them → run `/create-pr` again → run `/code-review`. Repeat until APPROVED.
