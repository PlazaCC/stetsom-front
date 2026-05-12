---
description: 'Use when creating or editing React components. Covers Server vs Client component decisions and naming conventions.'
applyTo: 'src/**/*.{ts,tsx}'
---

# React Component Conventions

- Server Component por padrão — adicione `"use client"` somente para: event handlers, hooks de estado/efeito, APIs do browser, `usePathname`
- Exportações nomeadas para todos os componentes exceto `page.tsx` e `layout.tsx` (que usam default)
- Use `cn()` de `@/lib/utils` para merge condicional de classes Tailwind
- Constantes de dados estáticos ficam no topo do arquivo em `SCREAMING_SNAKE_CASE`
- Subcomponentes auxiliares (ex: `ListItem`, `MenuLink`) ficam no mesmo arquivo, abaixo do export principal
- Não use prop drilling excessivo — prefira composição de componentes
