# task-03: Footer — Fidelidade Completa Desktop + Mobile + Links Copyright

**Status:** REVIEW
**Priority:** 2 — Componente global; depende de task-01 (tokens de layout)
**Branch:** feat/task-03-footer-figma-fidelity
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Corrigir o Footer para corresponder exatamente ao Figma (nodes `1200:4713` desktop / `1200:4526` mobile) com padding correto, logo real, 4 colunas e linha de copyright com links legais.

## Acceptance Criteria

- [x] Desktop: container usa `px-[100px] py-6` (não `px-8 lg:px-24` atual)
- [x] Desktop: layout `flex flex-row flex-wrap gap-x-[164px] gap-y-9 bg-[#111111]`
- [x] Coluna 1 exibe logo Stetsom + tagline + ícones sociais (Facebook, Instagram, YouTube, TikTok)
- [x] Copyright row exibe: "©2025 Stetsom Eletrônica Ltda. Todos os direitos reservados." à esquerda + "Política de privacidade | Termos de uso | Cookies" à direita
- [x] Mobile: layout `flex flex-col gap-9 px-5 py-6`

## In Scope

- `src/components/ui/footer.tsx`
- `src/lib/mock/navigation.ts` — atualizar `FOOTER_COLUMNS` com colunas corretas
- Corrigir ícones sociais (remover Twitter, adicionar Instagram)
- Adicionar links de copyright

## Out of Scope

- Links funcionais para Política de Privacidade e Termos (usar `href="#"`)

## Implementation Notes

- Figma token footer desktop: `layout_MQ9V8W` → `mode: row, wrap: true, gap: 36px 164px, padding: 24px 100px, width: 1440`
- Figma token footer mobile: `layout_06C7QX` → `mode: column, gap: 36px, padding: 24px 20px, width: 375`
- Colunas do Figma: node `1200:7119` (empresa), `1200:7126` (produtos: Todos, Amplificadores, Processadores, Fontes, Controladores, Acessórios), `1200:7135` (suporte: Central de ajuda, Garantia, Manuais, Postos autorizados, Contato)
- Logo: usar `/logo.png` (não `/brand-image.png`)
- Copyright texto exato do Figma: "©2025 Stetsom Eletrônica Ltda. Todos os direitos reservados."
- Rodar `/poc-refine-design` no node `1200:7099` antes da implementação
