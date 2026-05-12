# task-12: Mock Data — Enriquecimento de Imagens e Dados Realistas

**Status:** REVIEW
**Priority:** 1 — Base obrigatória; executa em paralelo com task-01
**Branch:** feat/task-12-mock-data-enrichment
**Created:** 2026-05-12
**Needs design pass:** NO

## Objective

Substituir os placeholders de imagem e dados genéricos dos mocks por assets reais do Figma e dados realistas que representem o catálogo Stetsom.

## Acceptance Criteria

- [ ] Todos os produtos mockados em `catalog.ts` têm `thumbnail_url` válido apontando para `/figma-assets/raw/` ou arquivos existentes em `/public/`
- [ ] Pelo menos 8 produtos com specs realistas (potência, impedância, canais) em formatos variados
- [ ] Pelo menos 1 produto por categoria tem `badge: "LANÇAMENTO"` ou `badge: "DESTAQUE"`
- [ ] `HOME_HERO_SLIDES` usa imagens corretas (mapeadas dos fills do Figma ou arquivos existentes)
- [ ] Mock de produto detalhe tem pelo menos 3 `ProductBlock` (1 TEXT, 1 IMAGE, 1 VIDEO) com dados representativos
- [ ] `ABOUT_TIMELINE` tem imagens apontando para arquivos existentes (não paths inexistentes como `/timeline-1989.png`)

## In Scope

- `src/lib/mock/catalog.ts` — enricher produtos com thumbnails e specs
- `src/lib/mock/site.ts` — atualizar hero slides e timeline images
- `src/lib/mock/support.ts` — adicionar categorias FAQ e items mais realistas

## Out of Scope

- Download de novos assets do Figma MCP
- Imagens de produto reais (usar as disponíveis em `/public/` e `/figma-assets/raw/`)

## Implementation Notes

- Verificar `public/` por arquivos disponíveis: `/logo.png`, `/produtos-hero.png`, `/about-bg.png`, `/brand-image.png`
- Verificar `assets-manifest.json` para paths em `/figma-assets/raw/` — usar `relativePath` diretamente
- Specs realistas por categoria:
  - Amplificadores: `{ potencia: "3000W RMS", impedancia: "1 Ohm", canais: 1, dimensoes: "390x230x65mm" }`
  - Processadores: `{ entradas: 6, saidas: 8, resposta_frequencia: "20Hz-20kHz" }`
  - Fontes: `{ corrente_saida: "220A", tensao_saida: "14.4V" }`
- ProductBlock TEXT mock: `{ title: "Alta Performance", content: "Tecnologia exclusiva Stetsom para máxima eficiência...", align: "left" }`
- ProductBlock IMAGE mock: `{ images: ["/produtos-hero.png"], caption: "Vista frontal", layout: "full" }`
- Timeline images: usar `/about-bg.png` para todos os eventos (placeholder aceitável)
