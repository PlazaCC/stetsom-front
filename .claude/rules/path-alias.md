---
description: 'Use when importing modules in TypeScript or TSX files. Covers the @/* path alias convention.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Path Alias

- `@/*` mapeia para `src/` — nunca escreva `@/src/...` (resolve para `src/src/...` e falha)
- Exemplos corretos: `@/lib/utils`, `@/components/ui/button`, `@/app/globals.css`
- Imports relativos (`../`) são aceitáveis apenas dentro da mesma feature/rota
