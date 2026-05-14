# Stetsom — Component Map

Figma → React. Use esta tabela para saber onde cada elemento Figma está implementado.

---

## Componentes UI Compartilhados (`src/components/ui/`)

### Button
- **Figma:** `Button` (componentSet: `21:210`)
- **React:** `src/components/ui/button.tsx`
- **Base:** `@base-ui/react/button` + CVA
- **Variantes:**
  | Variant | Figma | Classes Chave |
  |---|---|---|
  | `brand` | Button Primary | `bg-brand text-zinc-50 rounded-[4px] uppercase font-semibold` |
  | `brand-dark` | Button Secondary / "Garantia" pill | `bg-surface-elevated text-zinc-50 rounded-[4px] uppercase font-semibold` |
  | `pill` | "Garantia" nav (border-radius 1000px) | `bg-brand rounded-full uppercase font-semibold` |
  | `outline` | Ghost / outline | `border-border bg-background rounded-lg` |
  | `ghost` | Sem borda | `hover:bg-muted rounded-lg` |
- **Sizes:**
  | Size | h | px | Uso |
  |---|---|---|---|
  | `sm` | h-8 | px-4 | Ações menores |
  | `md` | h-10 | px-6 | CTA padrão |
  | `lg` | h-12 | px-7 | CTA destaque |

> Figma usa `rounded: 1000px` para o botão "Garantia" no header → usar `variant="pill"` no React.

---

### Container
- **Figma:** padrão de padding de todas as seções (px=170px, max-width=1440px)
- **React:** `src/components/ui/container.tsx`
- **Classes:** `relative mx-auto w-full max-w-360 px-5 lg:px-42.5`
- Wrap todas as seções de página com `<Container>`.

---

### Header
- **Figma:** Frame `1200:4585` (home desktop)
- **React:** `src/components/ui/header.tsx` (`"use client"`)
- **Layout:** `sticky top-0 z-50 h-22 border-b border-border bg-white`
- **Desktop:** logo (158×35) + NavigationMenu + Button "Garantia" (pill, brand-dark)
- **Mobile:** Menu icon (22px) + logo (120×28) + Search icon (20px)
- **Nav link style:** `font-sans font-normal text-lg text-muted-foreground` com `border-b-2` active/hover `text-brand border-brand`

---

### Footer
- **Figma:** Frame `1200:4713` (home desktop)
- **React:** `src/components/ui/footer.tsx` (Server Component)
- **Layout:** `bg-footer text-white` · 4 colunas desktop, coluna única mobile
- **Spacing:** desktop `px-42.5 py-6 gap-[36px_164px]` / mobile `px-5 py-6 gap-9`

---

### SectionLabel
- **Figma:** padrão de label + título de seção
- **React:** `src/components/ui/section-label.tsx`
- **Props:** `label`, `title?`, `subtitle?`, `dark?`
- **Composição:**
  ```
  linha horizontal (w-6 h-px bg-brand) + texto label uppercase
  título: font-sans-condensed font-black text-display-sm uppercase leading-none
  subtitle: font-medium text-base leading-relaxed text-text-subtle
  dark=true → todas as cores viram white/text-subtle-dark
  ```

---

### ProductCard (Card Novidades)
- **Figma:** `Card Novidades` (componentSet: `1034:9979`, size=big: `1034:9978`)
- **React:** `src/components/ui/product-card.tsx`
- **Props:** `name`, `category`, `spec?`, `badge?`, `img?`, `href?`
- **Figma:** 447×447px, `border-zinc-200`, `rounded-[16px]`, padding 24px, gap 20px
- **Implementação:** `border-zinc-200 rounded-lg` — nota: Figma usa 16px, implementação usa rounded-lg (≈10px)
- **Layout:**
  - Imagem: `bg-card h-32 md:h-36 lg:h-40 flex items-center justify-center p-4`
  - Info: `p-3` com category (`text-2xs text-brand`), name (`text-base font-black`), spec
  - Footer: `border-t border-zinc-100 px-3.5 py-2` com badge + "Ver mais ›"

---

### Breadcrumb
- **Figma:** `74:11593`
- **React:** `src/components/ui/breadcrumb.tsx`
- **Uso:** Página produto selecionado

---

### Accordion
- **Figma:** `890:10459`
- **React:** `src/components/ui/accordion.tsx`
- **Uso:** FAQ (Suporte), outras seções com perguntas

---

### NavigationMenu
- **Figma:** menu desktop do Header
- **React:** `src/components/ui/navigation-menu.tsx`
- **Base:** `@base-ui/react/navigation-menu`
- **Uso:** Header desktop, dropdown de produtos

---

## Componentes de Seção (`src/app/(site)/_components/`)

