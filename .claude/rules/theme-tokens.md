---
description: 'Use when styling UI, choosing colors, or updating theme tokens. Covers shadcn/ui theme variables and avoiding hardcoded color values.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Theme Tokens

- Use sempre os tokens de tema definidos em `src/app/globals.css` e nas variaveis do shadcn/base-nova antes de criar qualquer cor nova.
- Prefira classes semanticas como `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground` e os tokens de marca do projeto ja mapeados no tema.
- Nunca use valores arbitrarios de cor como `text-[#000000]`, `bg-[rgb(...)]`, `border-[#ddd]` ou estilos inline para cor quando um token puder expressar a mesma intencao.
- Se faltar uma cor, adicione ou mapeie no tema primeiro em vez de espalhar valores hardcoded pelos componentes.
- Mantenha hover, focus, active, disabled e dark mode tambem guiados por tokens para a interface continuar consistente.
