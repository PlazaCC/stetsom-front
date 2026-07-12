---
name: create-task
description: Use after brainstorm is complete — turns the refined idea into a tracked task with a git branch, acceptance criteria, and implementation plan. Trigger keywords: create task, add task, track task, new task.
argument-hint: '<feature name or description>'
---

# Create Task — Task Tracker

## Overview

Turns a refined idea (from `/brainstorm`) into a concrete, tracked task ready for execution.

**Output:** a task entry + a git branch ready for implementation.

---

## When to Use

- After `/brainstorm` produces a scoped feature definition
- When a clear task needs to enter the delivery backlog

---

## Procedure

### Step 1 — Confirm Input

Require the brainstorm output (or infer from conversation):

- Feature name
- Objective
- Acceptance criteria (3–5 items)
- In-scope / out-of-scope boundaries
- Needs design pass? (YES/NO)

### Step 2 — Generate Task ID

Format: `TASK-<YYYYMMDD>-<slug>`
Example: `TASK-20260512-product-detail-page`

### Step 3 — Create Task File

Write a task file (e.g. `<task-id>.md`):

```markdown
# <Task ID>: <Feature Name>

**Status:** TODO
**Branch:** feat/<slug>
**Created:** <date>
**Needs design pass:** YES / NO

## Objective

<one sentence>

## Acceptance Criteria

- [ ] <criterion 1>
- [ ] <criterion 2>
- [ ] <criterion 3>

## In Scope

- <item>

## Out of Scope

- <item>

## Implementation Notes

<hints from brainstorm>
```

### Step 4 — Create Git Branch

```bash
git checkout -b feat/<slug>
```

Confirm branch was created successfully.

### Step 5 — Announce

Report:

- Task ID and file path
- Branch name
- Next step: run `/next-task` to begin execution

---

## Task States

| State         | Meaning                       |
| ------------- | ----------------------------- |
| `TODO`        | Created, not started          |
| `IN_PROGRESS` | Active implementation         |
| `REVIEW`      | PR open, awaiting code review |
| `DONE`        | Merged to main                |

---

## Integration

**Called after:** `/brainstorm`
**Called before:** `/next-task`
