---
description: 'Use when writing TypeScript types, interfaces, or any .ts/.tsx file. Covers TypeScript conventions for this project.'
applyTo: 'src/**/*.{ts,tsx}'
---

# TypeScript Conventions

- Modo strict ativado com `moduleResolution: bundler` — confie na inferência do compilador
- Prefira `type` para unions e shapes de dados; `interface` para contratos extensíveis (componente props)
- Nunca use `any` — use `unknown` quando o tipo for genuinamente desconhecido
- Tipos de props de componentes ficam no mesmo arquivo, acima do componente
- `React.ComponentPropsWithoutRef<"element">` para estender props de elementos HTML nativos
- Não crie arquivos de barril (`index.ts`) desnecessários — importe diretamente do arquivo fonte
