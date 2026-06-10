# AI Driven Workflow

## Purpose

This document defines the current AI driven workflow used in this project.
The workflow is skill first.
Each stage is driven by a specific skill.

## Standard Cycle

The delivery cycle follows the same sequence.

1. `/brainstorm` refines the idea — clarify objective, scope, and approach.
2. Implement the feature or fix on a dedicated branch.
3. Run `/refine-design` if the work needs visual alignment with Figma.
4. Run `/create-pr` to open the pull request.
5. Run `/code-review` to review the PR branch.
   - If there are fixes needed, address them and run both steps again.
   - Repeat until the review passes.

## Skill Roles

`/brainstorm` defines and sharpens the idea before implementation starts.

`/refine-design` improves the current work when design alignment with Figma is needed.

`/create-pr` opens the pull request from the current branch.

`/code-review` reviews the PR branch and signals whether it is ready or needs fixes. Cycles with `/create-pr` until the review passes.

## Operating Rule

Follow the next skill that matches the current state of the work.

If the idea is unclear, start with `/brainstorm`.

If the implementation needs design alignment, use `/refine-design`.

If the implementation is complete, open the pull request with `/create-pr`.

If the review finds issues, fix them and run `/create-pr` + `/code-review` again.
