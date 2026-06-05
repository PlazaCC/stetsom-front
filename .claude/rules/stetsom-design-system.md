---
description: 'Rules and guidelines for maintaining local UI structure without constantly querying Figma.'
applyTo: '**/*.tsx, **/*.ts, **/*.css'
---

# Local Design System Guidelines (Stetsom Front)

Always read these files before starting any UI work:

- `docs/ia/figma/DESIGN_SYSTEM.md` — tokens → Tailwind class mapping (direct table)
- `docs/ia/figma/PAGES.md` — node IDs per section per page (desktop + mobile) + mapped React component
- `docs/ia/figma/COMPONENTS.md` — Figma component → React component + file path

1. **Local Oracle**: Do NOT invoke the Figma MCP unless explicitly requested by the user or for a totally new unmapped component. All layout structure, typography, and colors are documented locally.
2. **Node IDs**: To inspect a specific section via `get_figma_data`, use node IDs from `docs/ia/figma/PAGES.md` — never fetch the entire file.
3. **Component Libraries**: Combine Figma structures with shadcn/Base-UI in `src/components/ui`. Button sizes: `sm` → `h-8 px-4`; `md` → `h-10 px-6`.
4. **Asset Mapping**: Use `docs/ia/figma/assets-manifest.json` to resolve images by `styleRef` or `nodeId` and get the `relativePath` under `/figma-assets/raw`.
5. **MCP Trigger Rule**: Only trigger Figma MCP download when the asset is not in the manifest or the user explicitly requests a new extraction.
