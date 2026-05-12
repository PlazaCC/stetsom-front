# task-06: Produtos — Hero Radial Gradient + Filtros + Grid Alinhados ao Figma

**Status:** REVIEW
**Priority:** 4 — Catálogo; depende de task-05 + task-12
**Branch:** feat/task-06-produtos-hero-filtros-grid
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Substituir o hero simples da página `/produtos` pelo gradiente radial dark do Figma e refinar os estilos dos filtros e grid de produtos.

## Acceptance Criteria

- [x] Hero desktop tem `h-[336px]`, gradiente radial dark `radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(28,24,24,1) 100%)` + image overlay + gradiente linear de fade-out na parte inferior
- [x] Watermark de texto no hero está posicionado `absolute right-0 bottom-0` com `opacity-[0.08]`
- [x] Botões de filtro de categoria inativos: `border border-zinc-200 text-zinc-500 bg-transparent`; ativos: `bg-brand-dark text-white border-brand-dark` (mantém estilo atual, apenas verificar alinhamento)
- [x] Input de busca usa `border border-zinc-500` com ícone `Search` à esquerda (mantém estrutura atual)
- [x] Produtos mockados têm `thumbnail_url` válido apontando para `/figma-assets/raw/` ou `/public/`

## In Scope

- `src/app/(site)/produtos/page.tsx` — hero section
- `src/lib/mock/catalog.ts` — enricher thumbnails dos produtos
- Verificar grid responsivo `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

## Out of Scope

- Paginação (cursor/página)
- Skeleton loading states

## Implementation Notes

- Figma fill hero: `fill_QDUJ2M` / `fill_M5AJUV` → imageRef `6a0a1876e7a45ba7189675a049ad45fe670394d2`
- Gradiente composto: radial dark + linear `rgba(0,0,0,0) 72% → rgba(0,0,0,1) 100%` + imagem STRETCH
- Verificar `assets-manifest.json` para path local da imagem do hero
- Figma node hero desktop: `1200:4990`, layout `layout_YA6EFF` → `mode: none, width: 1440, height: 336`
- Rodar `/poc-refine-design` no node `1200:4990` antes da implementação
