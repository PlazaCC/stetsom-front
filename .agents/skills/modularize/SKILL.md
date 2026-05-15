---
name: modularize
description: 'Refactor large or redundant code into modular, reusable components following Stetsom stack conventions (Next.js App Router, React 19, Tailwind v4, shadcn/ui). Use when files are too large, logic is duplicated, or components lack proper separation of concerns. Triggers: modularize, componentize, refactor, split component, extract component, reduce redundancy, cleanup code.'
argument-hint: '[file or component to modularize — defaults to recently modified code]'
---

# Modularize

Extends `/simplify` with a focus on **structural decomposition**: breaking large files into focused modules, extracting reusable components, and eliminating duplication — all while respecting the Stetsom stack conventions.

## When to Use

- A file exceeds ~150 lines and contains multiple distinct responsibilities
- Logic or JSX is copy-pasted across two or more components
- A single component handles both data-fetching and presentation
- UI sections inside `_components/` are large enough to warrant sub-components
- A `"use client"` boundary wraps code that could be split into smaller server + client parts

## Procedure

### 1. Audit the Target

Read the file(s) the user specifies (or the recently modified files if none given).

Identify:
- **Responsibility clusters** — groups of logic or JSX that belong together conceptually
- **Duplicated patterns** — repeated JSX structure, identical utility calls, shared constants
- **Boundary violations** — client-only code in server components or vice versa
- **Oversized components** — components mixing layout, data logic, and micro-UI in one block

### 2. Plan the Split

Before touching any file, produce a concise decomposition plan:

```
Current: ComponentX.tsx (220 lines, 3 responsibilities)
→ ComponentX.tsx        — orchestration only (~40 lines)
→ ComponentXCard.tsx    — card sub-component (~60 lines)
→ ComponentXHeader.tsx  — header sub-component (~50 lines)
→ useComponentXData.ts  — data hook or util (~30 lines)
```

Ask the user to confirm the plan before writing code **only when** the split is ambiguous or involves moving files across feature boundaries.

### 3. Apply Stetsom-Specific Rules

**Component placement:**
- Page-scoped sections → `src/app/(site)/<route>/_components/`
- Shared UI primitives → `src/components/ui/`
- Do not create `index.ts` barrel files — import directly from the source file

**Server vs Client boundary:**
- Default to Server Components; add `"use client"` only for: event handlers, `useState`/`useEffect`, `usePathname`, browser APIs
- When a large client component has static structure, extract the static shell as a Server Component and keep only the interactive part as `"use client"`

**Naming conventions:**
- Named exports for all components except `page.tsx` / `layout.tsx`
- Sub-components in the same file are acceptable when they are small (<30 lines) and not reused elsewhere
- Move sub-components to their own file when they grow beyond that or are used in 2+ places

**Eliminating duplication:**
- Extract shared static data to a `SCREAMING_SNAKE_CASE` constant at the top of the file or a colocated `data.ts`
- Extract shared JSX patterns into a small named component rather than repeating the markup
- Extract shared Tailwind class combos into a `cn()` variable or a typed variant map — never duplicate long class strings

**Tailwind / styling:**
- Do not introduce new arbitrary values while refactoring — only use existing tokens
- If extracting a component reveals a repeated color/size pattern, promote it to `globals.css` instead of duplicating the hardcode

**TypeScript:**
- Each extracted component gets its own `interface` / `type` for props, defined above the component
- Do not use `any` — use `unknown` or proper inference

### 4. Execute

- Edit the minimum number of files necessary
- Preserve all existing behavior and props contracts
- Keep imports sorted: external packages → internal `@/` aliases
- After each extracted file, verify no TypeScript errors via `pnpm build` or IDE diagnostics (if available)

### 5. Update context.json

Append one entry to `docs/ia/context.json` covering the full refactor batch:

```json
{
  "ts": "<ISO8601 UTC>",
  "agent": "claude-sonnet-4-6",
  "type": "refactor",
  "summary": "Modularize <ComponentName> into <N> focused files",
  "files": ["<relative paths of created/modified files>"],
  "rationale": "File exceeded single-responsibility threshold; extracted reusable sub-components",
  "outcome": "Reduced main file from ~Xlines to ~Ylines; extracted Z reusable components"
}
```

### 6. Report

Summarize what was split, why, and what the caller should verify:

```
Modularized: src/app/(site)/produtos/_components/ProductGrid.tsx
  → ProductGrid.tsx      (orchestration, 42 lines)
  → ProductCard.tsx      (moved to src/components/ui/, reusable)
  → useProductFilter.ts  (client hook extracted)

Verify: ProductGrid still renders correctly at /produtos; no prop type errors.
```

## Guardrails

- **Never** break functionality to achieve smaller files — correctness > modularity
- **Never** create abstractions for code that appears in only one place unless the component is already >100 lines
- **Never** add barrel `index.ts` files — they are explicitly forbidden by project conventions
- **Never** change Tailwind tokens or add new colors as part of a modularization pass
- **Stop and ask** if the refactor requires moving a file to a different route group or changing a public API shape

## References

- [React Component Conventions](./.claude/rules/react-components.md)
- [Path Alias](./.claude/rules/path-alias.md)
- [Tailwind v4 Tokens](./.claude/rules/tailwind-v4.md)
- [TypeScript Conventions](./.claude/rules/typescript.md)
- [LLM Context Changelog](./.claude/rules/llm-owned-context-json.md)
