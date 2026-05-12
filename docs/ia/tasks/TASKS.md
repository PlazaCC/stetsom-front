# Stetsom Front — Task Backlog

> Gerado em: 2026-05-12 | Fluxo: AI-Driven Workflow
> Para executar: `/poc-next-task` | Para criar nova: `/brainstorm` → `/create-poc-task`

## Sequência de Execução

```
Fase 1 — Foundation (paralelo):
  task-01 (primitivos) + task-12 (mock data)

Fase 2 — Globais (paralelo, depende de task-01):
  task-02 (header) + task-03 (footer)

Fase 3 — Home (paralelo, depende de task-01 + task-12):
  task-04 (hero + dark section) + task-05 (novidades tabs + bases)

Fase 4 — Catálogo (sequencial, depende de task-05 + task-12):
  task-06 (produtos listing) → task-07 (produto detalhe)

Fase 5 — Institucional (paralelo, depende de task-01):
  task-08 (sobre hero/banner/galeria) + task-09 (sobre factory/social)

Fase 6 — Suporte + 404 (paralelo, depende de task-01):
  task-10 (suporte redesign) + task-11 (404 page)
```

## Tasks

| ID      | Título                                        | Prioridade | Status      | Design Pass | Branch                                        |
|---------|-----------------------------------------------|------------|-------------|-------------|-----------------------------------------------|
| task-01 | Foundation — Layout Primitives & Button       | 1          | TODO        | NO          | feat/task-01-foundation-layout-primitives     |
| task-02 | Header — Fidelidade Figma Desktop + Mobile    | 2          | TODO        | YES         | feat/task-02-header-figma-fidelity            |
| task-03 | Footer — Fidelidade Figma + Links Copyright   | 2          | TODO        | YES         | feat/task-03-footer-figma-fidelity            |
| task-04 | Home — Hero Carousel Gradiente + Seção Dark   | 3          | TODO        | YES         | feat/task-04-home-hero-gradiente-dark-section |
| task-05 | Home — Novidades Tabs Interativas + Bases     | 3          | TODO        | NO          | feat/task-05-home-novidades-tabs-bases        |
| task-06 | Produtos — Hero Radial + Filtros + Grid       | 4          | TODO        | YES         | feat/task-06-produtos-hero-filtros-grid       |
| task-07 | Produto Detalhe — Implementação Completa      | 4          | TODO        | YES         | feat/task-07-produto-detalhe-implementacao-completa |
| task-08 | Sobre — Hero + RedBanner Marquee + Galeria    | 5          | TODO        | YES         | feat/task-08-sobre-hero-redbanner-galeria     |
| task-09 | Sobre — Factory/Mapa + Social Medias          | 5          | TODO        | YES         | feat/task-09-sobre-factory-social-medias      |
| task-10 | Suporte — Redesign Completo (8 seções)        | 6          | TODO        | YES         | feat/task-10-suporte-redesign-completo        |
| task-11 | 404 — Criar Página not-found.tsx              | 6          | TODO        | YES         | feat/task-11-404-not-found-page               |
| task-12 | Mock Data — Enriquecimento Imagens + Specs    | 1          | TODO        | NO          | feat/task-12-mock-data-enrichment             |
| task-13 | Design Token Foundation — Cores, tipografia, espaçamento | 1 | TODO  | NO          | feat/task-02-header-figma-fidelity            |
