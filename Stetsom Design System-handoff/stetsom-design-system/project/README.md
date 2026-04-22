# Stetsom Design System

## Company Overview

**Stetsom** is a Brazilian automotive audio brand with 35+ years in the market. They design and manufacture high-performance amplifiers, subwoofers, and car audio equipment. Key stats: 200+ products, 60+ export countries, 1M+ units sold.

The brand speaks to serious audio professionals and enthusiasts — people who take sound quality seriously. The tone is bold, authoritative, and performance-oriented.

**Language:** Portuguese (Brazilian)  
**Industry:** Automotive audio / car electronics

---

## Sources

- **Figma File:** `Stetsom _ CMS.fig` (mounted as virtual filesystem)
  - Focus pages: `/Final-Website` → `/Final-Website/Website`
  - Pages include: Home, Produtos, Produto Selecionado, Sobre, Suporte
- **Font uploads:** Barlow & Barlow Condensed families (full weight range)

---

## Content Fundamentals

### Language & Tone
- **Portuguese (Brazilian)** throughout all copy
- **ALL CAPS** for headlines, section labels, and CTAs — a core brand pattern
- **Direct and confident** — no fluff, no softening language
- **Performance-first** copy: e.g. "ALTA POTÊNCIA", "SEMPRE PRIMEIRA NA POTÊNCIA", "CONHEÇA A PRATICIDADE"
- Section labels use a red horizontal line prefix marker + ALL CAPS category label (e.g. `— NOVIDADES`, `— NOSSA HISTÓRIA`, `— DÚVIDAS`)
- Numbers used proudly as proof: "35+ ANOS DE MERCADO", "200+ PRODUTOS", "60+ PAÍSES DE EXPORTAÇÃO", "1M+ UNIDADES VENDIDAS"
- CTAs are short and action-driven: "Garantia", "Conheça mais", "Ver todos", "Seguir no instagram"
- **No emoji** used anywhere in the design
- Body copy is in sentence case; only headlines and labels go ALL CAPS
- Subtitle/label text uses Barlow Condensed at small size in brand red

### Voice Examples
- "Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo."
- "Cada produto é projetado para quem leva o som a sério."
- "Participe da comunidade de profissionais do áudio."
- "Não encontrou o que procura? Entre em contato com nosso suporte."

---

## Visual Foundations

### Colors
| Token | Value | Usage |
|---|---|---|
| `--red` | `rgb(232, 19, 42)` | Primary brand accent — CTAs, labels, icons, borders |
| `--black` | `rgb(9, 9, 11)` | Deep background, text |
| `--dark` | `rgb(18, 18, 18)` | Dark section backgrounds |
| `--dark-2` | `rgb(24, 24, 27)` | Card/component dark fill |
| `--gray-900` | `rgb(44, 44, 44)` | Secondary dark fill |
| `--gray-800` | `rgb(54, 54, 54)` | Borders on dark |
| `--gray-700` | `rgb(86, 86, 86)` | Muted text on dark |
| `--gray-600` | `rgb(102, 102, 102)` | Body text on light |
| `--gray-500` | `rgb(113, 113, 122)` | Placeholder/secondary |
| `--gray-400` | `rgb(133, 133, 133)` | Disabled states |
| `--gray-300` | `rgb(184, 184, 184)` | Body text on dark bg |
| `--gray-200` | `rgb(217, 217, 217)` | Borders on light bg |
| `--gray-100` | `rgb(241, 241, 241)` | Light bg for tabs |
| `--off-white` | `rgb(245, 244, 242)` | FAQ/alternate section bg |
| `--white` | `rgb(255, 255, 255)` | Primary light background, text on dark |

### Typography

**Display font:** Barlow Condensed — used for ALL headlines, section titles, labels (ALL CAPS)
- Black (900) — hero titles, massive display text at 60–90px
- Bold (700) — subsection headings at 40px
- ExtraBold (800) — accent headlines
- Medium (500) — category labels at 16px
- Regular (400) — supporting display text

**Body font:** Barlow — used for body copy, stats labels, nav
- SemiBold (600) — navigation items, table headers
- Medium (500) — sub-labels, captions, nav links
- Regular (400) — body paragraphs at 14–18px
- Bold (700) — emphasis body text

**Type Scale:**
- Hero: Barlow Condensed Black, 90px, ALL CAPS
- H1: Barlow Condensed Bold, 60px, ALL CAPS  
- H2: Barlow Condensed Bold, 40px, ALL CAPS
- H3: Barlow Condensed Medium, 30px, ALL CAPS
- Section Label: Barlow Condensed Medium, 16px, ALL CAPS, brand red
- Body Large: Barlow Regular, 18px
- Body: Barlow Regular, 16px
- Body Small: Barlow Regular, 14px
- Caption: Barlow Medium, 12px
- Stat Number: Barlow Condensed Bold, 40px, white on dark
- Stat Label: Barlow Medium, 14px, gray on dark

