---
description: 'Rules for converting Figma designs and using Figma AI Context in this project.'
applyTo: '**/*.tsx, **/*.ts, **/*.css'
---

# Figma to Code Guidelines (Stetsom CMS)

When building UI components from the Figma designs defined in `docs/ia/figma`, follow these rules to align with the Stetsom Next.js + Tailwind v4 stack:

1. **Design Context Location**: Use `docs/ia/figma/meta.json` as the entry point. Pages → node IDs in `PAGES.md`. Components → `COMPONENTS.md`. Tokens → `DESIGN_SYSTEM.md`.
2. **Offline Assets First**: Prefer `docs/ia/figma/assets-manifest.json` and local files in `public/figma-assets/raw` before any new MCP download.
   - Resolve images by `styleRef` or `nodeId` in the manifest.
   - Use `relativePath` from the manifest as frontend URL.
3. **Tailwind v4 Variables**: Every Figma color maps directly to a CSS custom property — see `DESIGN_SYSTEM.md` color table.
   - Use classes like `bg-brand`, `text-brand`, `bg-brand-dark`, `bg-bar-accent`, `bg-footer`.
   - Do not use arbitrary color values (e.g. `bg-[#E8132A]`). Look for the CSS variable mapping first.
4. **Typography**: Figma text styles → `font-sans` (Barlow) or `font-sans-condensed` (Barlow Condensed). See full mapping table in `DESIGN_SYSTEM.md`.
5. **Icons**: Figma uses `Lucide Icons`. Use the `lucide-react` package.
6. **Component Parity**:
   - Build with Server Components by default. Add `"use client"` only for interactivity.
   - Check `COMPONENTS.md` for existing React component before building from scratch.
   - Map Figma components to shadcn/Base-UI equivalents (Accordion, Button) when available.
7. **Spacing & Layout**: Convert Figma fixed spacing into canonical Tailwind utilities — see `tailwind-canonical.md`. Container is `max-w-360 px-5 lg:px-42.5`.
