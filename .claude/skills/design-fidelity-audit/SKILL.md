---
name: design-fidelity-audit
description: 'Full-site Figma fidelity audit for Stetsom Front. Downloads all page frames (desktop + mobile), performs cross-page divergence analysis with a ranked severity matrix, implements phased corrections, validates with tsc+lint, and exports baseline images. Use for periodic design audits, before major releases, or after big refactors. Trigger keywords: design audit, full design review, fidelity check, design fidelity, figma audit, audit figma, all pages review, full site audit.'
argument-hint: '[source: local|mcp] [optional: specific page slug or "all"]'
---

# Design Fidelity Audit — Full-Site Pass

## Overview

This skill runs a **complete design fidelity cycle** across all Stetsom Front pages against the Figma design. It is distinct from the lighter `/refine-design` skill (single component) — this one audits every page, produces a cross-site divergence matrix, and drives phased implementation of all corrections.

**Data source:** All design data is fetched live from Figma via the Framelink Figma MCP. Local `docs/ia/figma/` files contain only **map and metadata** (node IDs, section order, keywords) — never design definitions (colors, spacing, typography values). They exist solely for rapid orientation: an agent reads them first to know which node IDs to fetch from MCP, avoiding unnecessary traversal.

### Reference Priority

During Phase 0, first consult local docs to know WHAT to fetch from MCP. During visual review, the agent consults references in this order:

0. **`docs/ia/figma/`** — **map & metadata only.** `FIGMA_GRAPH.md` (human-readable section trees, keywords, React component mappings) + `meta.json` (machine-readable node IDs, pageSections order, figmaComponents). Read these FIRST — they give you every node ID you need without any MCP call.
1. **`.raw/figma-design/` exports** — highest fidelity, extracted directly from Figma frames. These are the ground truth for pixel-level visual comparison.
2. **Figma MCP live data** — supplementary structural data (node tree, properties, styles) not visible in the image.
3. **`docs/ia/figma/FIGMA_GRAPH.md`** (re-consulted) — deep-linking keywords and section context during code inspection.

> The `.raw/figma-design/` images take precedence because they capture exact Figma output — colors, spacing, typography, layout, and responsive differences — without interpretation or drift from MCP data.

---

## Figma Reference

File key: `huD41oTL0FAa7xsNEK8tAM`

See `docs/ia/figma/FIGMA_GRAPH.md` for the full node graph (page frames, section trees, and component sets with keywords).

For quick lookup, `docs/ia/figma/meta.json` contains all page/component node IDs in machine-readable format.

| Page slug             | Section node | Desktop nodeId | Mobile nodeId | Keywords |
| --------------------- | ------------ | -------------- | ------------- | -------- |
| `home`                | `1200:4303`  | `1200:4584`    | `1200:4304`   | home, hero, carrossel, novidades, historia, foundations, social |
| `produtos`            | `1200:4765`  | `1200:4982`    | `1200:4766`   | catalogo, filtros, grid, cards |
| `produto-selecionado` | `1200:5390`  | `1200:5666`    | `1200:5391`   | detalhe, breadcrumb, specs, blocks, relacionados |
| `sobre`               | `1200:5943`  | `1200:6180`    | `1200:5944`   | historia, timeline, galeria, foundations, fabrica |
| `suporte`             | `1200:6453`  | `1200:6454`   | `1200:6785`   | sos, documentacao, faq, contato |
| `404`                 | `1200:7085`  | `1200:7086`   | `1200:7151`   | not found, nao encontrado |

**Page sections** (section node → ordered sub-sections): See `meta.json[pageSections]` for every page's ordered section list with node IDs and keywords. This is the canonical source for verifying mock data section order.

**Figma components:** See `meta.json[figmaComponents]` for Button, Card Novidades, Breadcrumb, Accordion, Badge node IDs.

---

## When to Use

- Periodic design alignment pass (monthly or before releases)
- After a large batch of component changes
- When visual regression is suspected across multiple pages
- Before/after a Figma file update to identify new divergences
- After any shared component refactor that may ripple across pages

---

## Procedure

### Phase 0 — Preparation

#### Step 0a — Read Local Figma Map

Before making any MCP calls, read the local map files to get all node IDs and section structure:

```
Read: docs/ia/figma/FIGMA_GRAPH.md   → human-readable section trees, keywords, React component mappings
Read: docs/ia/figma/meta.json        → machine-readable node IDs, pageSections order, figmaComponents
```

This gives you every node ID you need (page frames, section nodes, component sets) without any MCP traffic. Use these IDs in all subsequent phases.

**Do not** treat any value in these files as a design definition — they are purely navigational metadata.

