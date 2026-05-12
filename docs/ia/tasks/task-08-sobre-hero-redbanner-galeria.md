# task-08: Sobre — Hero, RedBanner Marquee + Galeria Dark

**Status:** TODO
**Priority:** 5 — Institucional; depende de task-01
**Branch:** feat/task-08-sobre-hero-redbanner-galeria
**Created:** 2026-05-12
**Needs design pass:** YES

## Objective

Alinhar as seções 2, 3 e 5 da página `/sobre` com o Figma: hero com gradiente radial correto, RedBanner com animação marquee infinita e galeria dark.

## Acceptance Criteria

- [ ] Hero Sobre tem `h-[439px]` em desktop, gradiente radial dark `fill_W1677V` aplicado como overlay
- [ ] `RedBanner` anima continuamente em loop horizontal (CSS marquee) sem parar
- [ ] Galeria dark (seção 5) existe com `bg-brand-dark` (ou gradiente radial dark) após a seção Timeline
- [ ] `CTATrabalheConosco` é verificado contra o Figma — remover da página se não mapeado, ou manter com comentário indicando que é conteúdo extra

## In Scope

- `src/app/(site)/sobre/page.tsx` — hero e ordem das seções
- `src/app/(site)/_components/red-banner.tsx` — adicionar animação marquee CSS
- Criar seção galeria dark inline em `sobre/page.tsx` ou como componente `_components/galeria-dark.tsx`

## Out of Scope

- Conteúdo real das imagens da galeria (usar placeholders `bg-zinc-800`)
- Animação com Framer Motion / Motion library (usar CSS puro)

## Implementation Notes

- Hero gradient: `fill_W1677V` → `radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(22,16,16,1) 100%)`
- Hero node Figma: `1200:6188` desktop → `layout_URM5ES`: `mode: none, width: 1440, height: 439`
- RedBanner marquee: duplicar array de milestones, usar `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` no `globals.css`
- Classe de animação: `animate-marquee` com `animation: marquee 20s linear infinite`
- Galeria dark Figma node: `1200:6271`, `layout_HW1JSP` → `padding: 48px 170px, bg: dark radial`
- Rodar `/poc-refine-design` no node `1200:6188` e `1200:6271` antes da implementação
