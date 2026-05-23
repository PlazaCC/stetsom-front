---
name: design-fidelity-audit
description: 'Full-site Figma fidelity audit for Stetsom Front. Downloads all page frames (desktop + mobile), performs cross-page divergence analysis with a ranked severity matrix, implements phased corrections, validates with tsc+lint, and exports baseline images. Use for periodic design audits, before major releases, or after big refactors. Trigger keywords: design audit, full design review, fidelity check, design fidelity, figma audit, audit figma, all pages review, full site audit.'
argument-hint: '[optional: specific page slug or "all"]'
---

# Design Fidelity Audit — Full-Site Pass

## Overview

This skill runs a **complete design fidelity cycle** across all Stetsom Front pages against the Figma design. It is distinct from the lighter `/refine-design` skill (single component) — this one audits every page, produces a cross-site divergence matrix, and drives phased implementation of all corrections.

### How Local Docs and Figma MCP Work Together

Local `docs/ia/figma/` files are **navigation maps**, not design definitions. They exist so the AI can find the right Figma node IDs instantly, without traversing the full file tree via MCP. The workflow is always:

1. **Read local map** → get node IDs and section order
2. **Fetch from Figma MCP** → get the actual design values (colors, spacing, typography)
3. **Compare against code** → identify divergences

Never treat a value in `meta.json` or `FIGMA_GRAPH.md` as a design specification. They are purely navigational. All authoritative design data comes from live MCP calls and from the `.raw/figma-design/` baseline images.

### Reference Priority During Visual Review

0. **`docs/ia/figma/FIGMA_GRAPH.md`** — read first. Human-readable section trees, keywords, React component mappings, and every node ID organized by page. This is the index that directs all MCP calls.
1. **`docs/ia/figma/meta.json`** — machine-readable companion. `pageSections` for section order; `figmaComponents` for component set node IDs.
2. **`.raw/figma-design/` baseline PNGs** — highest-fidelity visual reference. Ground truth for color, spacing, layout, and responsive differences.
3. **Figma MCP live data** — structural data (node tree, properties, styles) not visible in images. Always use node IDs from step 0/1 when calling MCP.

---

## Figma Reference

**File key:** `huD41oTL0FAa7xsNEK8tAM`
**Website root:** `1090:25874`

See `docs/ia/figma/FIGMA_GRAPH.md` for the full node graph (page frames, section trees, component sets with keywords).
See `docs/ia/figma/meta.json` for the machine-readable version (`pageSections`, `figmaComponents`).

| Page slug             | Section node | Desktop nodeId | Mobile nodeId |
| --------------------- | ------------ | -------------- | ------------- |
| `home`                | `1090:25869` | `1071:10273`   | `1071:9993`   |
| `produtos`            | `1090:25870` | `1071:12220`   | `1071:11704`  |
| `produto-selecionado` | `1090:25871` | `1071:11152`   | `1071:10877`  |
| `sobre`               | `1090:25872` | `1071:11430`   | `1071:9757`   |
| `suporte`             | `1090:25873` | `1071:10546`   | `1071:11920`  |
| `404`                 | `1195:4199`  | `1195:4200`    | `1195:4531`   |

**Page sections** (per-page section node lists): see `meta.json[pageSections]` — ordered arrays with nodeId + keywords for each section. This is the canonical source for verifying section order in both Figma and mock data.

**Figma components:** see `meta.json[figmaComponents]` for Button (`21:210`), Card Novidades (`1034:9979`), Breadcrumb (`74:11593`), Accordion (`890:10459`), Badge (`1036:9869`).

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

#### Step 0a — Read Local Navigation Map

Before making any MCP calls, read both local map files to get all node IDs and section structure:

```
Read: docs/ia/figma/FIGMA_GRAPH.md   → human-readable section trees, keywords, React component mappings
Read: docs/ia/figma/meta.json        → machine-readable node IDs, pageSections order, figmaComponents
```

These two files give you every node ID needed for all subsequent MCP calls. No MCP traversal is required to discover node IDs — they are already here.

#### Step 0b — Baseline Export

Download all page frames to `.raw/figma-design/<page-slug>/` for before/after comparison.

**Tool:** `Framelink_Figma_MCP_download_figma_images`

Target structure:

