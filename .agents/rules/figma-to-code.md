---
description: 'Rules for converting Figma designs and using Figma AI Context in this project.'
applyTo: '**/*.tsx, **/*.ts, **/*.css'
---

# Figma to Code Guidelines (Stetsom CMS)

When building UI components from the Figma designs defined in `docs/ia/figma`, follow these rules to align with the Stetsom Next.js + Tailwind v4 stack:

1. **Design Context Location**: Use `docs/ia/figma/meta.json` as the entry point when reconstructing UI based on Figma. It describes `components.json` and `design-system.json`.
2. **Tailwind v4 Variables**: The design system colors in Figma (like Stetsom Red `#E8132A` or Dark `#121212`) map directly to our CSS custom properties defined in `src/app/globals.css`.
   - Use classes like `bg-brand`, `text-brand`, `bg-brand-dark`.
   - Do not use arbitrary color values (e.g. `bg-[#E8132A]`). Look for the CSS variable mapping first.
3. **Typography**: Figma text styles should map to our fonts defined in variables: `var(--font-barlow)` for standard `font-sans` and `var(--font-barlow-condensed)` for `font-sans-condensed`. Check `src/app/globals.css` instead of creating arbitrary CSS.
4. **Icons**: Figma uses `Lucide Icons` for its components. Use the `lucide-react` package.
5. **Component Parity**:
   - Build with Server Components by default. Add `"use client"` only for interactivity.
   - Check if a shadcn equivalent exists (e.g., `Accordion`, `Button`) before building from scratch, relying on our `base-nova` style configuration.
   - When replacing raw Figma UI, map it efficiently to the corresponding Radix primitives or standard HTML semantic tags to preserve accessibility.
6. **Spacing & Layout**: Convert Figma fixed spacing constraints (e.g. padding and margins) into Tailwind utility classes ensuring responsive behavior (e.g., instead of fixed width 375px, use `w-full max-w-sm` or responsive scaling).

Refer closely to `AGENTS.md` and `docs/ia/figma/*` for exact design adherence.