### HeroCarousel
- **Figma:** `1200:4592` (desktop) | `1200:4310` (mobile)
- **React:** `_components/hero-carousel.tsx` (`"use client"`)
- **Deps:** `swiper` 12.x, Swiper autoplay + pagination
- **Layout:** h-130 sm:h-155 lg:h-175, imagem fullscreen, overlay fade bottom
- **Paginação:** bullets custom via `.hero-carousel-pagination` em globals.css

---

### FeaturedProducts (ex-Novidades)
- **Figma:** `1200:4600` (desktop) — bg white, padding container, py-12
- **React:** `_components/featured-products.tsx` + `_components/featured-tab-strip.tsx`
- **Composição:** SectionLabel + FeaturedTabStrip (tabs) + grid ProductCard + spotlight card

---

### QualitySection (ex-QualidadeInovadora)
- **Figma:** `1200:4630` — bg `#121212` (brand-dark)
- **React:** `_components/quality-section.tsx`
- **Layout:** 3 cards com ícone + título + descrição em fundo escuro

---

### OurHistory (ex-NossaHistoria) — Stats
- **Figma:** `1200:4654`
- **React:** `_components/our-history.tsx`
- **Layout:** grid de números / estatísticas (35+, 200+, 60+, 1M+)

---

### SocialFeed (ex-SocialMedias)
- **Figma:** `1200:4702` — bg `bg-off-white`
- **React:** `_components/social-feed.tsx`
- **Deps:** scroll horizontal customizado (`useHorizontalScroll` hook)

---

### RedBanner (Marquee)
- **Figma:** `1200:6215` (sobre) — bg `#DC2626`, texto branco, gap 36px
- **React:** `_components/red-banner.tsx`
- **Texto:** `font-sans-condensed text-lg tracking-[0.05em] uppercase text-white`
- **Conteúdo:** POTÊNCIA · QUALIDADE · INOVAÇÃO · FEITO NO BRASIL · DESDE 1989 (loop)

---

### CompanyTimeline (ex-TimelineRefactored)
- **Figma:** `1200:6237` — bg white
- **React:** `_components/company-timeline.tsx` + `_components/timeline-checkpoint.tsx` + `_components/timeline-progress-bar.tsx`
- **Uso:** página `/sobre` — história de 35+ anos da Stetsom

---

### DarkGallery (ex-GaleriaDark)
- **Figma:** `1200:6271` — bg `bg-brand-dark` + dark radial
- **React:** `_components/dark-gallery.tsx`
- **Layout:** grid 6 imagens em fundo escuro

---

### OurFactory (ex-NossaFabrica)
- **Figma:** `1200:6390` — imagem + dark radial
- **React:** `_components/our-factory.tsx`
- **Assets:** `fill_XD4G8T_b3596ec5.png` (fábrica) + `fill_KULSWW_74ec6dcf.png` (mapa)

---

### FAQ + FaqAccordion
- **Figma:** `1200:6592` — bg `bg-off-white`
- **React:** `_components/faq.tsx` + `_components/faq-accordion.tsx`
- **Base:** `src/components/ui/accordion.tsx`

---

### CareersCTA (ex-CTATrabalheConosco)
- **React:** `_components/careers-cta.tsx`
- **Uso:** Home + Sobre

---

## Componentes de Página Específica

### CatalogSidebar + CatalogMobileFilter
- **React:** `src/app/(site)/produtos/_components/catalog-sidebar.tsx`
- **React:** `src/app/(site)/produtos/_components/catalog-mobile-filter.tsx`
- **Figma:** `1200:4999` (filtros)

---

### BlockRenderer
- **React:** `src/app/(site)/produtos/[slug]/_components/block-renderer.tsx`
- **ProductBlock types:** `IMAGE` | `VIDEO` | `HTML` | `MODEL3D` | `TEXT`
- **Figma:** `1200:5805`

---

### ProductDetailTabs
- **React:** `src/app/(site)/produtos/[slug]/_components/product-detail-tabs.tsx`
- **Abas:** Descrição, Especificações, Downloads

---

### ContactForm
- **React:** `src/app/(site)/suporte/_components/contact-form.tsx` (`"use client"`)
- **Figma:** `1200:6646`

---

## Gaps: Figma → React (não implementado)

| Figma | Status | Prioridade |
|---|---|---|
| Badge RMS (`1036:9869`) | parcial — implementado inline em product page | baixa |
| Tabs de categoria produtos | implementado como componente ad-hoc | — |
| Mobile nav drawer | não implementado | alta |
| Busca mobile (Search icon no header) | ícone existe, funcionalidade ausente | média |
| Página 404 | não implementada como `not-found.tsx` | alta |
