---
name: add-project-skill
description: 'Create a new project-specific agent skill and install it in both .agents/skills/ (VS Code Copilot) and .claude/skills/ (Claude Code CLI), following the skills.sh dual-install pattern. Use when adding custom rules, domain knowledge, or reusable workflows for all agents in the project. Triggers: "create skill", "add skill", "new skill for all agents", "project-specific rules", "add agent rules".'
argument-hint: 'Skill name and purpose, e.g. "api-conventions — rules for the Fastify API layer"'
---

# Add Project Skill

Creates a project-specific `SKILL.md` installed to **both** agent runtimes in use:

| Path                             | Runtime         |
| -------------------------------- | --------------- |
| `.agents/skills/<name>/SKILL.md` | VS Code Copilot |
| `.claude/skills/<name>/SKILL.md` | Claude Code CLI |

This mirrors the `skills.sh` / `npx skills` dual-install pattern — the same skill file works across all agents with no extra configuration.

## When to Use

- Capturing codebase conventions or domain knowledge as a reusable workflow
- Adding project-specific rules that every agent (VS Code + Claude) should follow
- Packaging a multi-step procedure (e.g. "how to add a new API route") as an on-demand skill
- After a long conversation reveals a repeatable pattern worth preserving

## Procedure

### 1. Determine Skill Identity

Collect from the user or infer from context:

- **Name** — lowercase, hyphenated, 1–64 chars (e.g. `api-conventions`, `db-migrations`, `add-route`)
- **Purpose** — one sentence: what task does it accomplish?
- **Triggers** — keywords a future agent would use to discover it (embed in `description`)

### 2. Draft the SKILL.md

Use this template:

```markdown
---
name: <skill-name>
description: '<What it does. When to use. Trigger keywords. Max 1024 chars.>'
argument-hint: '<Optional hint for /skill-name invocations>'
---

# <Skill Title>

## When to Use

- <trigger 1>
- <trigger 2>

## Procedure

1. <step>
2. <step>

## References

- [<title>](./<path>)
```

**YAML frontmatter rules (silent failures if violated):**

- `name` must match the parent folder name exactly
- Quote values that contain `:` or `#`
- Use spaces, never tabs
- Keep `description` keyword-rich — it is the sole discovery surface

### 3. Install to Both Platforms

Create the file in both locations with **identical content**:

```
.agents/skills/<name>/SKILL.md   ← VS Code Copilot
.claude/skills/<name>/SKILL.md   ← Claude Code CLI
```

> Do **not** add local skills to `skills-lock.json`. That file tracks externally sourced skills
> fetched from GitHub via `npx skills`. Local skills are managed directly.

### 4. Validate

- [ ] `name` in frontmatter matches folder name exactly
- [ ] `description` contains trigger keywords relevant to the skill's domain
- [ ] Both paths exist: `.agents/skills/<name>/SKILL.md` and `.claude/skills/<name>/SKILL.md`
- [ ] YAML uses spaces (not tabs); values with `:` are quoted

### 5. Register in Copilot Instructions (optional but recommended)

If the skill is frequently used, add a row to the skills table in `.github/copilot-instructions.md`:

```markdown
| `<name>` | <When to use — one line> |
```

This ensures VS Code Copilot loads the skill proactively without waiting for description-match discovery.

## Example

**Goal**: Add a skill for Fastify API route conventions.

```
Skill name : api-conventions
Folder     : .agents/skills/api-conventions/
             .claude/skills/api-conventions/
Description: 'Fastify API conventions for the Stetsom backend. Use when writing
              route handlers, validating schemas with Zod, or structuring Prisma queries.'
```

After creation, invoke it with:

```
/api-conventions add POST /products route
```

## Notes on `skills.sh` / `npx skills`

`npx skills` downloads skills from GitHub into both `.agents/skills/` and `.claude/skills/` and writes a hash to `skills-lock.json`. This skill replicates that **dual-install** pattern for locally authored skills — no external source required.