#### Step 0b — Baseline Export

Download all page frames to `.raw/figma-design/<page-slug>/` for before/after comparison.

**Tool:** `Framelink_Figma_MCP_download_figma_images`

Target structure:

```
.raw/figma-design/
  home/
    desktop.png      ← nodeId 1200:4584
    mobile.png       ← nodeId 1200:4304
  produtos/
    desktop.png      ← nodeId 1200:4982
    mobile.png       ← nodeId 1200:4766
  produto-selecionado/
    desktop.png      ← nodeId 1200:5666
    mobile.png       ← nodeId 1200:5391
  sobre/
    desktop.png      ← nodeId 1200:6180
    mobile.png       ← nodeId 1200:5944
  suporte/
    desktop.png      ← nodeId 1200:6454
    mobile.png       ← nodeId 1200:6785
  404/
    desktop.png      ← nodeId 1200:7086
    mobile.png       ← nodeId 1200:7151
```

**IMPORTANT:** Download max 2 frames per tool call to avoid timeouts. Use `localPath` to route each file directly to its target subfolder.

Example call pattern:

```
Framelink_Figma_MCP_download_figma_images(
  fileKey: "huD41oTL0FAa7xsNEK8tAM",
  nodes: [
    { nodeId: "1200:4584", fileName: "desktop.png", localPath: ".raw/figma-design/home" },
    { nodeId: "1200:4304", fileName: "mobile.png",  localPath: ".raw/figma-design/home" }
  ]
)
```

Repeat for all 6 pages (12 calls total, batched 2 per call = 6 batches).

---

### Phase 1 — Design Token Audit

Read the design token reference from `src/app/globals.css` (`@theme inline` block) and compare against Figma via MCP.

Fetch Figma document styles via `Framelink_Figma_MCP_get_figma_data(fileKey="huD41oTL0FAa7xsNEK8tAM", nodeId="1200:4302")` to inspect the root's local styles.

**Check:**

1. All design system color tokens have matching CSS custom properties + `@theme inline` tokens.
2. No hardcoded hex/rgb values exist in TSX/CSS files — run:
   ```
   grep -rn "bg-\[#\|text-\[#\|border-\[#\|style={{ color" src/
   ```
3. Typography tokens: `--font-sans` (Barlow), `--font-sans-condensed` (Barlow Condensed).
4. All Tailwind size utilities use canonical form — no `[Npx]` for h/w/p/m/gap/leading.

Token mapping reference (from reference docs, whichever source):

| Figma value              | Project class                       |
| ------------------------ | ----------------------------------- |
| `#E8132A` / Stetsom Red  | `text-brand` / `bg-brand`           |
| `#121212` / Stetsom Dark | `bg-brand-dark` / `text-brand-dark` |
| `#F5F4F2` / Off White    | `bg-off-white`                      |
| `#F8F8F8`                | `bg-card`                           |
| `#F0F0F0`                | `bg-muted`                          |
| `#565656`                | `text-muted-foreground`             |
| `#666666`                | `text-text-subtle`                  |
| `#B8B8B8`                | `text-text-subtle-dark`             |
| `#1F1F1F`                | `bg-surface-elevated`               |
| `#767676`                | `text-icon-muted`                   |
| Barlow                   | `font-sans`                         |
| Barlow Condensed         | `font-sans-condensed`               |

---

### Phase 2 — Shared Component Audit

For each shared component in `src/components/ui/`, read the code and compare against design intent.

Fetch each component's Figma node (see `meta.json[figmaComponents]` for node IDs, `FIGMA_GRAPH.md` for human-readable keywords) via `Framelink_Figma_MCP_get_figma_data` to inspect variant properties.

Key components to audit:

| Component file        | Key checks                                                           |
| --------------------- | -------------------------------------------------------------------- |
| `button.tsx`          | Size heights (sm=h-8/32px, md=h-10/40px, lg=h-12/48px), font, colors |
| `product-card.tsx`    | Border tokens (no hardcoded colors), shadow, badge style             |
| `header.tsx`          | Logo spacing, nav link colors, mobile menu                           |
| `footer.tsx`          | Column layout, link colors, copyright                                |
| `section-label.tsx`   | Typography, color, spacing                                           |
| `navigation-menu.tsx` | Dropdown styles, active state                                        |

Document each divergence in the matrix (Phase 5).

---

### Phase 3 — Mock Data Audit

Read every mock data file and compare its structure against the Figma map + live Figma data. This phase ensures the mock data that powers dev mode accurately reflects the design intent in section order, content types, and data shapes.

**Procedure:**

#### 3a — Catalog mocks (`src/lib/mock/catalog.ts`)

