---
description: 'Use when creating, refactoring, or reviewing public site React components. Covers Server vs Client decision, props typing, composition patterns, responsive variants, and the section layout skeleton.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Public Site Components — Conventions & Patterns

## Server vs Client Decision

- Start every component as a Server Component (no directive)
- Add `"use client"` only for: event handlers, state/effect hooks, browser APIs, `usePathname`/`useRouter`
- Push client-only behavior into leaf subcomponents so parent compositions stay on the server

## Props Convention

- Define props as `interface` (extensible) named `<ComponentName>Props`, placed above the component
- Use `type` for nested data shapes within the file
- Wrap destructured props in `Readonly<PropsType>` to prevent accidental mutation
- Include optional `className?: string` for styling overrides
- Use sensible defaults via destructuring: `{ prop = defaultValue }`
- Extend native HTML props via `React.ComponentPropsWithoutRef<"element">`

## Class Composition

- Always use `cn()` from `@/lib/utils` for conditional Tailwind classes
- Order: base classes → conditional variants → forwarded `className` (last argument)
- For multi-variant components, use `cva` from `class-variance-authority` at module level
- Export the `cva` object alongside the component for reuse by composite components

## Component Organization

| Location | Purpose | Rules |
|---|---|---|
| `src/components/ui/` | Global reusable primitives | Dummy/presentational only; no data hooks; used in 2+ routes |
| `src/app/[route]/_components/` | Route-co-located sections | May contain data hooks; not imported by other routes |
| `src/app/[route]/_components/blocks/` | Typed block variants | Registry pattern: `Record<BlockType, ComponentType>` + single `BlockRenderer` |

- Extract subcomponents into private functions in the same file when visual-only, no reuse, and parent stays under 150 lines
- Subcomponents with state/effects → separate file
- If used in 2+ routes → promote to `components/ui/`

## Constants

- Declare at module level in `SCREAMING_SNAKE_CASE`
- Use `as const` for readonly arrays and objects to enable narrowing
- Magic numbers, config maps, icon lookups, nav links all belong here, not inline in JSX

## Section Layout Skeleton

Every content section follows the `section > Container` wrapper:

```tsx
<section className="bg-* py-*">
  <Container>
    <SectionLabel label={...} title={...} />
    {/* unique content */}
  </Container>
</section>
```

- `<section>` carries the background/styling (fills edge-to-edge)
- `<Container>` constrains content width (max-width + responsive padding)
- Add `id` attributes with `scroll-mt-24` for in-page navigation

## Responsive Variants

- Design mobile-first — use `lg:*` breakpoints for desktop overrides
- Use `lg:hidden` / `hidden lg:*` for layouts that fundamentally differ between mobile and desktop
- Use responsive grid classes (`grid-cols-1 lg:grid-cols-2`) for layouts that scale on the same grid
- Navigation: render desktop (horizontal links) and mobile (hamburger + dropdown) in the same component with responsive visibility classes

## Server Actions

- Define in `actions.ts` co-located in the route's `_components/` directory
- The action file is the only place with `"use server"` directives
- Client Components import and call actions in event handlers, managing idle/loading/success/error states locally