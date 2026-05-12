---
description: 'Use when creating pages, layouts, or route segments. Covers Next.js 16 App Router conventions.'
applyTo: 'src/app/**/*.{ts,tsx}'
---

# Next.js App Router

- `params` e `searchParams` são `Promise` — sempre `await` em pages/layouts
- Use `PageProps<Route>` e `LayoutProps<Route>` de `types/routes.d.ts` para tipagem de props
- Não edite `types/routes.d.ts`, `types/cache-life.d.ts` ou `types/validator.ts` — são gerados pelo Next.js
- Route groups com `(name)` não afetam a URL; use para organizar sem segmento extra
- Co-locate seções de página em `_components/` dentro da rota; componentes compartilhados vão em `src/components/ui/`
- Leia `node_modules/next/dist/docs/` antes de escrever código para esta versão — APIs podem diferir do treinamento