```
.raw/figma-design/
  home/
    desktop.png      ← nodeId 1071:10273
    mobile.png       ← nodeId 1071:9993
  produtos/
    desktop.png      ← nodeId 1071:12220
    mobile.png       ← nodeId 1071:11704
  produto-selecionado/
    desktop.png      ← nodeId 1071:11152
    mobile.png       ← nodeId 1071:10877
  sobre/
    desktop.png      ← nodeId 1071:11430
    mobile.png       ← nodeId 1071:9757
  suporte/
    desktop.png      ← nodeId 1071:10546
    mobile.png       ← nodeId 1071:11920
  404/
    desktop.png      ← nodeId 1195:4200
    mobile.png       ← nodeId 1195:4531
```

**IMPORTANT:** Download max 2 frames per tool call to avoid timeouts.

Example call pattern:

```
Framelink_Figma_MCP_download_figma_images(
  fileKey: "huD41oTL0FAa7xsNEK8tAM",
  nodes: [
    { nodeId: "1071:10273", fileName: "desktop.png", localPath: ".raw/figma-design/home" },
    { nodeId: "1071:9993",  fileName: "mobile.png",  localPath: ".raw/figma-design/home" }
  ]
)
```

Repeat for all 6 pages (12 calls total, batched 2 per call = 6 batches).

---

### Phase 1 — Design Token Audit

Read `src/app/globals.css` (`@theme inline` block) and compare against Figma via MCP.

Fetch Figma root styles via `get_figma_data(fileKey="huD41oTL0FAa7xsNEK8tAM", nodeId="1090:25874")`.

**Check:**

1. All design system color tokens have matching CSS custom properties + `@theme inline` tokens.
2. No hardcoded hex/rgb values in TSX/CSS files:
   ```
   grep -rn "bg-\[#\|text-\[#\|border-\[#\|style={{ color" src/
   ```
3. Typography tokens: `--font-sans` (Barlow), `--font-sans-condensed` (Barlow Condensed).
4. All Tailwind size utilities use canonical form — no `[Npx]` for h/w/p/m/gap/leading.

Token mapping reference:

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

For each shared component in `src/components/ui/`, read the code and fetch its Figma node via MCP. Node IDs come from `meta.json[figmaComponents]` and `FIGMA_GRAPH.md`.

Key components to audit:

| Component file        | Figma node | Key checks                                                             |
| --------------------- | ---------- | ---------------------------------------------------------------------- |
| `button.tsx`          | `21:210`   | Size heights (sm=h-8, md=h-10, lg=h-12), font, colors                 |
| `product-card.tsx`    | `1034:9979`| Border tokens (no hardcoded colors), shadow, badge style, border-radius|
| `header.tsx`          | `1071:10274`| Logo spacing, nav link colors, Garantia pill button, mobile menu      |
| `footer.tsx`          | `1071:10494`| Column layout, link colors, copyright row                             |
| `section-label.tsx`   | —          | Typography, color, spacing                                             |
| `navigation-menu.tsx` | —          | Dropdown styles, active state                                          |

Document each divergence in the matrix (Phase 5).

---

### Phase 3 — Mock Data Audit

Read every mock data file and compare its structure against `meta.json[pageSections]` and live Figma data. This ensures dev mode accurately reflects design intent in section order, content types, and data shapes.

Use node IDs from `meta.json[pageSections]` to make targeted MCP calls — never traverse the whole file.

#### 3a — Catalog mocks (`src/lib/mock/catalog.ts`)

| Mock structure                  | Figma node to fetch (from meta.json) | What to verify |
| ------------------------------- | ------------------------------------ | -------------- |
| `CATALOG_PAGE_PAYLOAD`          | Hero `1071:12229`                    | label, watermark text ("PRODU") |
| `CATALOG_CATEGORIES` (5 items)  | Categories `1239:4723`               | category names/slugs match Figma; order field |
| `CATALOG_PRODUCTS` (14 items)   | Product info `1071:11161`            | data fields match schema |
| `CATALOG_PRODUCT_BLOCKS`        | Blocks `1071:11226`                  | block types (IMAGE/TEXT/VIDEO/HTML/MODEL3D) |
| `CATALOG_PRODUCT_FILES`         | —                                    | file types (MANUAL/CATALOG/CERTIFICATE) |

#### 3b — Site mocks (`src/lib/mock/site.ts`)

