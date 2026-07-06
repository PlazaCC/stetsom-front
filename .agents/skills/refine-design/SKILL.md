---
name: refine-design
description: Design refinement pass using Figma MCP. Fetches live design from Figma (never local files), maps tokens, validates code against design standards, updates local context if stale, and produces an action plan via /next-task. Trigger keywords: refine design, figma alignment, design pass, design review, check design.
argument-hint: '<Figma URL or component/page name>'
---

# Refine Design — Design Pass

## Overview

Pulls **live design context directly from the Figma MCP** and translates it into implementation-ready specs aligned with the Stetsom design system. Always fetches from Figma — never reads local snapshot files as the source of truth.

**Core principle:** Design truth lives in Figma. Always read it fresh. Local files are caches — treat them as potentially stale.

---

## When to Use

- Task file has `Needs design pass: YES`
- Implementation diverged visually from the Figma reference
- A new component needs to match an existing Figma spec
- User provides a Figma URL or component name for visual alignment
- Periodic design consistency check across pages

---

## Procedure

### Step 1 — Resolve Figma Target

**If a Figma URL was provided as argument:**
- Parse `fileKey` and `nodeId` from the URL.
- Use directly in Step 2.

**If no URL was provided:**
- Use the Figma MCP (`get_figma_data`) directly — the fileKey and node IDs are in the Figma URL or can be passed by the user.

> If the `/figma` skill is available, invoke it first to understand the MCP API capabilities before calling tools directly.

### Step 2 — Fetch Live Design from Figma MCP

Use `get_design_context` (primary) and `get_screenshot` (visual reference):

```
get_design_context(fileKey, nodeId)
get_screenshot(fileKey, nodeId)
```

Retrieve:
- Component hierarchy and structure
- Colors (exact hex → map to project tokens)
- Spacing and padding values (px → convert to Tailwind canonical)
- Typography (font family, weight, size, transform)
- Screenshot for visual ground-truth

**Never substitute a local file read for an MCP call.** Local snapshots are caches.

### Step 3 — Perform Analysis

Produce a precise, general design analysis covering:

1. **Layout fidelity** — does the implementation match Figma's structure, grid, and alignment?
2. **Color accuracy** — are all colors mapped to the correct project tokens? Flag any hardcoded values.
3. **Typography** — correct font family, weight, size, and transform?
4. **Spacing / padding** — convert all Figma px values to Tailwind canonical classes.
5. **Responsive behavior** — mobile vs desktop frames differ?
6. **Component quality** — validate against `/frontend-design` and `/ui-ux-pro-max` standards (padding hierarchy, visual rhythm, interaction states, accessibility).

> Figma is visually correct but can have non-standard paddings or layout quirks. Use `/frontend-design` and `/ui-ux-pro-max` to validate and improve where needed — don't blindly copy Figma pixel-for-pixel if it violates design system standards.

Token mapping reference:

| Figma value              | Project class                       |
| ------------------------ | ----------------------------------- |
| `#E8132A` / Stetsom Red  | `text-brand` / `bg-brand`           |
| `#121212` / Stetsom Dark | `bg-brand-dark` / `text-brand-dark` |
| `#F5F4F2` / Off White    | `bg-off-white`                      |
| `#F8F8F8`                | `bg-card`                           |
| `#565656`                | `text-muted-foreground`             |
| `#B8B8B8`                | `text-text-subtle-dark`             |
| Barlow                   | `font-sans`                         |
| Barlow Condensed         | `font-sans-condensed`               |

### Step 4 — Produce Design Spec

Output a structured spec:

```
## Design Spec: <Component / Page Name>

### Layout
- <structure, grid, alignment notes>

### Colors
- Background: <token>
- Text: <token>
- Accent: <token>

### Typography
- Heading: font-sans-condensed font-black text-[Xpx] uppercase
- Body: font-sans text-base text-muted-foreground

### Spacing
- Padding: <tailwind canonical classes — never [Npx]>
- Gap: <tailwind canonical classes>

### Responsive
- Mobile (<frame node>): <behavior>
- Desktop (<frame node>): <behavior>

### Issues Found
- [ ] <design issue 1>
- [ ] <design issue 2>

### Screenshot reference
[Captured from Figma — see above]
```

### Step 5 — Validate Against Project Rules

Before handing off, confirm the spec:

- Uses Tailwind classes only — no arbitrary color values
- Uses brand tokens from `globals.css`
- No hardcoded hex values
- Spacing converted to canonical classes (N/4 formula)
- Typography uses `font-sans` / `font-sans-condensed` — never inline `fontFamily`
- Padding/gap values match Tailwind canonical (see `.claude/rules/tailwind-canonical.md`)

### Step 6 — Update Local Context Files (if stale)

After fetching live data, check whether local context is stale:

- `src/app/globals.css` — add missing CSS custom properties for any new tokens found

Only update what actually changed. Do not rewrite entire files from scratch.

### Step 7 — Present Action Plan and Ask How to Proceed

List every issue found as a numbered action plan, then **ask the user how to proceed** — do not auto-execute:

```
## Plano de Ação

1. Fix <issue 1> in <file> — <specific change>
2. Fix <issue 2> in <file> — <specific change>
...

Como você prefere prosseguir?
A) Criar tasks via /create-task para acompanhar o progresso
B) Executar agora mesmo sem criar tasks
```

- **Option A chosen** → invoke `/create-task` for each item, then `/next-task` to start item 1
- **Option B chosen** → invoke `/next-task` directly and begin executing from item 1
- **No issues found** → state that explicitly; do not ask and do not call `/next-task`

---

## Hard Constraints

- NEVER use local snapshot files as the design source — always MCP
- NEVER use arbitrary color values (`bg-[#E8132A]`) — always project tokens
- NEVER create new CSS variables without adding them to `src/app/globals.css`
- Figma px values for dimensions → Tailwind canonical (N/4 formula)
- `text-[Npx]` is allowed only for font sizes outside the named Tailwind scale
- Always call `/next-task` at the end if issues were found

---

## Support Skills

| Skill            | When to invoke                                         |
| ---------------- | ------------------------------------------------------ |
| `/figma`         | To understand Figma MCP API before calling tools       |
| `/frontend-design` | To validate component quality and production-readiness |
| `/ui-ux-pro-max` | To check design standards: spacing, accessibility, rhythm |
| `/next-task`     | To execute the action plan after analysis              |

---

## Integration

**Optional step in:** `/next-task` cycle  
**Always uses:** Figma MCP (`get_design_context`, `get_screenshot`)  
**Never uses:** Local snapshot files as source of truth  
**Ends with:** `/next-task` action plan if issues found
