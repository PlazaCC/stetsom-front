# Stetsom Figma Graph

**File:** Stetsom | CMS
**Link:** https://www.figma.com/design/huD41oTL0FAa7xsNEK8tAM/Stetsom-%7C-CMS?node-id=1090-25874
**FileKey:** `huD41oTL0FAa7xsNEK8tAM`
**Website root node:** `1090:25874`

> Use `get_figma_data(fileKey="huD41oTL0FAa7xsNEK8tAM", nodeId="<nodeId>", depth=N)` to inspect nodes.
> Use `download_figma_images(fileKey, nodes, localPath)` to export frames.

---

## Page Frames (top-level)

| Route | Slug | Section Node | Desktop Frame | Mobile Frame |
|---|---|---|---|---|
| `/` | `home` | `1090:25869` | `1071:10273` | `1071:9993` |
| `/produtos` | `produtos` | `1090:25870` | `1071:12220` | `1071:11704` |
| `/produtos/[slug]` | `produto-selecionado` | `1090:25871` | `1071:11152` | `1071:10877` |
| `/sobre` | `sobre` | `1090:25872` | `1071:11430` | `1071:9757` |
| `/suporte` | `suporte` | `1090:25873` | `1071:10546` | `1071:11920` |
| `/404` | `404` | `1195:4199` | `1195:4200` | `1195:4531` |

---

## Home — Section Graph (`1071:10273`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1071:10274` | header, nav, logo, garantia button | `Header` |
| 2 | `1071:10282` | hero, carousel, swiper, banners | `HeroCarousel` |
| 3 | `1071:10290` | novidades, featured, products grid, spotlight, tabs | `FeaturedProducts` |
| 4 | `1071:10411` | historia, stats, dark, quality, values | `OurHistory` |
| 5 | `1071:10435` | social, instagram, feed, 5 images, white background | `SocialFeed` |
| 6 | `1071:10483` | faq, perguntas frequentes, accordion, off-white, falar com suporte | `Faq` |
| 7 | `1071:10494` | footer, 4 columns, links | `Footer` |

---

## Produtos — Section Graph (`1071:12220`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1071:12221` | header | `Header` |
| 2 | `1071:12229` | hero, banner, dark radial, watermark "PRODU" | inline |
| 3 | `1239:4723` | filtros, categories, tabs, border-bottom | `CatalogSidebar` |
| 4 | `1071:12265` | product grid, cards, grade | `ProductCard` |
| 5 | `1071:12577` | footer | `Footer` |

---

## Produto Selecionado — Section Graph (`1071:11152`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1071:11153` | header | `Header` |
| 2 | `1071:11161` | breadcrumb, product info, bg-F8F8F8 | inline |
| 3 | `1071:11208` | especificacoes, specs table, visual highlight, red gradient radial | inline |
| 4 | `1071:11226` | content blocks, image, video, text, html, 3d | `BlockRenderer` |
| 5 | `1071:11292` | related products, product cards | `ProductCard` |
| 6 | `1071:11378` | footer | `Footer` |

---

## Sobre — Section Graph (`1071:11430`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1071:11431` | header | `Header` |
| 2 | `1071:11439` | hero, dark radial, 1989 watermark, stats grid | inline |
| 3 | `1071:11466` | red banner, marquee, milestones, bar-accent | `RedBanner` |
| 4 | `1071:11488` | quality, qualidade inovadora, 2-col, image left, values right, dark | `QualitySection` |
| 5 | `1071:11522` | timeline, historia, 35 anos, checkpoint, dark radial | `CompanyTimeline` |
| 6 | `1071:11573` | social, feed, off-white | `SocialFeed` |
| 7 | `1071:11597` | nossas bases, foundations, white, 3 cards | `OurFoundations` |
| 8 | `1071:11641` | fabrica, factory, careers, vagas, map, dark | `OurFactory` |
| 9 | `1071:11652` | footer | `Footer` |

---

## Suporte — Section Graph (`1071:10546`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1071:10547` | header | `Header` |
| 2 | `1071:10555` | hero, SOS watermark, dark radial, red bar | inline |
| 3 | `1071:10564` | support cards, 3 cards, off-white | inline |
| 4 | `1071:10717` | download de materiais, documentacao, files, white | inline |
| 5 | `1071:10663` | postos autorizados, map, service centers, cep search, off-white | inline |
| 6 | `1071:10588` | contato, form, formulario, white | `ContactForm` |
| 7 | `1071:10814` | FAQ accordion, perguntas frequentes, off-white | inline |
| 8 | `1071:10825` | footer | `Footer` |

---

## 404 — Section Graph (`1195:4200`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1195:4201` | header | `Header` |
| 2 | `1195:4338` | 404 content, off-white, SVG 404, not found | inline |
| 3 | `1195:4479` | footer | `Footer` |

---

## Figma Components

| Name | ComponentSet Node | Keywords |
|---|---|---|
| Button | `21:210` | button, cta, primary, secondary, pill, ghost, outline |
| Card Novidades | `1034:9979` | product card, novidades, big (447x447), small |
| Breadcrumb | `74:11593` | breadcrumb, navigacao, path |
| Accordion | `890:10459` | accordion, faq, expand, collapse |
| Badge | `1036:9869` | badge, tag, rms, label |

---

## How to Use This Graph

1. Find the page slug matching your route
2. Get the Desktop/Mobile nodeId from the top table
3. Fetch live Figma data: `get_figma_data(fileKey="huD41oTL0FAa7xsNEK8tAM", nodeId="<nodeId>", depth=3)`
4. The section graph shows each section's nodeId and relevant keywords
5. Cross-reference keywords with component names in the codebase
6. For components, use the ComponentSet node to fetch variant definitions
