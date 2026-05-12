---
description: 'Rules and guidelines for maintaining local UI structure without constantly querying Figma.'
applyTo: '**/*.tsx, **/*.ts, **/*.css'
---

# Local Design System Guidelines (Stetsom Front)

You should read `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md` whenever you start building UI for this project.

1. **Local Oracle**: Do NOT fallback to invoking Figma MCP tools unless specifically requested by the user or when introducing a completely new, unmapped component. The core layouts, typographies, and color systems are documented abstractly in `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md`.
2. **Icons**: Always import from `lucide-react`. Known icons mapping includes `arrow-right`, `chevron-down`, `search`, etc.
3. **Typography Tokens**: Always defer to `font-sans` (`var(--font-barlow)`) and `font-sans-condensed` (`var(--font-barlow-condensed)`). Apply `font-sans-condensed` specifically for technical spec numbers (like "3000W RMS") and big impact headings.
4. **Consistency check**: Stetsom uses a dark/red themed system (`bg-brand-dark` and `text-brand` / `bg-brand`). Do not invent standard gray palettes if `off-white` is the indicated contrast color.
5. **Component Libraries**: Try matching Figma structures with Shadcn/Base-UI (e.g. Accordion, Buttons) available in `src/components/ui`. Replicate variants from the Figma abstractions correctly (e.g., Size=sm -> `h-8 px-3 text-xs`).