For each mock data structure, cross-reference against `meta.json[pageSections]` and live Figma data:

| Mock structure                  | Audit against                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `CATALOG_PAGE_PAYLOAD`          | Fetch produtos hero section node `1200:4990` — verify label, watermark ("PRODU") |
| `CATALOG_CATEGORIES` (5 items)  | Check category names/slugs match any Figma category variants; order field        |
| `CATALOG_SUBCATEGORIES`         | Verify parent `category_id` references are valid                                 |
| `CATALOG_PRODUCTS` (14 items)   | Fetch a product detail frame `1200:5674` — verify data fields match schema       |
| `CATALOG_PRODUCT_BLOCKS`        | Fetch block nodes `1200:5805` — verify block types (IMAGE/TEXT/VIDEO/HTML/MODEL3D) match Figma content block composition |
| `CATALOG_PRODUCT_FILES`         | Verify file types (MANUAL/CATALOG/CERTIFICATE/IMAGE/OTHER) match expected schema |

**Key checks:**
- Section order in `CATALOG_PRODUCT_BLOCKS` matches Figma section order from `meta.json[pageSections]["produto-selecionado"]`
- Block types (`type` field) match what Figma actually uses — e.g., does the design include MODEL3D blocks?
- Product `specifications` keys reflect real Stetsom specs (power RMS, impedance, class, etc.)
- Asset paths in `CATALOG_ASSETS` reference real `/figma-assets/` files

#### 3b — Site mocks (`src/lib/mock/site.ts`)

| Mock structure                  | Audit against                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `HOME_HERO_SLIDES` (3 items)    | Fetch hero node `1200:4592` — verify slide count, label/title pattern            |
| `HOME_FEATURED_TABS`            | Fetch novidades node `1200:4600` — verify tab labels match Figma                 |
| `HOME_HISTORY_SECTION`          | Fetch historia node `1200:4630` — verify section structure (stats, dark bg)      |
| `HOME_FEATURED_SECTION`         | Validate `spotlight_product_slug` exists in CATALOG_PRODUCTS                     |
| `SITE_SOCIAL_SECTION`           | Fetch social node `1200:4702` — verify post count and layout match               |
| `ABOUT_VALUES` + `ABOUT_BASES`  | Fetch foundations node `1200:4654` — verify 3-card structure, labels             |
| `ABOUT_TIMELINE` (5 events)     | Fetch timeline node `1200:6237` — verify event count, date format, title style   |
| `SITE_ABOUT_PAYLOAD_BASE`       | Verify assembled payload matches Figma page section order from `meta.json[pageSections]["sobre"]` |

**Key checks:**
- Section order in composite payloads matches `meta.json[pageSections]["home"]` and `["sobre"]` order fields
- Hero slide `href` values point to valid routes
- Timeline dates cover the full Stetsom history span (1989–present)
- Asset paths reference real files in `/figma-assets/`

#### 3c — Support mocks (`src/lib/mock/support.ts`)

| Mock structure                  | Audit against                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `SUPPORT_PAYLOAD.hero`          | Fetch hero node `1200:6462` — verify label, title, watermarkText ("SOS")         |
| `SUPPORT_PAYLOAD.cards` (3)     | Fetch support cards node `1200:6471` — verify 3-card structure, titles match     |
| `SUPPORT_DOCUMENTATION_FILES`   | Fetch docs node `1200:6495` — verify file types and tab labels match Figma       |
| `SUPPORT_FAQ_ITEMS` (6 items)   | Fetch FAQ node `1200:6592` — verify question count, category structure            |
| `SUPPORT_PAYLOAD.contact`       | Fetch contato node `1200:6646` — verify form fields match Figma                  |

**Key checks:**
- FAQ categories in `faqSearch.categories` match Figma tab/filter options
- `watermarkText: "SOS"` matches Figma watermark from hero node
- Card IDs in `SUPPORT_PAYLOAD.cards` match `CARD_ICONS` keys in `suporte/_components/data.ts`

#### 3d — Navigation mocks (`src/lib/mock/navigation.ts`)

Compare against Figma header node `1200:4585`:

- `NAV_LINKS` count and labels match Figma nav items
- `PRODUCT_MENU_CATEGORIES` count (5) and label order match Figma mega-menu structure
- `FOOTER_COLUMNS` (3) and `FOOTER_SOCIALS` (4) match footer node `1200:4713`

#### 3e — Page co-located data files

Compare against respective Figma section nodes:

- `sobre/_components/data.ts` (`ABOUT_STATS`) — fetch sobre hero node `1200:6188`, verify 4 stats with correct values
- `suporte/_components/data.ts` (`CONTACT_DETAILS`, `CARD_ICONS`) — fetch contato node `1200:6646`, verify address/email/phone fields; verify card icon mapping matches card content

#### 3f — Correct mocks that diverge

For every divergence found:

1. Fetch live Figma data via MCP on the relevant section node to confirm
2. Fix the mock data to match Figma
3. If a section exists in Figma but has no corresponding mock, expand the mock file to include it
4. If a mock structure references assets (`/figma-assets/raw/...`), verify the asset actually exists (check `public/figma-assets/`)

**Document all mock findings in the divergence matrix (Phase 5). Mock divergences are at least MED severity** because they affect all pages consuming that data in dev mode.

---

### Phase 4 — Page-by-Page Visual Review

For each page, compare implementation against the design reference using `.raw/figma-design/` images as the primary visual source.

**Visual comparison methodology:**

1. Read the `.raw/figma-design/<page-slug>/desktop.png` image — this is the Figma-exported ground truth for the entire page.
2. Open the corresponding page in the dev server at `localhost:3000`.
3. Take a screenshot of the running page.
4. Compare the active desktop frame from `.raw/figma-design/` side by side with the live page screenshot — identify divergences in colors, spacing, typography, layout, section order, watermarks, and interactive states.
5. Repeat for `.raw/figma-design/<page-slug>/mobile.png` — compare responsive differences.
6. For each divergence, inspect the source code to determine the root cause (wrong token, missing class, wrong component, wrong mock data field).

**Supplementary sources** (consult after image comparison for additional detail):

- Fetch live Figma data via `Framelink_Figma_MCP_get_figma_data(fileKey, nodeId)` on each page's desktop frame to inspect specific node properties, styles, and component structure not visible in the image.
- Consult `docs/ia/figma/FIGMA_GRAPH.md` for quick node ID lookups and section keywords.
- **If `.raw/figma-design/<page-slug>/` is missing** or stale, warn the user.

**Inspect code:** Read the page's `page.tsx` and all `_components/` files. If the page uses mock data, confirm the data was already corrected in Phase 3 before proceeding.

For each page, evaluate these dimensions:

1. **Layout structure** — section order, grid columns, max-width container
2. **Background colors** — section backgrounds (dark/light alternation)
3. **Typography** — font family, weight, size, transform for headings/body/labels
4. **Spacing** — section padding-top/bottom, gaps between elements
5. **Responsive behavior** — does mobile frame differ? Are breakpoints handled?
6. **Interactive components** — tabs, accordions, carousels: correct active/hover styles?
7. **Images & assets** — are images mapped to correct paths?
8. **Watermarks / decorative elements** — background text, overlapping graphics

Pages to audit in order:

1. Home (`src/app/(site)/page.tsx` + `_components/`)
2. Produtos (`src/app/(site)/produtos/page.tsx` + `_components/`)
3. Produto Selecionado (`src/app/(site)/produtos/[slug]/page.tsx` + `_components/`)
4. Sobre (`src/app/(site)/sobre/page.tsx` + `_components/`)
5. Suporte (`src/app/(site)/suporte/page.tsx` + `_components/`)
6. 404 (`src/app/not-found.tsx`)

---

### Phase 5 — Divergence Matrix

Compile all findings from Phases 1–4 into a ranked matrix. Present to user before executing any changes.

Format:

```markdown
## Divergence Matrix

| #   | Severity | Phase Source | Page/Component            | Description                                         | Files Affected          |
| --- | -------- | ------------ | ------------------------- | --------------------------------------------------- | ----------------------- |
| 1   | HIGH     | Token        | globals.css               | Missing --color-brand token                          | globals.css             |
| 2   | HIGH     | Mock         | catalog / hero watermark  | Watermark text "PRODU" vs Figma shows "PRODUTOS"    | src/lib/mock/catalog.ts |
| 3   | MED      | Mock         | site / timeline events    | 5 events in mock; Figma timeline section has 6      | src/lib/mock/site.ts    |
| 4   | HIGH     | Visual       | Home / QualidadeInovadora | Background should be bg-brand-dark, not bg-white    | qualidade-inovadora.tsx |
| 5   | MED      | Visual       | Novidades                 | Tabs use rounded pills; Figma shows underline style | novidades.tsx           |

...
```

**Severity criteria:**

- **HIGH**: Wrong brand colors, layout broken vs design, missing entire sections, accessibility failure, mock data structurally wrong (wrong section count, wrong block types)
- **MED**: Wrong spacing, incorrect typography weight/size, missing responsive behavior, wrong interactive states, mock data missing fields or minor value mismatch
- **LOW**: Minor spacing deviations (≤4px), copy/label differences, non-critical icon variants

