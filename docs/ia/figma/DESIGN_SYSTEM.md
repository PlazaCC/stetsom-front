# Stetsom — Design System Reference

Fonte: Figma `huD41oTL0FAa7xsNEK8tAM` + `src/app/globals.css`.
**Regra:** nunca use valores hardcoded (hex/rgb) em componentes — use sempre a coluna "Tailwind Class".

---

## Cores

### Marca (Brand)

| Figma / Uso | CSS Var | Tailwind Class | Valor |
|---|---|---|---|
| Vermelho Stetsom — CTAs, active nav, badges | `--color-brand` | `bg-brand` / `text-brand` | `rgb(232,19,42)` = `#E8132A` |
| Fundo dark — header dark, footer interior, seções dark | `--color-brand-dark` | `bg-brand-dark` / `text-brand-dark` | `rgb(18,18,18)` = `#121212` |
| Barra de stats — RedBanner, nossas bases | `--color-bar-accent` | `bg-bar-accent` | `rgb(220,38,38)` = `#DC2626` |
| Footer bg | `--color-footer` | `bg-footer` | `rgb(17,17,17)` = `#111111` |

### Superfícies (Surfaces)

| Figma / Uso | CSS Var | Tailwind Class | Valor |
|---|---|---|---|
| Seções alternadas claras — FAQ, social, suporte cards | `--color-off-white` | `bg-off-white` | `rgb(245,244,242)` = `#F5F4F2` |
| Card bg — product cards, formulário | — | `bg-card` | `oklch(0.975 0 0)` ≈ `#F4F4F4` |
| Superfície elevada em dark — cards dark, overlay | `--color-surface-elevated` | `bg-surface-elevated` | `oklch(0.22 0 0)` ≈ `#1F1F1F` |
| Área de info produto selecionado | — | `bg-[#F8F8F8]`¹ | `#F8F8F8` |
| Background padrão branco | — | `bg-white` | `#FFFFFF` |
| Background global (light mode) | — | `bg-background` | `oklch(1 0 0)` = branco |

> ¹ `#F8F8F8` não tem token exato — usar `bg-[#F8F8F8]` apenas neste caso (produto selecionado info area).

### Texto (Text)

| Figma / Uso | CSS Var | Tailwind Class | Valor aprox |
|---|---|---|---|
| Links de navegação, copyright, texto secundário | `--color-muted-foreground` | `text-muted-foreground` | `#565656` |
| Descritivos em fundo claro | `--color-text-subtle` | `text-text-subtle` | `oklch(0.42)` ≈ `#666666` |
| Descritivos em fundo escuro | `--color-text-subtle-dark` | `text-text-subtle-dark` | `oklch(0.73)` ≈ `#B8B8B8` |
| Texto principal | — | `text-foreground` | `oklch(0.145)` ≈ `#1A1A1A` |
| Watermark de background (SOS, anos) | `--color-watermark-text` | `text-watermark-text` | `rgb(185,185,185)` = `#B9B9B9` |
| Ícones muted | `--color-icon-muted` | `text-icon-muted` | `oklch(0.5)` ≈ `#767676` |

### Borders

| Uso | Tailwind Class |
|---|---|
| Divisores leves em superfície clara | `border-zinc-200` = `#E4E4E7` |
| Divisores cards produto | `border-zinc-100` |
| Header border-b | `border-border` |
| Bordas translúcidas em dark | `border-white/20` / `border-white/10` |
| Card Novidades Figma | `border-zinc-200` (`#E4E4E7` — match exato) |

---

## Tipografia

### Fontes

| Classe Tailwind | Fonte | Uso |
|---|---|---|
| `font-sans` | Barlow | Corpo, parágrafos, labels, botões, nav links |
| `font-sans-condensed` | Barlow Condensed | Headings de impacto, specs técnicas, watermarks, badges |

### Composição de Heading

```
font-sans-condensed font-black uppercase     → heading principal
font-sans-condensed font-black uppercase leading-none   → heading linha única
font-sans-condensed font-medium uppercase    → label de seção, stats bar
```

### Escala de Tamanhos Customizados

| Token | Tailwind | Tamanho | Uso |
|---|---|---|---|
| — | `text-2xs` | 11px (0.69rem) | Labels badges, categorias em cards |
| — | `text-button-md` | 13px (0.81rem) | Botão size md, "Ver mais" em cards |
| — | `text-section-title` | 22px (1.38rem) | Títulos de card (suporte) |
| — | `text-display-sm` | 40px (2.5rem) | `SectionLabel` title |
| — | `text-display-lg` | 56px (3.5rem) | Timeline year heading lg |
| — | `text-display-xl` | 64px (4rem) | Hero heading md |
| — | `text-display-2xl` | 80px (5rem) | Timeline year heading xl |

### Tamanhos Standard (Tailwind default)

| Tailwind | px | Uso típico |
|---|---|---|
| `text-xs` | 12px | Meta info, labels pequenos |
| `text-sm` | 14px | Corpo pequeno, descrições de card, botão |
| `text-base` | 16px | Corpo padrão, label de seção condensed |
| `text-lg` | 18px | Nav links, stats bar |
| `text-xl` | 20px | Subtítulos, 404 subtítulo |

### Estilos Figma → Tailwind (mapeamento direto)

