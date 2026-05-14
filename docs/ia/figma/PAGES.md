# Stetsom — Pages Reference

Figma: `huD41oTL0FAa7xsNEK8tAM` · Website root: `1200:4302`
Para inspecionar uma seção: `get_figma_data(fileKey, nodeId)` com o node da coluna.

---

## Componentes Globais (todas as páginas)

| Componente | Figma Node | React File | Notas |
|---|---|---|---|
| Header | `1200:4585` (home desktop) | `src/components/ui/header.tsx` | Sticky, h-22, border-b |
| Footer | `1200:4713` (home desktop) | `src/components/ui/footer.tsx` | bg-footer (#111111), 4 colunas |
| Container | — | `src/components/ui/container.tsx` | max-w-360 px-5 lg:px-42.5 |

---

## Home (`/`)

Desktop: `1200:4584` (1440px) | Mobile: `1200:4304` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | React Component | File |
|---|---|---|---|---|---|---|
| 1 | `1200:4585` | `1200:4305` | Header | `bg-white` | Header | `ui/header.tsx` |
| 2 | `1200:4592` | `1200:4310` | Hero Carousel | Imagem + overlay | HeroCarousel | `_components/hero-carousel.tsx` |
| 3 | `1200:4600` | `1200:4318` | Novidades | `bg-white` | FeaturedProducts | `_components/featured-products.tsx` |
| 4 | `1200:4630` | `1200:4445` | Qualidade Inovadora | `bg-brand-dark` | QualitySection | `_components/quality-section.tsx` |
| 5 | `1200:4654` | `1200:4469` | Nossas Bases / Stats | `bg-white` | OurFoundations | `_components/our-foundations.tsx` |
| 6 | `1200:4702` | `1200:4517` | Social Medias | `bg-off-white` | SocialFeed | `_components/social-feed.tsx` |
| 7 | `1200:4713` | `1200:4526` | Footer | `bg-footer` | Footer | `ui/footer.tsx` |

**Assets:**
- Hero image: `fill_5JQEZY_e95c6db4.png` (desktop) | `fill_YKBFZV_e95c6db4.png` (mobile)
- Novidades cards (galeria): `fill_EPTO4T_3d86cd17.png`, `fill_THI4RN_1e666beb.png`, `fill_3FJG3P_64a33e19.png`

**Componentes da Home não listados acima (também em `(site)/_components/`):**
- `our-history.tsx` — stats e linha do tempo editorial
- `faq.tsx` + `faq-accordion.tsx` — accordion FAQ
- `careers-cta.tsx` — CTA carreira
- `red-banner.tsx` — marquee `bg-bar-accent` com milestones
- `company-timeline.tsx` + `timeline-checkpoint.tsx` + `timeline-progress-bar.tsx` — timeline interativa (→ usada em `/sobre`)

---

## Produtos (`/produtos`)

Desktop: `1200:4982` (1440px) | Mobile: `1200:4766` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | React Component | File |
|---|---|---|---|---|---|---|
| 1 | `1200:4983` | `1200:4767` | Header | `bg-white` | Header | `ui/header.tsx` |
| 2 | `1200:4990` | `1200:4772` | Hero Banner | dark radial + img | — (inline) | `produtos/page.tsx` |
| 3 | `1200:4999` | `1200:4780` | Filtros / Categorias | `bg-white` + `border-zinc-200` | CatalogSidebar | `produtos/_components/CatalogSidebar.tsx` |
| 4 | `1200:5026` | `1200:4808` | Grade de Produtos | `bg-white` | ProductCard grid | `ui/product-card.tsx` |
| 5 | `1200:5338` | `1200:4922` | Footer | `bg-footer` | Footer | `ui/footer.tsx` |

**Assets:**
- Hero banner: `fill_CGM3WO_6a0a1876.png` (desktop) | mobile usa mesmo

**Filtros mobile:**
- Componente: `produtos/_components/CatalogMobileFilter.tsx`

---

## Produto Selecionado (`/produtos/[slug]`)

Desktop: `1200:5666` (1440px) | Mobile: `1200:5391` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | React Component | File |
|---|---|---|---|---|---|---|
| 1 | `1200:5667` | `1200:5392` | Header | `bg-white` | Header | `ui/header.tsx` |
| 2 | `1200:5674` | `1200:5397` | Breadcrumb + Info produto | `bg-[#F8F8F8]` | — (inline) | `[slug]/page.tsx` |
| 3 | `1200:5721` | `1200:5412` | Especificações | `bg-white border-zinc-200` | — (tabela) | `[slug]/page.tsx` |
| 4 | `1200:5739` | `1200:5450` | Destaque visual (amp hero) | gradiente radial vermelho/preto | — (inline) | `[slug]/page.tsx` |
| 5 | — | `1200:5456` | Imagem produto principal | `bg-[#010001]` | — | mobile only |
| 6 | — | `1200:5459` | Foto ambiente | imagem + overlay | — | mobile only |
| 7 | `1200:5805` | `1200:5461` | Blocos de conteúdo | variável por tipo | BlockRenderer | `[slug]/_components/BlockRenderer.tsx` |
| 8 | `1200:5891` | `1200:5522` | Produtos relacionados | `bg-white` | ProductCard | `ui/product-card.tsx` |
| 9 | — | `1200:5608` | Footer | `bg-footer` | Footer | `ui/footer.tsx` |

**Tabs de produto:**
- `[slug]/_components/product-detail-tabs.tsx` — abas Descrição, Specs, Downloads

**Assets:**
- Produto hero (mobile): `fill_3MZVXN_813a9a32.png`, `fill_DNYKPI_76d259b6.png`, `fill_3OI1TK_c5edb822.png`
- Destaque visual: `fill_8T5TD1_7ad629bc.png`

---

## Sobre (`/sobre`)

Desktop: `1200:6180` (1440px) | Mobile: `1200:5944` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | React Component | File |
|---|---|---|---|---|---|---|
| 1 | `1200:6181` | `1200:5945` | Header | `bg-white` | Header | `ui/header.tsx` |
| 2 | `1200:6188` | `1200:5950` | Hero Banner | dark radial | — (inline) | `sobre/page.tsx` |
| 3 | `1200:6215` | `1200:5976` | Stats Bar | `bg-bar-accent` | RedBanner / inline | `_components/red-banner.tsx` |
| 4 | `1200:6237` | `1200:5998` | Timeline / História | `bg-white` | CompanyTimeline | `_components/company-timeline.tsx` |
| 5 | `1200:6271` | `1200:6033` | Galeria Qualidade | `bg-brand-dark` + dark radial | DarkGallery | `_components/dark-gallery.tsx` |
| 6 | `1200:6322` | `1200:6061` | Social Medias | `bg-off-white` | SocialFeed | `_components/social-feed.tsx` |
| 7 | `1200:6346` | `1200:6091` | Seção complementar | `bg-white` | OurHistory | `_components/our-history.tsx` |
| 8 | `1200:6390` | `1200:6112` | Fábrica / Mapa | imagem + dark radial | OurFactory | `_components/our-factory.tsx` |
| 9 | `1200:6401` | `1200:6122` | Footer | `bg-footer` | Footer | `ui/footer.tsx` |

**Assets:**
- Fábrica/mapa: `fill_XD4G8T_b3596ec5.png` (mobile) | `fill_OJJ5Q1_b3596ec5.png` (desktop)
- Mapa satélite: `fill_KULSWW_74ec6dcf.png`
- Galeria (6 fotos): `fill_VC6PCG_79e9d64e.png`, `fill_TZ5X2T_f271b766.png`, e outras

---

## Suporte (`/suporte`)

Desktop: `1200:6454` (1440px) | Mobile: `1200:6785` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | React Component | File |
|---|---|---|---|---|---|---|
| 1 | `1200:6455` | `1200:6786` | Header | `bg-white` | Header | `ui/header.tsx` |
| 2 | `1200:6462` | `1200:6791` | Hero "SOS" | dark radial + imagem | — (inline) | `suporte/page.tsx` |
| 3 | `1200:6471` | `1200:6800` | Cards suporte | `bg-off-white` | — (grid 3 cards) | `suporte/page.tsx` |
| 4 | `1200:6495` | `1200:6822` | Documentação | `bg-white` | — (tabs + lista) | `suporte/page.tsx` |
| 5 | `1200:6592` | `1200:6889` | FAQ | `bg-off-white` | FaqAccordion | `_components/faq-accordion.tsx` |
| 6 | `1200:6646` | `1200:6947` | Formulário contato | `bg-white` | ContactForm | `suporte/_components/contact-form.tsx` |
| 7 | `1200:6722` | `1200:7018` | Footer | `bg-footer` | Footer | `ui/footer.tsx` |

**Detalhes visuais do hero "SOS":**
- Watermark "SOS": `font-sans-condensed font-black uppercase text-watermark-text opacity-[0.08]`
- Tamanho watermark: ~263px desktop / ~151px mobile → `text-[263px]` / `text-[151px]`
- Barra vermelha decorativa: `w-3.5 h-full bg-bar-accent` (14px) — desktop lateral

**Assets suporte:**
- Hero: `fill_SXY62B_51d05531.png`

---

## 404 (`/not-found`)

Desktop: `1200:7086` (1440px) | Mobile: `1200:7151` (375px)

| # | Node Desktop | Node Mobile | Seção | Background | Notas |
|---|---|---|---|---|---|
| 1 | `1200:7087` | `1200:7152` | Header | `bg-white` | padrão |
| 2 | `1200:7094` | `1200:7157` | 404 Content | `bg-off-white` | SVG "404", título, subtítulo |
| 3 | `1200:7099` | `1200:7393` | Footer | `bg-footer` | padrão |

**Detalhes 404:**
- Título: `"página não encontrada"` → `font-sans-condensed font-black text-[50px] uppercase`
- Subtítulo: `text-xl font-sans text-text-subtle-dark`
- SVG 404: `opacity-[0.08] text-[#878787]` 626×301px

---

## Paleta de Backgrounds — Referência Rápida

| Cor Figma | Tailwind | Uso |
|---|---|---|
| `#FFFFFF` | `bg-white` | Header, cards, conteúdo principal |
| `#F5F4F2` | `bg-off-white` | Seções alternadas (FAQ, social, suporte cards) |
| `#F8F8F8` | `bg-[#F8F8F8]` | Área info produto selecionado (único local) |
| `#121212` | `bg-brand-dark` | Seções escuras (Qualidade Inovadora) |
| `#111111` | `bg-footer` | Footer |
| `#DC2626` | `bg-bar-accent` | Barra de stats, RedBanner |
| `#E8132A` | `bg-brand` | CTAs, destaques |
| dark radial gradient | `.bg-gradient-dark-overlay` | Heroes (Produtos, Suporte, Sobre) |
