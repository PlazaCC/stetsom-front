---
description: 'Rules and guidelines for maintaining local UI structure without constantly querying Figma.'
applyTo: '**/*.tsx, **/*.ts, **/*.css'
---

# Local Design System Guidelines (Stetsom Front)

Leia **sempre** estes arquivos ao iniciar qualquer trabalho de UI:

- `docs/ia/figma/DESIGN_SYSTEM.md` — tokens de cor, tipografia, layout, efeitos → Tailwind class (tabela direta)
- `docs/ia/figma/PAGES.md` — node IDs de cada seção por página (desktop + mobile) + componente React mapeado
- `docs/ia/figma/COMPONENTS.md` — mapa Figma component → React component + file path

1. **Local Oracle**: NÃO invoque o Figma MCP a menos que explicitamente solicitado pelo usuário ou para um componente totalmente novo não mapeado. Toda a estrutura de layouts, tipografia e cores está documentada localmente.
2. **Node IDs de Página**: Para inspecionar uma seção específica via `get_figma_data`, use os node IDs de `docs/ia/figma/PAGES.md` em vez de buscar o arquivo inteiro.
3. **Icons**: Sempre importe de `lucide-react`. Mapeamento conhecido: `arrow-right`, `chevron-down`, `search`, `menu`, `plus`, `sliders-horizontal`.
4. **Typography Tokens**: Use `font-sans` (Barlow) e `font-sans-condensed` (Barlow Condensed). Aplique `font-sans-condensed font-black uppercase` para headings de impacto, specs técnicas ("3000W RMS") e watermarks de background.
5. **Consistência de cor**: Sistema dark/red — `bg-brand-dark` e `text-brand`/`bg-brand`. Nunca invente paletas de cinza; use `bg-off-white` para seções claras alternadas.
6. **Component Libraries**: Combine estruturas Figma com shadcn/Base-UI em `src/components/ui` (ex: Accordion, Buttons). Sizes: `sm` → `h-8 px-4`; `md` → `h-10 px-6`.
7. **Asset Mapping**: Use `docs/ia/figma/assets-manifest.json` para resolver imagens por `styleRef` ou `nodeId` e obter o `relativePath` local sob `/figma-assets/raw`.
8. **MCP Trigger Rule**: Só acione Figma MCP download quando o asset não estiver no manifesto ou o usuário pedir explicitamente nova extração.
