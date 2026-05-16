# task-11: 404 — Criar Página not-found.tsx

**Status:** REVIEW
**Priority:** 6 — Suporte + 404; depende de task-01
**Branch:** feat/task-11-404-not-found-page
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Criar a página `not-found.tsx` fiel ao Figma (node `1200:7086` desktop / `1200:7151` mobile) para ser exibida em qualquer rota inexistente.

## Acceptance Criteria

- [x] `src/app/not-found.tsx` existe e é renderizada ao acessar qualquer rota inválida
- [x] Fundo da seção de conteúdo é `bg-off-white`
- [x] Texto "404" grande está visível com `opacity-[0.08]` como elemento de fundo decorativo
- [x] Título "PÁGINA NÃO ENCONTRADA" usa `font-sans-condensed font-black uppercase text-[50px] text-footer` (`#111111`)
- [x] Subtítulo usa `font-sans text-xl font-medium text-text-subtle-dark` (`#B8B8B8`)
- [x] Botão "Voltar para a Home" navega para `/`
- [x] Header e Footer são incluídos na página

## In Scope

- `src/app/not-found.tsx` — criação do arquivo
- Layout responsivo desktop (`1200:7086`) + mobile (`1200:7151`)

## Out of Scope

- Animações de entrada
- Links de sugestão de páginas alternativas

## Implementation Notes

- Next.js App Router: `not-found.tsx` em `src/app/` é capturado automaticamente pelo framework
- Para incluir Header e Footer, importar diretamente (não herda layout do `(site)` group por ser `not-found.tsx` em nível raiz)
- "404" decorativo: `<span className="font-sans-condensed font-black text-icon-muted opacity-[0.08] text-[200px] lg:text-[300px] uppercase absolute pointer-events-none select-none">`
- Layout do conteúdo: node `1200:7094` → `layout_PDYRF0`: `mode: column, alignItems: center, gap: 48px, padding: 48px 170px, height: 596`
- Título: node `1200:7096` → `style_RSDKJM`: `fontFamily: Barlow Condensed, fontWeight: 900, fontSize: 50, UPPER`
- Subtítulo: node `1200:7097` → `style_CNCZAP`: `fontFamily: Barlow, fontWeight: 500, fontSize: 20`
- Texto do subtítulo: "Parece que a página que você tentou acessar não existe"
- Rodar `/refine-design` no node `1200:7086` antes da implementação
