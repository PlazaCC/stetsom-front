---
description: 'Use when writing styles, utility classes, or CSS. Covers Tailwind CSS v4 conventions and Stetsom brand tokens.'
applyTo: 'src/**/*.{ts,tsx,css}'
---

# Tailwind CSS v4

- Sem `tailwind.config.*` — toda configuração fica em `src/app/globals.css` dentro de `@theme inline`
- Nunca use valores arbitrários de cor como `bg-[#E8132A]` ou `text-[rgb(...)]` — use sempre um token abaixo

## Tokens de cor disponíveis

| Classe Tailwind | Valor | Uso |
|---|---|---|
| `bg-brand` / `text-brand` | Stetsom red | Destaques, CTAs, links ativos |
| `bg-brand-dark` / `text-brand-dark` | `#121212` | Fundos escuros (footer, hero dark, header button) |
| `bg-off-white` | `#F5F4F2` | Seções claras alternadas |
| `bg-card` | `#F8F8F8` | Product cards, surfaces sutis |
| `bg-muted` | `#F0F0F0` | Placeholder de imagem, bg muted |
| `text-muted-foreground` | `#565656` | Nav links, copyright, texto secundário |
| `text-text-subtle` | `#666666` | Texto descritivo em fundo claro |
| `text-text-subtle-dark` | `#B8B8B8` | Texto secundário em fundo escuro |
| `bg-surface-elevated` | `#1F1F1F` | Superfície elevada em contexto escuro |
| `text-icon-muted` | `#767676` | Ícones muted |
| `text-foreground` | near-black | Texto principal |

## Tokens de tipografia (tamanhos fora do Tailwind default)

| Classe | Tamanho | Uso |
|---|---|---|
| `text-2xs` | 11px | Labels pequenos, badges |
| `text-button-md` | 13px | Botões md, footer copyright |
| `text-section-title` | 22px | Títulos de card (suporte, bases) |
| `text-display-sm` | 40px | SectionLabel heading |
| `text-display-lg` | 56px | Timeline year heading lg |
| `text-display-xl` | 64px | Hero heading md |
| `text-display-2xl` | 80px | Timeline year heading xl |

## Tokens de espaçamento

| Classe | Valor | Uso |
|---|---|---|
| `gap-logo-nav` | 51px | Gap entre logo e nav no header |

## Outras convenções

- Tipografia: `font-sans` (Barlow, corpo), `font-sans-condensed` (Barlow Condensed, headings e specs)
- Use `font-sans-condensed font-black uppercase` para headings de impacto e números de spec
- Layout de página: `Container` component — `px-8 lg:px-42.5 max-w-360 mx-auto`
- Breakpoints responsivos: mobile-first; use `sm:`, `md:`, `lg:`
- Para grays standard: prefira Tailwind built-ins (`zinc-400`, `zinc-500`, `neutral-400`, `white/10`)