### Backgrounds & Layout
- **Light sections:** Pure white `#fff` with `170px` horizontal padding (1440px container)
- **Dark sections:** `rgb(18,18,18)` — used for "Nossa História" strip, footer, product hero
- **Off-white sections:** `rgb(245,244,242)` — FAQ, neutral content areas
- **Full-bleed imagery:** Hero sections use full-width images (1440px), no rounded corners
- **Horizontal padding:** 170px on desktop (creating a 1100px content column)
- **Max content width:** 1440px desktop, 375px mobile

### Section Label Pattern
Every section starts with a red horizontal line (`24px wide`, `1px thick`) + ALL CAPS category label in brand red at 16px Barlow Condensed. This is a core visual motif throughout the site.

### Cards & Components
- **Product cards:** White bg, subtle border `rgb(217,217,217)`, very light border radius ~8px
- **Hero image containers:** 0 border radius — full bleed or flush edges
- **Tab/pill pills:** `rgb(241,241,241)` bg, 8px radius, selected state with white pill
- **Buttons (Primary):** Solid fill, no border radius visible at 40px height — appears square/sharp
- **Buttons (Outline):** Border style for secondary actions

### Spacing
- Section vertical padding: `48px` top/bottom
- Component gap: `24px` standard, `16px` tight, `8px` compact
- Grid gap: `20–24px`

### Animation & Interaction
- No complex animations observed in static Figma designs
- Image carousels use dot-pill indicators (pill shape, gray/white)
- Hover states not explicitly defined in static designs but expected on nav links and cards
- Buttons likely darken on hover (standard pattern)

### Corner Radii
- Cards/containers: `8px` or none (flush)
- Pills/tabs: `90px` (fully rounded)
- Product image containers: `~20px` (generous rounding for product gallery cards)
- Buttons: Very small or none — sharp, industrial feel

### Shadows
- Light drop shadow on text in dark sections: `0px 0px 4.8px rgba(0,0,0,0.25)`
- Image shadow in product cards: `0px 8.5px 14.4px rgba(0,0,0,0.5)`
- General component shadow: `0px 0px 6.2px rgba(0,0,0,0.5)`

### Imagery
- **Product photography:** High contrast, dramatic lighting, dark backgrounds
- **Background images:** Full-bleed, dark-toned automotive/speaker imagery
- **Color grade:** Cool/neutral to dark — no warm tones
- **No illustrations** — photography only

---

## Iconography

### Approach
- **Lucide Icons** CDN-linked (`lucide.dev`) — used throughout the CMS and UI
- Icon stroke color matches context: white on dark, gray on light, red for actions
- Icon size: typically `24×24px` in nav/actions, `16×16px` inline
- No custom icon font — all Lucide SVG instances
- No emoji used as icons

### Key Icons Used
- `plus`, `x` (close) — most common
- `timer`, `image`, `house`, `square-stack`, `app-window`, `library-big` — CMS sidebar
- `search`, `sliders-horizontal` — product filtering
- `play` — video/media
- `chevrons-up-down` — dropdown indicators
- `arrow-right` — CTAs

### Assets Available
- `assets/logo.png` — Stetsom wordmark/logo (158×35px)
- `assets/about-bg.png` — team/factory photo for "Nossa História" section
- `assets/brand-image.png` — brand imagery
- `assets/produtos-hero.png` — products page dark hero background
- `assets/product-image.png` — amplifier product photo
- `assets/product-image-2.png` — product photo variant

---

## File Index

```
README.md                    ← this file
SKILL.md                     ← agent skill definition
colors_and_type.css          ← CSS custom properties (colors + typography)
fonts/                       ← Barlow + Barlow Condensed TTF files
assets/
  logo.png                   ← Stetsom logo
  about-bg.png               ← "Nossa História" section background
  brand-image.png            ← brand photography
  produtos-hero.png          ← products page hero bg
  product-image.png          ← amplifier product photo
  product-image-2.png        ← product photo variant
  icons/                     ← SVG icon assets
preview/
  colors-brand.html          ← Brand color palette swatches
  colors-semantic.html       ← Semantic/surface color tokens
  type-display.html          ← Display type specimens
  type-body.html             ← Body type specimens
  spacing-tokens.html        ← Spacing & radius tokens
  components-buttons.html    ← Button components
  components-cards.html      ← Card components
  components-nav.html        ← Navigation components
  components-section-label.html ← Section label pattern
ui_kits/
  website/
    index.html               ← Interactive website prototype
    Nav.jsx                  ← Navigation component
    Hero.jsx                 ← Hero section
    SectionLabel.jsx         ← Section label pattern
    ProductCard.jsx          ← Product card component
    Footer.jsx               ← Footer component
```