**Rule:** Present this matrix and ask user to confirm before implementing any changes.

---

### Phase 6 — Phased Corrections

Group findings by page/component and implement in this order:

1. **Foundation first**: Design token fixes in `globals.css` (new tokens, wrong tokens)
2. **Mock data fixes**: Correct all mock data divergences found in Phase 3 — this ensures dev mode reflects Figma
3. **Shared components**: `button.tsx`, `product-card.tsx`, shared `ui/` — changes ripple everywhere
4. **Page sections** — implement per-page fixes, most impactful first
5. **Responsive / watermarks** — mobile-specific sizing, decorative elements
6. **Copy / minor polish**

**After each phase**, run:

```bash
pnpm tsc --noEmit && pnpm lint
```

Both commands must exit 0 before proceeding to the next phase. Fix any type errors immediately.

**Implementation rules:**

- Server Component by default — `"use client"` only for event handlers/hooks
- Use `cn()` from `@/lib/utils` for conditional classes
- No arbitrary `[#hex]` or `[Npx]` for dimensional properties — use canonical tokens
- Path alias `@/*` → `src/` only (never `@/src/...`)

---

### Phase 7 — Final Validation

Run full validation suite:

```bash
pnpm tsc --noEmit    # Must exit 0
pnpm lint            # Must exit 0
pnpm build           # Optional but recommended before PRs
```

If any errors: fix before proceeding to Phase 8.

---

### Phase 8 — Re-export Baseline Images

After corrections are implemented, re-download all page frames to update the baseline for future comparisons. Follow the same procedure as Phase 0b — overwrites the before-state images with the new after-state.

---

### Phase 9 — Changelog

Append a single entry to `docs/ia/context.json`:

```json
{
  "ts": "<ISO8601 UTC>",
  "agent": "claude-sonnet-4-6",
  "type": "fix",
  "summary": "Design fidelity audit — <N> corrections across <M> pages (source: <local|mcp>)",
  "files": ["<list of modified files>"],
  "rationale": "Periodic design fidelity audit against <source>",
  "outcome": "Visual implementation aligned with design for all <M> pages"
}
```

**Read `docs/ia/context.json` first, then append to the `log` array. Never rewrite the full file from memory.**

---

## Quick Reference — File Locations

```
src/app/(site)/
  page.tsx                          ← Home
  produtos/page.tsx                 ← Produtos listing
  produtos/[slug]/page.tsx          ← Produto detalhe
  sobre/page.tsx                    ← Sobre
  suporte/page.tsx                  ← Suporte
src/app/not-found.tsx               ← 404
src/components/ui/                  ← Shared components
src/app/globals.css                 ← Design tokens (@theme inline)
docs/ia/figma/meta.json             ← MAP ONLY — fileKey + node IDs + pageSections order + kws (machine-readable)
docs/ia/figma/FIGMA_GRAPH.md        ← MAP ONLY — section graphs, keywords, React component mappings (human-readable)
src/lib/mock/catalog.ts             ← Mock catalog data (audited in Phase 3)
src/lib/mock/site.ts                ← Mock site data (audited in Phase 3)
src/lib/mock/support.ts             ← Mock support data (audited in Phase 3)
src/lib/mock/navigation.ts          ← Mock navigation data (audited in Phase 3)
src/lib/mock/admin-cms.ts           ← Mock admin data (audited in Phase 3)
src/app/(site)/sobre/_components/data.ts   ← Co-located about data (audited in Phase 3)
src/app/(site)/suporte/_components/data.ts ← Co-located support data (audited in Phase 3)
.raw/figma-design/                  ← Baseline PNG exports
docs/ia/context.json                ← Cross-agent changelog
```

---

## Typical Run Duration

| Phase                           | Duration                                        |
| ------------------------------- | ----------------------------------------------- |
| 0 — Preparation (map + export)  | Read 2 local files + 6 download batches         |
| 1 — Token audit                 | Fast — 1 MCP call + grep                        |
| 2 — Component audit             | 1 MCP call per component (~6 calls)             |
| 3 — Mock data audit             | Read 7 mock files + ~8 MCP calls                |
| 4 — Page review                 | 1 MCP call + code read per page (~6 pages)      |
| 5 — Matrix                      | Present to user, await confirm                  |
| 6 — Corrections                 | Varies — 2–4 phases                             |
| 7 — Validation                  | 2 commands (tsc + lint)                         |
| 8 — Re-export                   | 6 download batches                              |
| 9 — Changelog                   | 1 read + 1 write                                |
