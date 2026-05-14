---
name: design-fidelity-audit
description: 'Full-site Figma fidelity audit for Stetsom Front. Downloads all page frames (desktop + mobile), performs cross-page divergence analysis with a ranked severity matrix, implements phased corrections, validates with tsc+lint, and exports baseline images. Use for periodic design audits, before major releases, or after big refactors. Trigger keywords: design audit, full design review, fidelity check, design fidelity, figma audit, audit figma, all pages review, full site audit.'
argument-hint: '[source: local|mcp] [optional: specific page slug or "all"]'
---

# Design Fidelity Audit — Full-Site Pass

## Overview

This skill runs a **complete design fidelity cycle** across all Stetsom Front pages against a design source of truth. It is distinct from the lighter `/refine-design` skill (single component) — this one audits every page, produces a cross-site divergence matrix, and drives phased implementation of all corrections.

**Source selector:** Pass `source:mcp` to fetch live data from the Figma MCP, or `source:local` (default) to use cached design reference files in `docs/ia/figma/`.

| Source   | Behavior                                                              | Use case                                  |
| -------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `local`  | Reads `DESIGN_SYSTEM_REFERENCE.md` + `PAGES_REFERENCE.md` + `meta.json` from `docs/ia/figma/`. No MCP calls needed. | Quick audit, offline, no Figma access     |
| `mcp`    | Fetches live Figma data via `mcp_framelink_fig_get_figma_data` + download frames. Slower but authoritative. | Full fidelity pass, before releases       |

---

## Figma Reference (MCP source only)

File key: `huD41oTL0FAa7xsNEK8tAM`

| Page slug             | Desktop nodeId | Mobile nodeId |
| --------------------- | -------------- | ------------- |
| `home`                | `1200:4584`    | `1200:4304`   |
| `produtos`            | `1200:4982`    | `1200:4766`   |
| `produto-selecionado` | `1200:5666`    | `1200:5391`   |
| `sobre`               | `1200:6180`    | `1200:5944`   |
| `suporte`             | `1200:6454`    | `1200:6785`   |
| `404`                 | `1200:7086`    | `1200:7151`   |

---

## When to Use

- Periodic design alignment pass (monthly or before releases)
- After a large batch of component changes
- When visual regression is suspected across multiple pages
- Before/after a Figma file update to identify new divergences
- After any shared component refactor that may ripple across pages

---

## Procedure

### Phase 0 — Baseline Export

**If source is `mcp`:**

Download all page frames to `.raw/figma-design/<page-slug>/` for before/after comparison.

**Tool:** `mcp_framelink_fig_download_figma_images`

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
mcp_framelink_fig_download_figma_images(
  fileKey: "huD41oTL0FAa7xsNEK8tAM",
  nodes: [
    { nodeId: "1200:4584", fileName: "desktop.png", localPath: ".raw/figma-design/home" },
    { nodeId: "1200:4304", fileName: "mobile.png",  localPath: ".raw/figma-design/home" }
  ]
)
```

Repeat for all 6 pages (12 calls total, batched 2 per call = 6 batches).

**If source is `local`:**

Read the existing baselines from `.raw/figma-design/`. They may be stale — note the date from the file timestamps and warn the user.

---

### Phase 1 — Design Token Audit

Read the design token reference and compare against `src/app/globals.css`:

**If source is `mcp`:** Fetch Figma document styles via `mcp_framelink_fig_get_figma_data` on root websiteSection node `1200:4302`.

**If source is `local`:** Read `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md` for token mappings.

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

**If source is `mcp`:** Fetch each component's Figma node for the design reference.

**If source is `local`:** Read `docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md` for component specs.

Key components to audit:

| Component file        | Key checks                                                           |
| --------------------- | -------------------------------------------------------------------- |
| `button.tsx`          | Size heights (sm=h-8/32px, md=h-10/40px, lg=h-12/48px), font, colors |
| `product-card.tsx`    | Border tokens (no hardcoded colors), shadow, badge style             |
| `header.tsx`          | Logo spacing, nav link colors, mobile menu                           |
| `footer.tsx`          | Column layout, link colors, copyright                                |
| `section-label.tsx`   | Typography, color, spacing                                           |
| `navigation-menu.tsx` | Dropdown styles, active state                                        |

Document each divergence in the matrix (Phase 4).

---

### Phase 3 — Page-by-Page Visual Review

For each page, compare implementation against the design reference.

**If source is `mcp`:** Fetch live Figma data via `mcp_framelink_fig_get_figma_data(fileKey, nodeId)` on each page's desktop frame.

**If source is `local`:** Read `docs/ia/figma/PAGES_REFERENCE.md` for per-page section structure and layout specs.

**Inspect code:** Read the page's `page.tsx` and all `_components/` files.

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

### Phase 4 — Divergence Matrix

Compile all findings from Phases 1–3 into a ranked matrix. Present to user before executing any changes.

Format:

```markdown
## Divergence Matrix

