# task-09: Sobre — Seção Factory/Mapa + Social Medias com Controles

**Status:** REVIEW
**Priority:** 5 — Institucional; depende de task-01
**Branch:** feat/task-09-sobre-factory-social-medias
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Implementar a seção de foto da fábrica/mapa ausente na página `/sobre` (seção 8 do Figma) e tornar os controles de `MidiasSociais` funcionais.

## Acceptance Criteria

- [x] Seção factory/localização renderiza com a imagem local da fábrica (`imageRef: b3596ec5433f770d4d9fd82c2a7c2631bbf56674`) e overlay gradiente radial dark
- [x] Overlay aplica `fill_UGV0H2`: `radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(22,16,16,1) 100%)`
- [x] Layout da seção é row (imagem + coluna de texto) em desktop e stack em mobile
- [x] `MidiasSociais` — botões ChevronLeft/Right scrollam o container de posts via ref programático
- [x] `MidiasSociais` usa `bg-off-white` (já corrigido em task-05, mas confirmar)

## In Scope

- `src/app/(site)/sobre/page.tsx` — adicionar seção factory após `MidiasSociais`
- Criar `src/app/(site)/_components/nossa-fabrica.tsx` (componente da seção factory)
- `src/app/(site)/_components/social-medias.tsx` — implementar scroll funcional com `useRef`

## Out of Scope

- Mapa interativo (Google Maps / Leaflet)
- Endereço/contato real

## Implementation Notes

- Imagem factory: verificar `assets-manifest.json` por `imageRef: b3596ec5433f770d4d9fd82c2a7c2631bbf56674` para obter `relativePath`
- Figma fill: `fill_UGV0H2` e `fill_FH61XV` usam a mesma imagem com dark radial overlay
- Layout factory desktop: node `1071:11641` → `layout_SR4ORF`: `mode: row, alignItems: center, gap: 91px, padding: 48px 170px`
- Social medias scroll: `const scrollRef = useRef<HTMLDivElement>(null)` + `scrollRef.current.scrollBy({ left: ±300, behavior: 'smooth' })`
- Rodar `/poc-refine-design` no node `1071:11641` antes da implementação
