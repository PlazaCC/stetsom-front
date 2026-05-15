# task-04: Home — Hero Carousel Gradiente + Seção Escura

**Status:** REVIEW
**Priority:** 3 — Home sections; depende de task-01 + task-12
**Branch:** feat/task-04-home-hero-gradiente-dark-section
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Alinhar as seções 2 e 4 da Home (Hero Carousel e seção dark "NossaHistoria") com os gradientes e estrutura exata do Figma.

## Acceptance Criteria

- [x] Hero carousel usa gradiente `linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)` no overlay, não `bg-black/35` uniforme
- [x] Tipo `HeroBannerSlide` aceita `label?: string` e `title?: string`; quando presentes, renderizam texto overlay acima do gradiente
- [x] `HOME_HERO_SLIDES` mock atualizado com `label` e `title` para cada slide
- [x] Seção dark (`NossaHistoria`) desktop tem layout duas colunas com `gap-[91px]` — imagem à esquerda, texto à direita
- [x] Seção dark mobile mantém layout stack (imagem acima, texto abaixo)

## In Scope

- `src/app/(site)/_components/hero-carousel.tsx` — corrigir gradiente e adicionar overlay de texto
- `src/lib/api/contracts.ts` — adicionar campos `label?` e `title?` ao tipo `HeroBannerSlide`
- `src/lib/mock/site.ts` — atualizar `HOME_HERO_SLIDES`
- `src/app/(site)/_components/nossa-historia.tsx` — corrigir gap desktop

## Out of Scope

- Controles de navegação além de paginação
- Conteúdo real dos slides (usar mock)

## Implementation Notes

- Figma fill hero: `fill_QPGB3Q` tem `gradient: linear-gradient(180deg, rgba(0, 0, 0, 0) 72%, rgba(0, 0, 0, 1) 100%)`
- Overlay de texto fica posicionado `absolute bottom-0 left-0 px-[170px] pb-12` em desktop
- Seção dark node Figma: `1071:10411` desktop → `layout_UL9QG5`: `mode: row, alignItems: center, gap: 91px, padding: 0px 170px 0px 0px, width: 1440`
- Texto overlay: label em `font-sans-condensed font-medium text-sm uppercase text-brand`, título em `font-sans-condensed font-black uppercase text-white`
- Rodar `/poc-refine-design` no node `1071:10282` antes da implementação
