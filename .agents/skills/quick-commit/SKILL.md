---
name: quick-commit
description: 'Generate a copy-paste ready git commit message from staged changes (or unstaged changes if nothing is staged). Read-only — never stages, never commits. Triggers: commit, make commit, quick commit, git commit, create commit, commit message, generar commit.'
---

# Quick Commit — Conventional Commit Generator

## When to Use

- You want a commit message to copy and paste
- Asked to "generate commit message", "criar commit", "make a commit"
- You want a standardized message following project conventions

## Important

This skill is **read-only**. It only inspects the working tree and generates a text block — it never stages files and never commits.

## Procedure

### Step 1 — Analyze the Current State

```bash
git status --short
git diff --cached --stat
git diff --cached
git log --oneline -5
```

If `git diff --cached --stat` returns nothing (no staged changes), also run:

```bash
git diff --stat
git diff
```

If no changes at all → abort with a message.

### Step 2 — Draft the Commit Message

Analyze the diff and recent commits to understand project style. Generate a message following this format:

```
<type>: <imperative summary>

<optional body with motivation/context>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`

**Rules:**
- Summary under 70 characters, imperative mood
- Body explains *why* (not what) — bullet points if needed
- Written in English (consistent with project convention)
- Reference issue/task numbers if present in branch name (`feat/task-05-...` → references task-05)

### Step 3 — Output the Message

Output only the commit message as a ready-to-copy block:

```markdown
<type>: <summary>

<body>
```

Do not ask for confirmation, do not offer options, do not stage, do not commit.

## Common Mistakes

| Mistake | Fix |
| ------- | --- |
| Long summary line | Keep under 70 chars |
| Vague message | Be specific about what the change accomplishes |
| Portuguese in message | Write in English to match project convention |
