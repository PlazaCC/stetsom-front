# task-01: Foundation — Container, Layout Primitives & Button Variants

**Status:** DONE
**Priority:** 1 — Base obrigatória antes de qualquer página; desbloqueia task-02 a task-11
**Branch:** feat/task-01-foundation-layout-primitives
**PR:** https://github.com/PlazaCC/stetsom-front/pull/1
**Created:** 2026-05-12
**Needs design pass:** NO

## Objective

Garantir que os primitivos de layout (`Container`, `Button`, `SectionLabel`) e as classes de container de página estejam 100% alinhados com os tokens do Figma antes de qualquer implementação de página.

## Acceptance Criteria

- [x] `<Container>` renderiza com `max-w-[1440px] mx-auto px-[170px]` em desktop e `px-8` em mobile
- [x] `Button` possui variante pill (`rounded-full`) com tamanhos `sm` e `md` mapeando os tokens Figma `21:211` e `21:212`
- [x] `SectionLabel` suporta prop `dark` que inverte texto para `text-white`/`text-brand`
- [x] Todos os usos de padding de página no código usam `Container` ou as classes padronizadas — sem `px-8 lg:px-[170px]` inline inconsistente

## In Scope

- `src/components/ui/container.tsx` — verificar e corrigir padding responsivo
- `src/components/ui/button.tsx` — adicionar variante `pill` e consolidar tamanhos `figma-sm` / `figma-md`
- `src/components/ui/section-label.tsx` — adicionar prop `dark`
- Auditar usos inconsistentes de padding em páginas existentes e substituir por `Container`

## Out of Scope

- Páginas e features individuais
- Novos componentes além dos listados

## Implementation Notes

- Figma token de container desktop: `layout_GQAD44` → `mode: column, alignItems: center, padding: 0px 170px, width: 1440`
- Figma token de container mobile: `layout_VA8JGO` → `mode: column, alignItems: center, padding: 0px 20px, width: 375`
- Button Figma `21:212` (md): `padding: 8px 12px`, `rounded-full` (borderRadius: 1000px), `bg-brand-dark text-white`
- Button Figma `21:211` (sm): `padding: 6px 10px`, `rounded-full`, fundo escuro
- `SectionLabel` dark: label usa `text-brand`, título usa `text-white`, subtítulo usa `text-[rgb(184,184,184)]`
- Referências: `DESIGN_SYSTEM_REFERENCE.md` seção 3 (Layout Tokens) e seção 4 (Component Mapping)
