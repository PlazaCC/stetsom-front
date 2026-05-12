---
description: 'Use when writing layout, sizing, or spacing utilities. Enforces canonical Tailwind classes instead of arbitrary pixel values.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Tailwind Canonical Classes

Tailwind v4 usa `calc(var(--spacing) * N)` para utilidades dimensionais, onde N pode ser **qualquer número decimal**. Isso significa que **todo** valor px de dimensão (h, w, p, m, gap, leading, max-*, min-*, etc.) tem equivalente canônico — `[Npx]` nunca deve aparecer para essas propriedades.

## Fórmula

`N px` → `N/4` unidades Tailwind  (1 unit = 0.25rem = 4px)

```
h-[3px]     → h-0.75      leading-[32px]  → leading-8
h-[45px]    → h-11.25     leading-[45px]  → leading-11.25
h-[130px]   → h-32.5      leading-[64px]  → leading-16
h-[200px]   → h-50        w-[62.5px]      → w-62.5  (decimal nativo)
h-[280px]   → h-70        w-[250px]       → w-62.5
h-[300px]   → h-75        w-[96px]        → w-24
h-[357px]   → h-89.25     max-w-[320px]   → max-w-80
h-[400px]   → h-100       max-w-[360px]   → max-w-90
pt-[103px]  → pt-25.75    max-w-[400px]   → max-w-100
px-[170px]  → px-42.5     max-w-[480px]   → max-w-120
w-[250px]   → w-62.5      max-w-[700px]   → max-w-175
w-[400px]   → w-100       max-w-[1440px]  → max-w-360
```

## Exceções reais (manter como arbitrário)

- `rounded-[Npx]` — este projeto sobrescreve `--radius`; `rounded-lg` ≠ 8px aqui
- `tracking-[Npx]` — letter-spacing usa escala em `em`, não px; sem canônico direto
- `text-[Npx]` para tamanhos **fora** da escala nomeada do Tailwind: `text-[15px]`, `text-[28px]`, `text-[32px]`, `text-[90px]`, `text-[100px]`, `text-[150px]` — font-size não usa a escala de espaçamento
- `shadow-[...]` — sombras compostas não têm canônico
- Opacidade inline: `text-white/[0.04]`
