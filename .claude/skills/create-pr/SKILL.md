---
name: create-pr
description: 'Use when the implementation of a feature or bugfix is complete and you need to generate a professional, conventional pull request description summarizing the changes against the main branch. Also updates the related task status to DONE in docs/ia/tasks/ and appends a changelog entry to docs/ia/context.json.'
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

Report any failures. Do not proceed if TypeScript or lint errors exist.

### Step 4 — Present PR Content for Review

Output the generated title and body as copy-paste ready blocks — **do not run `gh pr create` yet**:

---

**📋 PR Title** _(copy and paste)_

```
<conventional-title>
```

---

**📋 PR Body** _(copy and paste)_

```markdown
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
```

---

### Step 5 — Ask the User What to Do Next

After presenting the copy-paste blocks, **always ask** (do not proceed automatically):

> **What would you like to do next?**
>
> **A)** Create the PR in the online repository now (`gh pr create` will run automatically)
> **B)** Proceed to code-review first (runs the `code-review` skill before opening the PR)

Wait for the user's answer before taking any action.

- If **A** → proceed to **Step 6**.
- If **B** → invoke the `code-review` skill; after it completes and any issues are resolved, return to **Step 6**.

---

### Step 6 — Create the PR Online

Run `gh pr create` with the confirmed title and body:

```bash
gh pr create --title "<confirmed-title>" --body "$(cat <<'EOF'
<confirmed-body>
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

### Step 7 — Mark Task as DONE and Update context.json

After the PR is successfully created:

1. **Identify the task file** — look for a file in `docs/ia/tasks/` whose name matches the current branch (e.g. branch `feat/task-05-novidades-tabs` → `task-05-novidades-tabs.md`). If no exact match, infer from the branch name or the PR scope.

2. **Update the task status** — change the status line in the task file:

   ```
   **Status:** REVIEW  →  **Status:** DONE
   ```

   or from any previous status (`TODO`, `IN_PROGRESS`, `REVIEW`) to `DONE`.

3. **Append to `docs/ia/context.json`** — read the file first, then push a new entry to the end of the `"log"` array:
   ```json
   {
     "ts": "<ISO8601 UTC now>",
     "agent": "claude-sonnet-4-6",
     "type": "chore",
     "summary": "Mark <task-id> as DONE after PR #<number> was opened",
     "files": ["docs/ia/tasks/<task-file>.md"],
     "rationale": "PR created and ready for review — task delivery complete",
     "outcome": "Task status is DONE; PR #<number> is open for review at <pr-url>"
   }
   ```

> **Important:** Always read `docs/ia/context.json` before writing — never reconstruct from memory.

---

## Common Mistakes

| Mistake                                  | Fix                                                     |
| ---------------------------------------- | ------------------------------------------------------- |
| Incomplete diff                          | Include both staged and unstaged changes.               |
| Vague title                              | Use imperative mood and type prefix.                    |
| Missing breaking changes                 | Clearly highlight backward-incompatible changes.        |
| Non-English description                  | Always write the PR description in English.             |
| Creating PR with errors                  | Run validators first — fix before opening.              |
| Auto-creating PR without showing content | Always show copy-paste blocks in Step 4 first.          |
| Skipping the user prompt                 | Always ask A/B in Step 5 before running `gh pr create`. |
| Forgetting to update task                | Always run Step 7 after the PR is created.              |

---

## Integration

**Called after:** `/poc-next-task` (implementation complete)
**Called before:** `/code-review`
**If review finds fixes:** address them → run `/create-pr` again → run `/code-review`. Repeat until APPROVED.
