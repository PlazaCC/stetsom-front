# task-10: Suporte — Redesign Completo da Página /suporte

**Status:** REVIEW
**Priority:** 6 — Suporte + 404; depende de task-01
**Branch:** feat/task-10-suporte-redesign-completo
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Substituir o placeholder atual da página `/suporte` pela implementação completa e fiel ao Figma (8 seções do node `1200:6454` desktop / `1200:6785` mobile).

## Acceptance Criteria

- [x] Hero tem gradiente radial dark + overlay da imagem de produtos + watermark "SOS" (263px desktop / 151px mobile, `#B9B9B9`, opacity 8%) + barra decorativa vermelha de 14px width
- [x] 3 cards de suporte ("Central de Ajuda", "Garantia", "Manuais") têm barra vermelha vertical decorativa, título em `font-sans-condensed uppercase`, descrição e CTA vermelho
- [x] Seção de busca FAQ contém input de busca com ícone `Search` e tabs de categoria para filtrar
- [x] Formulário de contato tem campos nome, email, mensagem e botão "Enviar mensagem" (vermelho, não funcional)
- [x] FAQ accordion usa `FaqAccordion` existente com botão "Falar com suporte" abaixo
- [x] Seção de documentação/categorias exibe tabs e lista de links mockados

## In Scope

- `src/app/(site)/suporte/page.tsx` — redesign completo
- `src/lib/api/contracts.ts` — adicionar `SupportFaqCategory`, `SupportDocSection` se necessário
- `src/lib/mock/support.ts` — enriquecer mock com categorias, docs e FAQ search data
- Criar `src/app/(site)/_components/faq-search.tsx` e `src/app/(site)/_components/contact-form.tsx`

## Out of Scope

- Envio real do formulário (sem integração de API)
- Mapa de distribuidores (usar placeholder)
- Busca FAQ funcional de verdade (filtrar mock client-side é suficiente)

## Implementation Notes

- Hero fill: `fill_4DQMA5` → `radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(28,24,24,1) 100%)` + imageRef `6a0a1876e7a45ba7189675a049ad45fe670394d2`
- Watermark "SOS": `font-sans-condensed font-black text-[263px] uppercase text-[#B9B9B9] opacity-[0.08] absolute pointer-events-none select-none`
- Barra decorativa: node `1200:6470` → `fill_VEKOQ4` (#DC2626), `width: 14, height: 337`, `position: absolute left-0 top-0`
- Cards: node `1200:6471` desktop → `layout_H532NS`: `padding: 48px 170px, gap: 24px`
- Busca FAQ: node `1200:6592` desktop → `layout_KO47IZ`: `padding: 48px 170px`
- Formulário contato: node `1200:6646` desktop → `layout_KO47IZ`
- FAQ section: node `1200:6722` desktop → `layout_M1G2LR`: `mode: row, gap: 24px, padding: 48px 170px`
- Rodar `/poc-refine-design` nos nodes `1200:6462`, `1200:6471`, `1200:6889` antes da implementação
