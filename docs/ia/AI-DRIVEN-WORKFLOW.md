# AI Driven Workflow

## Purpose

This document defines the current AI driven workflow used in this project.
The workflow is skill first.
Each stage is driven by a specific skill.

## Two Starting Cases

There are only two valid starting cases.

### Case 1

There are tasks in the pipe.

Start with `/next-task` (or use `/deliver` for fully automated end-to-end delivery).
This skill picks the next available task and moves execution forward.

### Case 2

There are no tasks in the pipe.

Start with `/brainstorm`.
Use it to refine the idea, clarify the objective, and define the scope.

After the idea is clear, use `/create-task`.
This creates the new task that will enter the pipe.

Once the new task exists, return to `/next-task` (or `/deliver`).

## Standard Cycle

The delivery cycle follows the same sequence.

1. `/brainstorm` refines the idea when a new task must be created or when the current direction is still unclear.
2. `/create-task` creates the task after the idea is ready.
3. `/next-task` executes the next available task.
4. `/create-pr` creates the pull request from the current branch.
5. `/code-review` reviews the PR branch.
   - If there are fixes needed, address them and run both steps again.
   - Repeat until the review passes.

> **Shortcut:** Use `/deliver` to run steps 3–5 automatically in one command.

## Optional Design Step

Use `/refine-design` when the current task needs a design refinement pass with Figma.
This step is optional.
It should be used only when the task needs visual alignment, design correction, or a clearer implementation target.

## Practical Flows

### Flow A

Tasks already exist.

1. Run `/next-task` (or `/deliver` for automated end-to-end).
2. Implement the selected task.
3. Run `/refine-design` if the task needs Figma refinement.
4. Run `/create-pr`.
5. Run `/code-review`.
   - If the review passes, the work is done.
   - If there are fixes, address them and go back to step 4.

### Flow B

No tasks exist.

1. Run `/brainstorm`.
2. Run `/create-task`.
3. Run `/next-task` (or `/deliver` for automated end-to-end).
4. Run `/refine-design` if the task needs Figma refinement.
5. Run `/create-pr`.
6. Run `/code-review`.
   - If the review passes, the work is done.
   - If there are fixes, address them and go back to step 5.

## Skill Roles

`/brainstorm` defines and sharpens the idea.

`/create-task` turns the refined idea into a tracked task with a file in `docs/ia/tasks/`.

`/next-task` is the execution entry point for delivery work.

`/refine-design` improves the current task when design work needs another pass with Figma.

`/create-pr` opens the pull request from the current branch.

`/code-review` reviews the PR branch and signals whether it is ready or needs fixes. Cycles with `/create-pr` until the review passes.

`/deliver` is the full-cycle orchestrator — chains `/next-task` → `/create-pr` → `/code-review` automatically, with up to 3 fix loops before escalating to the user.

## Task Files

Tasks are stored as markdown files in `docs/ia/tasks/`.
Format: `TASK-<YYYYMMDD>-<slug>.md`

Task states: `TODO` → `IN_PROGRESS` → `REVIEW` → `DONE`

## Operating Rule

Do not improvise a parallel flow.
Follow the next skill that matches the current state of the work.

If there is no task, create one through idea refinement.

If there is a task, execute it.

If the implementation needs design alignment, refine the design.

If the implementation is complete, open the pull request.

If the review finds issues, fix them and open a new pull request. Repeat until the review passes.
