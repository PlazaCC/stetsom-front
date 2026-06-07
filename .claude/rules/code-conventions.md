---
description: 'Use when writing TypeScript, importing modules, or setting up any .ts/.tsx file. Covers strict mode, path alias, type vs interface, and import rules.'
applyTo: 'src/**/*.{ts,tsx}'
---

# Code Conventions

## TypeScript

- Strict mode + `moduleResolution: bundler` — trust type inference; don't fight the compiler
- `type` for unions and data shapes; `interface` for extensible contracts (component props)
- Never `any` → use `unknown` for genuinely unknown types
- Props types in the same file, above the component
- `React.ComponentPropsWithoutRef<"element">` to extend native HTML element props
- No unnecessary barrel `index.ts` files — import directly from the source file

## Path Alias

- `@/*` maps to `src/` — never write `@/src/...` (resolves to `src/src/...` and fails)
- Correct: `@/lib/utils`, `@/components/ui/button`, `@/api/stetsom/model`
- Relative imports (`../`) only within the same feature or route
