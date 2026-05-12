# task-05: Home — Novidades com Tabs Interativas + Seção Nossas Bases

**Status:** TODO
**Priority:** 3 — Home sections; depende de task-01 + task-12
**Branch:** feat/task-05-home-novidades-tabs-bases
**Created:** 2026-05-12
**Needs design pass:** NO

## Objective

Implementar filtragem interativa nas Tabs de Novidades, adicionar a seção "Nossas Bases" ausente na Home e corrigir o background da seção Social Medias.

## Acceptance Criteria

- [ ] Clicar numa tab de categoria na seção Novidades filtra os `featuredProducts` exibidos no grid
- [ ] Tab ativa tem estilo `bg-white shadow-sm rounded-[6px]`; inativas têm `bg-transparent text-[rgb(113,113,122)]`
- [ ] Home exibe seção "Nossas Bases" com `bg-white` após a seção dark, com 3 cards iguais ao padrão do componente existente
- [ ] `MidiasSociais` na Home usa `bg-off-white` (não `bg-white`)
- [ ] `SiteHomePayload` inclui campo `bases: AboutBase[]` populado no mock

## In Scope

- `src/app/(site)/_components/novidades.tsx` — adicionar estado de tab ativa e filtragem client-side
- `src/app/(site)/page.tsx` — adicionar `<NossasBases bases={homePayload.bases} />`
- `src/lib/api/contracts.ts` — adicionar `bases: AboutBase[]` a `SiteHomePayload`
- `src/lib/mock/site.ts` — adicionar bases ao payload home
- `src/lib/api/providers/mock-provider.ts` — incluir bases no `getSiteHomePayload`
- `src/app/(site)/_components/social-medias.tsx` — corrigir `bg-white` → `bg-off-white`

## Out of Scope

- Animações de transição entre tabs
- Busca por texto na seção Novidades

## Implementation Notes

- `Novidades` precisa ser `"use client"` ou usar um subcomponente client para as tabs
- Filtragem: tabs mapeiam para categorias do `HOME_NOVIDADES_TABS`; tab "Todos" exibe todos os `featuredProducts`; outras tabs filtram por `product.category === tab`
- Adicionar mock de `bases` ao `SITE_ABOUT_PAYLOAD_BASE` e reusar em `HOME_PAYLOAD` no mock-provider
- Figma node Nossas Bases na Home: `1200:4654` desktop (`layout_Q69OF6`: column, gap 24px, padding 48px 170px)
