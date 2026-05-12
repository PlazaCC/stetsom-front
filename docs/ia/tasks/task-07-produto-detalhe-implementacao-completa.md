# task-07: Produto Detalhe — Implementação Completa da Página /produtos/[slug]

**Status:** TODO
**Priority:** 4 — Catálogo; depende de task-06 (sequencial)
**Branch:** feat/task-07-produto-detalhe-implementacao-completa
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Substituir o esqueleto de debug da página `/produtos/[slug]` por uma implementação completa e fiel ao Figma (nodes `1200:5666` desktop / `1200:5391` mobile).

## Acceptance Criteria

- [ ] Breadcrumb navegável exibe: Início → Produtos → [Categoria] → [Nome do produto]
- [ ] Hero visual do produto exibe gradiente radial vermelho/preto (`#EE0800 → #000`) com imagem do produto centralizada
- [ ] Especificações do produto são exibidas como badges com `rounded-full border px-3 py-1 text-xs uppercase text-brand-dark`
- [ ] Blocos de conteúdo `TEXT` renderizam parágrafo estilizado; blocos `IMAGE` renderizam `<Image>` fullwidth
- [ ] Seção de produtos relacionados exibe grid de 4 `ProductCard` com dados mockados
- [ ] Layout desktop e mobile são responsivos e fiéis ao Figma

## In Scope

- `src/app/(site)/produtos/[slug]/page.tsx` — redesign completo
- `src/components/ui/breadcrumb.tsx` — criar componente (baseado no Figma node `74:11593`)
- Renderer de `ProductBlock` para tipos TEXT e IMAGE
- Reutilizar `ProductCard` para produtos relacionados
- Enriquecer mock de `ProductDetailPayload` em `catalog.ts` com blocos de conteúdo reais

## Out of Scope

- Bloco `VIDEO` (embed YouTube): renderizar placeholder
- Bloco `MODEL3D`: renderizar placeholder
- Bloco `HTML`: renderizar placeholder com aviso
- Seção de arquivos para download (placeholder)
- Bloco de contato/formulário

## Implementation Notes

- Figma node breadcrumb: `74:11593`, `layout_O5Y1P5` → `flex flex-row items-center flex-wrap gap-1 px-5 py-2`
- Hero produto: `fill_H43WVX` → `radial-gradient(circle at 50% 50%, rgba(238,8,0,1) 45%, rgba(0,0,0,1) 100%)`
- Info produto desktop: node `1200:5674`, `padding: 24px 170px`, `bg-[#F8F8F8]`, layout row com specs à direita
- Imagem produto mobile: node `1200:5456` → `bg-[#010001]`, 375×299
- Specs: `Object.entries(product.specifications)` mapeados para badges
- Produto relacionado: adicionar `relatedProducts: ProductCardItem[]` ao `ProductDetailPayload` e ao mock
- Rodar `/poc-refine-design` nos nodes `1200:5666` (desktop) e `1200:5391` (mobile) antes da implementação
