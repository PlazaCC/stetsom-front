# AI-Driven Workflow

This project follows a skill-first delivery cycle. Each stage is driven by a specific skill.

---

## Delivery Cycle

| Step | Action |
|---|---|
| 1 | Run `/brainstorm` to clarify the objective, scope, and approach before writing any code |
| 2 | Implement the feature or fix on a dedicated branch |
| 3 | Run `/refine-design` if the work needs visual alignment with Figma |
| 4 | Run `/create-pr` to open the pull request |
| 5 | Run `/code-review` to review the branch. Fix any issues, then repeat steps 4–5 until the review passes |

---

## Skills

| Skill | Trigger | Role |
|---|---|---|
| Brainstorm | `/brainstorm` | Refines the idea and produces a scoped plan before implementation |
| Refine Design | `/refine-design` | Aligns the current work with the Figma design |
| Create PR | `/create-pr` | Opens the pull request from the current branch |
| Code Review | `/code-review` | Reviews the branch diff and signals whether it is ready or needs fixes |
| Screen Audit | `/screen-audit` | Audits screens or flows against Figma and produces an action plan before code |
| Graphify | `/graphify` | Regenerates the codebase knowledge graph in `graphify-out/` |

---

## Operating Rule

Always follow the skill that matches the current state of the work. If the idea is unclear, start with `/brainstorm`. If the implementation is complete, open the pull request with `/create-pr`. If the review finds issues, fix them and run `/create-pr` and `/code-review` again.