| #   | Severity | Page/Component            | Description                                         | Files Affected          |
| --- | -------- | ------------------------- | --------------------------------------------------- | ----------------------- |
| 1   | HIGH     | Home / QualidadeInovadora | Background should be bg-brand-dark, not bg-white    | qualidade-inovadora.tsx |
| 2   | HIGH     | Button                    | md variant height 44px should be h-10 (40px)        | button.tsx              |
| 3   | MED      | Novidades                 | Tabs use rounded pills; Figma shows underline style | novidades.tsx           |

...
```

**Severity criteria:**

- **HIGH**: Wrong brand colors, layout broken vs design, missing entire sections, accessibility failure
- **MED**: Wrong spacing, incorrect typography weight/size, missing responsive behavior, wrong interactive states
- **LOW**: Minor spacing deviations (≤4px), copy/label differences, non-critical icon variants

**Rule:** Present this matrix and ask user to confirm before implementing any changes.

---

### Phase 5 — Phased Corrections

Group findings by page/component and implement in this order:

1. **Foundation first**: Design token fixes in `globals.css` (new tokens, wrong tokens)
2. **Shared components**: `button.tsx`, `product-card.tsx`, shared `ui/` — changes ripple everywhere
3. **Page sections** — implement per-page fixes, most impactful first
4. **Responsive / watermarks** — mobile-specific sizing, decorative elements
5. **Copy / minor polish**

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

### Phase 6 — Final Validation

Run full validation suite:

```bash
pnpm tsc --noEmit    # Must exit 0
pnpm lint            # Must exit 0
pnpm build           # Optional but recommended before PRs
```

If any errors: fix before proceeding to Phase 7.

---

### Phase 7 — Re-export Baseline Images

**If source is `mcp`:** After corrections are implemented, re-download all page frames to update the baseline for future comparisons. Follow the same procedure as Phase 0 — overwrites the before-state images with the new after-state.

**If source is `local`:** Skip this phase — no MCP connection to re-export from.

---

### Phase 8 — Changelog

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
docs/ia/figma/meta.json             ← Figma fileKey + all page node IDs
docs/ia/figma/DESIGN_SYSTEM_REFERENCE.md  ← Local design system cache
docs/ia/figma/PAGES_REFERENCE.md    ← Per-page section breakdown
.raw/figma-design/                  ← Baseline PNG exports
docs/ia/context.json                ← Cross-agent changelog
```

---

## Typical Run Duration

| Phase               | local source                   | mcp source                                   |
| ------------------- | ------------------------------ | -------------------------------------------- |
| 0 — Baseline export | Instant (read existing)        | 6 download batches (2 frames each)           |
| 1 — Token audit     | Fast — read file + grep        | Fast — 1 MCP call + grep                     |
| 2 — Component audit | Fast — read reference file     | 1 MCP call per component (~6 calls)          |
| 3 — Page review     | Fast — read ref per page       | 1 MCP call + code read per page (~6 pages)   |
| 4 — Matrix          | Present to user, await confirm | Present to user, await confirm               |
| 5 — Corrections     | Varies — 2–4 phases            | Varies — 2–4 phases                          |
| 6 — Validation      | 2 commands (tsc + lint)        | 2 commands (tsc + lint)                      |
| 7 — Re-export       | **Skip** (no MCP)              | 6 download batches                           |
| 8 — Changelog       | 1 read + 1 write               | 1 read + 1 write                             |