| Figma Style | Tailwind |
|---|---|
| Nav links: Barlow Regular 400, 18px | `font-sans font-normal text-lg` |
| Button text: Barlow Medium 500, 14px | `font-sans font-medium text-sm` (sm) |
| Stats bar: Barlow Condensed Regular 400, 18px, letter-spacing 5% | `font-sans-condensed text-lg tracking-[0.05em] uppercase` |
| SectionLabel label: Barlow Condensed Medium, 16px | `font-sans-condensed font-medium text-base uppercase` |
| SectionLabel title: Barlow Condensed Black 900, 40px | `font-sans-condensed font-black text-display-sm uppercase leading-none` |
| Hero heading: Barlow Condensed Black 900, 64px+ | `font-sans-condensed font-black text-display-xl uppercase leading-none` |
| Watermark (SOS, 404): Barlow Condensed Black 900, huge | `font-sans-condensed font-black uppercase text-watermark-text opacity-[0.08]` |
| Breadcrumb: Barlow Regular 400, small | `font-sans font-normal text-xs text-muted-foreground` |

---

## Layout & Espaçamento

### Container Global

```tsx
// src/components/ui/container.tsx
className="relative mx-auto w-full max-w-360 px-5 lg:px-42.5"
// max-w-360 = 1440px | px-42.5 = 170px | px-5 = 20px (mobile)
```

### Seções de Página

| Token | Valor | Uso |
|---|---|---|
| Padding vertical seção | `py-12` (48px) | Seções padrão |
| Padding vertical seção grande | `py-20` (80px) | Seções hero |
| Gap logo ↔ nav | `gap-logo-nav` = 51px | Header desktop |
| Gap interno seção | `gap-6` (24px) / `gap-9` (36px) | Grids e flex internos |
| Gap cards | `gap-5` (20px) | Grid de produtos |
| Gap stats bar | `gap-9` (36px) | RedBanner / NossasBases |

### Breakpoints

| Prefix | Largura | Contexto |
|---|---|---|
| (nenhum) | 0–639px | Mobile (375px base no Figma) |
| `sm:` | 640px+ | — |
| `md:` | 768px+ | Transição mobile/desktop |
| `lg:` | 1024px+ | Desktop layout (1440px base no Figma) |

### Alturas Fixas

| Elemento | Classes |
|---|---|
| Header | `h-22` (88px) |
| Hero carousel | `h-130 sm:h-155 lg:h-175` (520/620/700px) |
| ProductCard Figma | 447×447px → uso responsivo: `h-32 md:h-36 lg:h-40` (image area) |

---

## Border Radius

> `--radius: 0.625rem` — o projeto sobrescreve o padrão Tailwind. Use valores arbitrários `rounded-[Npx]` para manter fidelidade ao Figma.

| Uso | Classe |
|---|---|
| Botão brand / brand-dark | `rounded-[4px]` |
| Botão pill (nav "Garantia") | `rounded-full` |
| Card Novidades (Figma) | `rounded-[16px]` |
| ProductCard (implementação) | `rounded-lg` (≈ 10px) |
| Nav dropdown items | `rounded-sm` |
| Badge RMS | — (quadrado) |

---

## Efeitos & Gradientes

### Gradientes Named

| Nome | CSS / Tailwind | Onde usar |
|---|---|---|
| Hero dark overlay | `.bg-gradient-dark-overlay` | Overlay sobre imagens hero |
| Produto hero radial | `bg-[radial-gradient(circle,#EE0800,#000)]` | Destaque visual produto selecionado |
| Fábrica/mapa radial | `bg-[radial-gradient(circle_at_99%_114%,#1B1A2C,#161010)]` | NossaFabrica |
| Hero bottom fade | `linear-gradient(180deg,rgba(0,0,0,0)_72%,rgba(0,0,0,1)_100%)` | Via `style={}` no HeroCarousel |

### Opacidade Utilitária

| Classe | Uso |
|---|---|
| `bg-black/65` `bg-black/40` | Overlay sobre imagens |
| `bg-white/90` `bg-white/35` | UI semi-transparente |
| `border-white/40` `border-white/20` | Bordas em fundo escuro |
| `opacity-[0.08]` | Watermarks de fundo (SOS, 404) |

---

## Swiper (HeroCarousel)

Classes globais definidas em `globals.css` — não criar variantes inline:

```css
.hero-carousel-pagination          /* gap: 0.375rem entre bullets */
.swiper-pagination-bullet          /* 10px bullet, bg rgba(180,180,180,0.6) */
.swiper-pagination-bullet-active   /* 26px wide, bg rgba(220,220,220,0.9) */
/* sm: bullet 14px, active 32px */
```

---

## Tokens Faltantes / Gaps

Estes gaps foram identificados na análise — adicionar em `globals.css` se padrão se repetir:

| Valor | Onde aparece | Ação |
|---|---|---|
| `#F8F8F8` (produto info bg) | 1 local | Usar `bg-[#F8F8F8]` — não criar token |
| `tracking-[0.05em]` (stats bar 5%) | `RedBanner`, stats | Usar arbitrário (letter-spacing não tem escala canônica) |
| Gradiente hero radial vermelho | Produto selecionado | Usar `style={}` inline — complexidade não justifica token |
