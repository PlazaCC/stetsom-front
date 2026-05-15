# Stetsom Figma Graph

**File:** Stetsom | CMS
**Link:** https://www.figma.com/design/huD41oTL0FAa7xsNEK8tAM/Stetsom-%7C-CMS
**FileKey:** `huD41oTL0FAa7xsNEK8tAM`
**Website root node:** `1200:4302`

> Use `Framelink_Figma_MCP_get_figma_data(fileKey, nodeId, depth=N)` to inspect nodes.
> Use `Framelink_Figma_MCP_download_figma_images(fileKey, nodes, localPath)` to export frames.

---

## Page Frames (top-level)

| Route | Slug | Section Node | Desktop Frame | Mobile Frame |
|---|---|---|---|---|
| `/` | `home` | `1200:4303` | `1200:4584` | `1200:4304` |
| `/produtos` | `produtos` | `1200:4765` | `1200:4982` | `1200:4766` |
| `/produtos/[slug]` | `produto-selecionado` | `1200:5390` | `1200:5666` | `1200:5391` |
| `/sobre` | `sobre` | `1200:5943` | `1200:6180` | `1200:5944` |
| `/suporte` | `suporte` | `1200:6453` | `1200:6454` | `1200:6785` |
| `/404` | `404` | `1200:7085` | `1200:7086` | `1200:7151` |

---

## Home — Section Graph (`1200:4584`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:4585` | header, nav, logo, garantia button | `Header` |
| 2 | `1200:4592` | hero, carousel, swiper, banners | `HeroCarousel` |
| 3 | `1200:4600` | novidades, featured, products grid, spotlight, tabs | `FeaturedProducts` |
| 4 | `1200:4630` | historia, stats, dark, quality, values | `OurHistory` |
| 5 | `1200:4654` | nossas bases, foundations, 3 cards | `OurFoundations` |
| 6 | `1200:4702` | social, instagram, feed, off-white | `SocialFeed` |
| 7 | `1200:4713` | footer, 4 columns, links | `Footer` |

---

## Produtos — Section Graph (`1200:4982`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:4983` | header | `Header` |
| 2 | `1200:4990` | hero, banner, dark radial, watermark "PRODU" | inline |
| 3 | `1200:4999` | filtros, categories, tabs, border-bottom | `CatalogSidebar` |
| 4 | `1200:5026` | product grid, cards, grade | `ProductCard` |
| 5 | `1200:5338` | footer | `Footer` |

---

## Produto Selecionado — Section Graph (`1200:5666`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:5667` | header | `Header` |
| 2 | `1200:5674` | breadcrumb, product info, bg-F8F8F8 | inline |
| 3 | `1200:5721` | especificacoes, specs table, border-zinc | inline |
| 4 | `1200:5739` | visual highlight, red gradient radial, amp hero | inline |
| 5 | `1200:5805` | content blocks, image, video, text, html, 3d | `BlockRenderer` |
| 6 | `1200:5891` | related products, product cards | `ProductCard` |

---

## Sobre — Section Graph (`1200:6180`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:6181` | header | `Header` |
| 2 | `1200:6188` | hero, dark radial, 1989 watermark, stats grid | inline |
| 3 | `1200:6215` | red banner, marquee, milestones, bar-accent | `RedBanner` |
| 4 | `1200:6237` | timeline, historia, company, checkpoint | `CompanyTimeline` |
| 5 | `1200:6271` | galeria, dark gallery, 6 images, dark radial | `DarkGallery` |
| 6 | `1200:6322` | social, feed, off-white | `SocialFeed` |
| 7 | `1200:6346` | nossas bases, foundations, white, 3 cards | `OurFoundations` |
| 8 | `1200:6390` | fabrica, factory, careers, vagas, map, dark | `OurFactory` |
| 9 | `1200:6401` | footer | `Footer` |

---

## Suporte — Section Graph (`1200:6454`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:6455` | header | `Header` |
| 2 | `1200:6462` | hero, SOS watermark, dark radial, red bar | inline |
| 3 | `1200:6471` | support cards, 3 cards, off-white | inline |
| 4 | `1200:6495` | documentacao, downloads, files, tabs | inline |
| 5 | `1200:6592` | FAQ, accordion, perguntas, off-white | `FaqAccordion` |
| 6 | `1200:6646` | contato, form, formulario, white | `ContactForm` |
| 7 | `1200:6722` | footer | `Footer` |

---

## 404 — Section Graph (`1200:7086`)

| Order | NodeId | Keywords | React Component |
|---|---|---|---|
| 1 | `1200:7087` | header | `Header` |
| 2 | `1200:7094` | 404 content, off-white, SVG 404, not found | inline |
| 3 | `1200:7099` | footer | `Footer` |

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