| Mock structure                  | Figma node to fetch (from meta.json) | What to verify |
| ------------------------------- | ------------------------------------ | -------------- |
| `HOME_HERO_SLIDES` (3 items)    | Hero `1071:10282`                    | slide count, label/title pattern |
| `HOME_FEATURED_TABS`            | Novidades `1071:10290`               | tab labels match Figma |
| `HOME_HISTORY_SECTION`          | Historia `1071:10411`                | stats, dark bg, section structure |
| `SITE_SOCIAL_SECTION`           | Social `1071:10483`                  | post count and layout |
| `ABOUT_VALUES` + `ABOUT_BASES`  | Foundations `1071:10435`             | 3-card structure, labels |
| `ABOUT_TIMELINE` (5+ events)    | Timeline `1071:11488`                | event count, date format |

#### 3c — Support mocks (`src/lib/mock/support.ts`)

| Mock structure                  | Figma node to fetch (from meta.json) | What to verify |
| ------------------------------- | ------------------------------------ | -------------- |
| `SUPPORT_PAYLOAD.hero`          | Hero `1071:10555`                    | label, title, watermarkText ("SOS") |
| `SUPPORT_PAYLOAD.cards` (3)     | Support cards `1071:10564`           | 3-card structure, titles |
| `SUPPORT_DOCUMENTATION_FILES`   | Docs `1071:10717`                    | file types and tab labels |
| `SUPPORT_FAQ_ITEMS`             | FAQ `1071:10663`                     | question count, category structure |
| `SUPPORT_PAYLOAD.contact`       | Contact `1071:10588`                 | form fields |
| FAQ accordion                   | Accordion `1071:10814`               | accordion section structure |

#### 3d — Navigation mocks (`src/lib/mock/navigation.ts`)

Compare against Figma header node `1071:10274`:

- `NAV_LINKS` count and labels match Figma nav items
- `PRODUCT_MENU_CATEGORIES` count and label order match Figma mega-menu
- `FOOTER_COLUMNS` (3) and `FOOTER_SOCIALS` (4) match footer node `1071:10494`

#### 3e — Correct mocks that diverge

For every divergence found:

1. Fetch live Figma data via MCP on the relevant section node to confirm
2. Fix the mock to match Figma
3. If a section exists in Figma but has no mock, expand the mock file
4. If a mock references assets, verify the file exists in `public/figma-assets/`

**Document all mock findings in the divergence matrix (Phase 5). Mock divergences are at least MED severity.**

---

### Phase 4 — Page-by-Page Visual Review

For each page, compare implementation against `.raw/figma-design/` baseline images and supplementary MCP data.

**Methodology:**

1. Read `.raw/figma-design/<page-slug>/desktop.png` — Figma-exported ground truth.
2. Open the page at `localhost:3000` and take a screenshot.
3. Compare side by side — identify divergences in colors, spacing, typography, layout, section order, watermarks.
4. Repeat for `mobile.png`.
5. For each divergence, inspect source code to find the root cause.
6. Fetch live Figma data via MCP (using node IDs from `FIGMA_GRAPH.md`) for properties not visible in images.

**If `.raw/figma-design/<page-slug>/` is missing or stale**, warn the user before continuing.

**Inspect code:** Read the page's `page.tsx` and all `_components/`. Confirm mock data was corrected in Phase 3 before comparing.

For each page evaluate:

1. **Layout structure** — section order, grid columns, max-width container
2. **Background colors** — dark/light alternation matching Figma
3. **Typography** — font family, weight, size, transform
4. **Spacing** — section padding, element gaps
5. **Responsive behavior** — mobile frame differences, breakpoints
6. **Interactive components** — tabs, accordions, carousels: active/hover styles
7. **Images & assets** — correct paths
8. **Watermarks / decorative elements** — background text, overlapping graphics

Pages to audit (in order):

1. Home (`src/app/(site)/page.tsx` + `_components/`)
2. Produtos (`src/app/(site)/produtos/page.tsx` + `_components/`)
3. Produto Selecionado (`src/app/(site)/produtos/[slug]/page.tsx` + `_components/`)
4. Sobre (`src/app/(site)/sobre/page.tsx` + `_components/`)
5. Suporte (`src/app/(site)/suporte/page.tsx` + `_components/`)
6. 404 (`src/app/not-found.tsx`)

