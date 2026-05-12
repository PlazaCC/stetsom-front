---
name: refine-design
description: Optional design refinement step — use when a task needs visual alignment with Figma before or during implementation. Fetches design context, resolves design tokens, and produces implementation-ready specs. Trigger keywords: refine design, figma alignment, design pass, design review.
argument-hint: '<Figma URL or component name>'
---

# Refine Design — Design Pass

## Overview

Pulls design context from Figma and translates it into implementation-ready specifications aligned with the Stetsom design system. Optional step — only use when a task needs visual alignment.

**Core principle:** Design informs implementation. Don't hallucinate design — read it from Figma.

---

## When to Use

- Task file has `Needs design pass: YES`
- Implementation diverged visually from Figma reference
- A new component needs to match an existing Figma spec
- User provides a Figma URL and asks to match the design

---

## Procedure

### Step 1 — Get Figma URL

Ask for or extract from conversation:

- Figma file URL (figma.com/design/...)
- Node ID or component name

If no URL provided: check `docs/ia/figma/meta.json` for the project's Figma entry points.

### Step 2 — Fetch Design Context

Use the Figma MCP (`get_design_context`) to retrieve:

- Component structure
- Colors, spacing, typography
- Screenshot for visual reference

Map Figma tokens to project tokens before writing any code:

| Figma value              | Project class                       |
| ------------------------ | ----------------------------------- |
| `#E8132A` / Stetsom Red  | `text-brand` / `bg-brand`           |
| `#121212` / Stetsom Dark | `bg-brand-dark` / `text-brand-dark` |
| `#F5F4F2` / Off White    | `bg-off-white`                      |
| Barlow font              | `font-sans`                         |
| Barlow Condensed         | `font-sans-condensed`               |

### Step 3 — Produce Design Spec

Output a structured implementation guide:

```
## Design Spec: <Component Name>

### Layout
- <structure notes>

### Colors
- Background: <token>
- Text: <token>

### Typography
- Heading: font-sans-condensed font-black text-[Xpx] uppercase
- Body: font-sans text-base

### Spacing
- Padding: <tailwind classes>
- Gap: <tailwind classes>

### Responsive
- Mobile: <behavior>
- Desktop: <behavior>

### Screenshot reference
[Captured from Figma — see above]
```

### Step 4 — Validate Against Rules

Confirm the spec uses:

- Tailwind classes only (no arbitrary CSS values for colors)
- Brand tokens from `globals.css`
- No hardcoded hex values

### Step 5 — Hand Off to Implementation

Return to `/next-task` with the design spec attached. Implementation proceeds with the spec as the visual target.

---

## Important Constraints

- Do NOT use arbitrary color values (`bg-[#E8132A]`) — always map to brand tokens
- Do NOT create new CSS variables — only use what's in `src/app/globals.css`
- Figma absolute pixel values → convert to responsive Tailwind classes
- Refer to `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md` for the full token map

---

## Integration

**Optional step in:** `/next-task` cycle
**Uses:** Figma MCP (`get_design_context`, `get_screenshot`)
**References:** `docs/ia/figma/meta.json`, `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md`
