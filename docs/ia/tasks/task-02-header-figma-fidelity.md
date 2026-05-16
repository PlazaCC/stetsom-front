# task-02: Header — Fidelidade Completa Desktop + Mobile

**Status:** REVIEW
**Priority:** 2 — Componente global; depende de task-01 (Button pill)
**Branch:** feat/task-02-header-figma-fidelity
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Alinhar o `Header` com o Figma (nodes `1071:10274` desktop / mobile em `1071:9993`) corrigindo tipografia, espaçamentos, botão pill e layout do menu mobile.

## Acceptance Criteria

- [x] Desktop: gap entre logo e nav links é visualmente 51px; links usam Barlow Regular 18px `#565656`
- [x] Desktop: botão "Garantia" tem shape pill (`rounded-full`) com `bg-brand-dark text-white`, padding `8px 12px`
- [x] Mobile: três elementos em row — hamburger (40×40) | logo centralizado | search (40×40)
- [x] Mobile: borda inferior do header usa `border-b border-[#999999]`
- [x] Nav link ativo tem underline `border-brand` e cor `text-brand`

## In Scope

- `src/components/ui/header.tsx`
- Ajuste de gap, tipografia e botão no desktop
- Correção de layout mobile (hamburger, logo, search)
- Atualização do botão para usar variante pill do `Button` component (depende de task-01)

## Out of Scope

- Menu mobile drawer/sidebar (implementação futura)
- Dropdown de categorias de produtos (manter como está)

## Implementation Notes

- Figma node desktop: `1071:10274` (Home) / `1071:10547` (Suporte)
- Layout header desktop: `layout_IB159O` → `flex flex-row justify-between items-center py-6`
- Logo + nav container: `layout_SXLGOC` → `flex flex-row items-center gap-[51px]`
- Layout header mobile: `layout_R32J4W` → `flex flex-row justify-between items-center padding: 16px 20px`
- Ícones mobile: `menu` e `search` de `lucide-react`, 40×40, cor `var(--color-icon-muted)` ou `#000`
- Rodar `/poc-refine-design` no node `1071:10274` antes da implementação