---

### Phase 5 — Divergence Matrix

Compile all findings from Phases 1–4 into a ranked matrix. Present to user before executing any changes.

```markdown
## Divergence Matrix

| #   | Severity | Phase Source | Page/Component            | Description                                         | Files Affected          |
| --- | -------- | ------------ | ------------------------- | --------------------------------------------------- | ----------------------- |
| 1   | HIGH     | Token        | globals.css               | Missing --color-brand token                          | globals.css             |
| 2   | HIGH     | Mock         | catalog / hero watermark  | Watermark text "PRODU" vs Figma shows "PRODUTOS"    | src/lib/mock/catalog.ts |
| 3   | MED      | Mock         | site / timeline events    | 5 events in mock; Figma timeline section has 6      | src/lib/mock/site.ts    |
| 4   | HIGH     | Visual       | Home / OurHistory         | Background should be bg-brand-dark, not bg-white    | our-history.tsx         |
| 5   | MED      | Visual       | Novidades                 | Tabs use rounded pills; Figma shows underline style | featured-tab-strip.tsx  |
```

**Severity criteria:**

- **HIGH**: Wrong brand colors, layout broken vs design, missing entire sections, accessibility failure, mock data structurally wrong
- **MED**: Wrong spacing, incorrect typography weight/size, missing responsive behavior, wrong interactive states, mock data minor mismatch
- **LOW**: Minor spacing deviations (≤4px), copy differences, non-critical icon variants

**Rule:** Present this matrix and ask user to confirm before implementing any changes.

---

### Phase 6 — Phased Corrections

Group findings by page/component and implement in this order:

1. **Foundation first**: Design token fixes in `globals.css`
2. **Mock data fixes**: Correct all mock data divergences — ensures dev mode reflects Figma
3. **Shared components**: `button.tsx`, `product-card.tsx`, `ui/` — changes ripple everywhere
4. **Page sections**: implement per-page fixes, most impactful first
5. **Responsive / watermarks**: mobile-specific sizing, decorative elements
6. **Copy / minor polish**

**After each phase**, run:

```bash
pnpm tsc --noEmit && pnpm lint
```

Both must exit 0 before proceeding. Fix type errors immediately.

**Implementation rules:**

- Server Component by default — `"use client"` only for event handlers/hooks
- Use `cn()` from `@/lib/utils` for conditional classes
- No arbitrary `[#hex]` or `[Npx]` for dimensional properties — use canonical tokens
- Path alias `@/*` → `src/` only (never `@/src/...`)

---

### Phase 7 — Final Validation

```bash
pnpm tsc --noEmit    # Must exit 0
pnpm lint            # Must exit 0
pnpm build           # Optional but recommended before PRs
```

Fix all errors before proceeding to Phase 8.

---

### Phase 8 — Re-export Baseline Images

Re-download all page frames to update the `.raw/figma-design/` baseline. Same procedure as Phase 0b — overwrites before-state images with after-state.

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
docs/ia/figma/FIGMA_GRAPH.md        ← MAP: section graphs, keywords, React component mappings
docs/ia/figma/meta.json             ← MAP: fileKey + node IDs + pageSections + figmaComponents
src/lib/mock/catalog.ts             ← Mock catalog data
src/lib/mock/site.ts                ← Mock site data
src/lib/mock/support.ts             ← Mock support data
src/lib/mock/navigation.ts          ← Mock navigation data
.raw/figma-design/                  ← Baseline PNG exports (ground truth for visual comparison)
```

---

## Typical Run Duration

| Phase                           | Duration                                    |
| ------------------------------- | ------------------------------------------- |
| 0 — Preparation (map + export)  | Read 2 local files + 6 download batches     |
| 1 — Token audit                 | Fast — 1 MCP call + grep                   |
| 2 — Component audit             | 1 MCP call per component (~6 calls)         |
| 3 — Mock data audit             | Read 4 mock files + ~8 MCP calls            |
| 4 — Page review                 | 1 MCP call + code read per page (~6 pages)  |
| 5 — Matrix                      | Present to user, await confirm              |
| 6 — Corrections                 | Varies — 2–4 phases                         |
| 7 — Validation                  | 2 commands (tsc + lint)                     |
| 8 — Re-export                   | 6 download batches                          |
