---
name: brainstorm
description: Use when starting a new feature or when the direction is unclear — refines the idea, clarifies the objective, defines scope, and produces acceptance criteria ready for task creation. Trigger keywords: brainstorm, refine idea, clarify feature, define scope, plan feature.
---

# Brainstorm — Idea Refinement

## Overview

Transforms a vague idea or requirement into a well-scoped, implementable task definition. Output feeds directly into `/create-poc-task`.

**Core principle:** No implementation yet. Only clarification.

---

## When to Use

- A new idea or feature request arrives with no clear scope
- The current direction is unclear or the task definition is ambiguous
- Before creating any task in the backlog

---

## Procedure

### Step 1 — Understand the Idea

Ask (or infer from context):
- What is the user trying to accomplish?
- Who is the target user of this feature?
- What is the expected outcome visible in the UI or behavior?

### Step 2 — Clarify Constraints

Identify and state:
- **In scope:** what will be built
- **Out of scope:** what will NOT be built in this task
- **Dependencies:** any existing components, API endpoints, or data that will be used

For this project, consider:
- Is this a new page/route in `src/app/(site)/`?
- Is this a new shared component in `src/components/ui/`?
- Does it need data from the Stetsom CMS API?
- Does it need a Figma design reference? (If yes, flag for `/poc-refine-design`)

### Step 3 — Define Acceptance Criteria

Write 3–5 concrete, verifiable statements:
```
- [ ] <observable behavior 1>
- [ ] <observable behavior 2>
- [ ] <observable behavior 3>
```

### Step 4 — Produce Output

Output a structured summary:

```
## Feature: <name>

**Objective:** <one sentence>

**In scope:**
- <item>

**Out of scope:**
- <item>

**Acceptance criteria:**
- [ ] <criterion>

**Implementation hints:**
- <technical note or approach>

**Needs design pass?** YES / NO
```

---

## Output Feeds Into

Run `/create-poc-task` immediately after brainstorm is complete and the scope is agreed upon.

---

## Anti-Patterns

- Do not start writing code during brainstorm
- Do not over-specify implementation details — leave room for judgment during execution
- Do not create tasks for things that are already in the backlog
