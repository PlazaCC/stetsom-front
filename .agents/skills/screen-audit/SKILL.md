---
name: screen-audit
description: 'Audits screens/flows against Figma for completeness, correctness and consistency. Accepts any scope: a specific screen name, area ("cms", "admin", "website", "produtos"), or nothing (audits everything). Produces a ranked divergence matrix of missing flows, wrong fields, incorrect columns, broken UX, data model mismatches. Always presents the matrix to the user BEFORE implementing anything. Trigger keywords: screen audit, tela audit, audit screens, audit cms, audit website, audit flows, fluxo faltando, tela errada, validar telas, revisar telas, checar telas, missing screens, screen review, ux audit.'
argument-hint: '[optional scope: "cms" | "website" | "produtos" | screen name | "all" | leave empty = all]'
---

# Screen Audit — Completeness & Correctness

## Overview

This skill performs a **deep screen-level audit** across any scope of the Stetsom Front codebase, comparing the current implementation against the Figma design. It focuses on:

- **Completeness** — are all screens from Figma implemented?
- **Correctness** — do form fields, table columns, flows and navigation match Figma exactly?
- **Consistency** — are shared components (data tables, forms, sidebar, step indicators) used correctly?
- **Data model alignment** — do mock data and TypeScript types match what the screens actually need?

The output is a **ranked divergence matrix** presented to the user for approval before any code is touched.

---

## Scope Resolution

The `ARGUMENTS` field drives scope. Interpret it as broadly as needed:

| Input | Scope |
|---|---|
| *(empty)* | Audit **all** screens — CMS admin + public website |
| `cms` / `admin` | Audit only `src/app/admin/**` screens |
| `website` / `site` | Audit only `src/app/(site)/**` screens |
| `produtos` / `products` | Audit product-related screens (catalog + admin produto wizard) |
| Screen name (e.g. `banners`, `biblioteca`) | Audit that specific screen and any related sub-flows |
| `all` | Same as empty — audit everything |

When in doubt, err on the side of **larger scope**. A missed screen is worse than an extra pass.

---

## Phase 0 — Load Navigation Maps

Before any MCP or file reads, load the two local Figma navigation files:

```
Read: docs/ia/figma/FIGMA_GRAPH.md   → section trees, node IDs, React component mappings
Read: docs/ia/figma/meta.json        → pageSections, figmaComponents, cmsPages node IDs
```

These are **navigation maps only** — never treat values here as design specifications.
All authoritative design data comes from live Figma MCP calls and `.raw/figma-design/` baseline images.

**Key node references from `meta.json`:**

Public website pages:
- home desktop: `1071:10273`, mobile: `1071:9993`
- produtos desktop: `1071:12220`, mobile: `1071:11704`
- produto-selecionado desktop: `1071:11152`, mobile: `1071:10877`
- sobre desktop: `1071:11430`, mobile: `1071:9757`
- suporte desktop: `1071:10546`, mobile: `1071:11920`
- 404: `1195:4200`

CMS admin screens (from `meta.json[cmsPages]`):
- login, dashboard, produtos-lista, wizard step 1–4
- banners-lista, banners-registrar
- biblioteca-fotos, biblioteca-manuais, biblioteca-3d
- mensagens-lista, historico

---

## Phase 1 — Enumerate Figma Screens

Fetch the CMS and/or site frames from Figma to get the authoritative list of screens that **should** exist.

Use `mcp__Framelink_Figma_MCP__download_figma_images` or `mcp__Framelink_Figma_MCP__get_figma_data` with node IDs from `meta.json`.

**IMPORTANT:** Max 2 frames per MCP call to avoid timeouts. Batch calls accordingly.

For each screen found in Figma, record:
- Screen name / route
- Expected navigation entry (sidebar link, breadcrumb, etc.)
- Key UI elements: columns, form fields, filters, tabs, buttons, modals
- Data displayed: what entity fields are shown

---

## Phase 2 — Enumerate Implemented Screens

Read the filesystem to find what is currently implemented:

```bash
# CMS admin screens
ls src/app/admin/

# Public site screens  
ls src/app/(site)/

# Shared admin components
ls src/app/admin/_components/
ls src/app/admin/_components/crud/
```

For each screen found in code, read the source file and extract:
- Route path
- Title / icon
- Table columns or form fields present
- Tabs, modals, drawers used
- Filters, search, pagination
- Navigation links in sidebar or breadcrumb
- Mock data source used

Read these files as needed (based on scope):

**CMS screens:**
- `src/app/admin/page.tsx` — dashboard
- `src/app/admin/login/page.tsx`
- `src/app/admin/produtos/page.tsx` — product list
- `src/app/admin/produtos/novo/page.tsx` — wizard create
- `src/app/admin/produtos/[id]/page.tsx` — wizard edit
- `src/app/admin/_components/product-wizard.tsx` — wizard orchestrator
- `src/app/admin/_components/product-wizard-step1.tsx` — step 1
- `src/app/admin/_components/product-wizard-step-specs.tsx` — step 2
- `src/app/admin/_components/product-wizard-step-files.tsx` — step 3
- `src/app/admin/_components/product-wizard-step-publish.tsx` — step 4
- `src/app/admin/banners/page.tsx`
- `src/app/admin/biblioteca/page.tsx`
- `src/app/admin/mensagens/page.tsx`
- `src/app/admin/historico/page.tsx`
- `src/app/admin/paginas/page.tsx`
- `src/app/admin/configuracoes/page.tsx`
- `src/app/admin/usuarios/page.tsx`
- `src/app/admin/_components/admin-sidebar.tsx`
- `src/lib/api/contracts.ts` — type definitions
- `src/lib/mock/admin-cms.ts` — mock data

**Public site screens:**
- `src/app/(site)/page.tsx` + `_components/`
- `src/app/(site)/produtos/page.tsx` + `_components/`
- `src/app/(site)/produtos/[slug]/page.tsx` + `_components/`
- `src/app/(site)/sobre/page.tsx` + `_components/`
- `src/app/(site)/suporte/page.tsx` + `_components/`
- `src/app/not-found.tsx`

---

## Phase 3 — Compare: Screen by Screen

For each screen in scope, perform a structured comparison between Figma and implementation.

### 3a — Existence Check
- Is the screen implemented at all? (MISSING → HIGH severity)
- Does the route exist and is it reachable from the sidebar/navigation?

### 3b — Navigation Check
- Is the screen linked in the sidebar / nav?
- Does the link label match Figma exactly?
- Is the icon correct?

### 3c — Structure Check

For **list screens** (tables):
- Column count and labels match?
- Column order matches Figma?
- Missing columns (thumbnail, badges, date ranges, flags)?
- Extra columns not in Figma?
- Filters: are all filter chips/dropdowns present?
- Search: present and working?
- Pagination: correct?
- Empty state: message and CTA match?

For **form/wizard screens**:
- Step count matches?
- Step labels match?
- All form fields present?
- Field types correct (radio vs dropdown, text vs date)?
- Field labels match Figma exactly?
- Validation / required indicators?
- Photo/file upload zones present?
- Preview panels?
- Action buttons: labels, placement, disabled states?

For **detail/view screens**:
- All data sections present?
- Section order matches Figma?
- Typography / label styles consistent?

For **modal/drawer screens**:
- Triggered from correct action?
- Correct type (modal overlay vs full-page vs drawer)?
- Fields match Figma?

### 3d — Data Model Check
- Does the TypeScript type in `contracts.ts` have all fields the screen needs?
- Does the mock in `admin-cms.ts` or `catalog.ts` populate all fields?
- Are computed fields (e.g., `action_sentence`, `languages`, `is_published`) present?

### 3e — Interaction Check
- Status toggles working?
- Tab switching implemented?
- Drag-to-reorder (if Figma shows it)?
- Copy-to-clipboard (if Figma shows it)?
- Open/close modals and drawers?

---

## Phase 4 — Check Shared Components

Audit the shared admin CRUD components for consistency:

| Component | What to check |
|---|---|
| `admin-sidebar.tsx` | All nav links present, correct labels, correct icons, correct sections |
| `admin-step-indicator.tsx` | Active = green+check, done = green+check, pending = gray+number |
| `admin-data-table.tsx` | Accepts and renders all column types correctly |
| `admin-block-builder.tsx` | Modal (not dropdown) for block type selection |
| `admin-file-upload.tsx` | Accepts `icon`, `multiple`, `accept` props |
| `admin-wizard-page.tsx` | Renders steps + aside + children correctly |
| `admin-list-page.tsx` | Renders title, icon, toolbar, action, children |

---

## Phase 5 — Divergence Matrix

Compile ALL findings into a single ranked table. **Present this to the user and wait for approval before implementing anything.**

```markdown
## Divergence Matrix — Screen Audit

| #  | Sev  | Screen               | Type          | Issue                                                    | Files affected |
|----|------|----------------------|---------------|----------------------------------------------------------|----------------|
| 1  | HIGH | banners/page         | Missing flow  | Create/edit should open full page, not a drawer          | banners/page.tsx |
| 2  | HIGH | wizard step 1        | Wrong fields  | Photo grid missing; thumbnail_url is just a text input   | product-wizard-step1.tsx |
| 3  | MED  | produtos/page        | Missing cols  | No thumbnail, no language flags, no is_published badge   | produtos/page.tsx |
| 4  | MED  | sidebar              | Wrong nav     | "Usuários" in main nav; Figma puts it in settings        | admin-sidebar.tsx |
| 5  | LOW  | historico/page       | Wrong format  | Action shown as badge, not full sentence                 | historico/page.tsx |
```

**Severity criteria:**

- **HIGH**: Screen completely missing, wrong interaction paradigm (drawer vs page), wrong step count, major missing field that blocks user flow, broken navigation
- **MED**: Missing table column, wrong field type, missing tab, wrong button label, data model gap
- **LOW**: Wrong label text, minor field reorder, decorative difference, copy mismatch

**Always include:**
- Estimated scope (lines to change, new files needed)
- Whether the fix is standalone or has dependencies on other fixes
- Execution order recommendation (dependencies first)

---

## Phase 6 — Execution Plan

After presenting the matrix, propose a **phased execution plan**:

1. **Types & contracts** — update `contracts.ts` first (other fixes depend on this)
2. **Mock data** — update `admin-cms.ts` / `catalog.ts` to match new types
3. **Shared components** — fix CRUD primitives that multiple screens depend on
4. **Sidebar** — fix navigation before fixing individual screens
5. **Screen-by-screen** — implement in HIGH → MED → LOW order, with dependencies respected
6. **Validation** — `pnpm tsc --noEmit && pnpm lint` after each phase

**Wait for user confirmation before starting Phase 6.**

---

## Phase 7 — Implementation

Execute the plan phase by phase:

- **Server Component by default** — `"use client"` only for event handlers / hooks
- **Semantic tokens** — `bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, never hardcoded hex
- **`cn()`** from `@/lib/utils` for conditional classes
- **Path alias** `@/*` → `src/` only
- After each phase: run `pnpm tsc --noEmit && pnpm lint`, fix all errors before proceeding

---

## Phase 8 — Changelog

Append one entry to `docs/ia/context.json` (read first, append to log array, write back):

```json
{
  "ts": "<ISO8601 UTC>",
  "agent": "claude-sonnet-4-6",
  "type": "feat",
  "summary": "Screen audit — <N> corrections across <M> screens",
  "files": ["<list of modified files>"],
  "rationale": "Screen audit triggered by user for scope: <scope>. Divergence matrix approved by user.",
  "outcome": "<N> divergences fixed. tsc and lint pass."
}
```

---

## Quick Reference — Figma File

**File key:** `huD41oTL0FAa7xsNEK8tAM`
**Website root:** `1090:25874`
**CMS root:** see `meta.json[cmsPages]` for all CMS node IDs

Navigation maps:
- `docs/ia/figma/FIGMA_GRAPH.md` — human-readable, section trees per page
- `docs/ia/figma/meta.json` — machine-readable, all node IDs

Baseline images (if present):
- `.raw/figma-design/<page-slug>/desktop.png` + `mobile.png`
- `.raw/figma-design/cms/<screen-name>.png`
- `.raw/figma-design/cms-produtos-cadastro/step<N>.png`

---

## Typical Run

| Phase | Duration |
|---|---|
| 0 — Load maps | Read 2 local files |
| 1 — Enumerate Figma screens | 2–6 MCP calls (batched 2 per call) |
| 2 — Enumerate implementation | Read 10–20 source files |
| 3–4 — Compare | Analysis only, no writes |
| 5 — Matrix | Present to user, await confirm |
| 6 — Execution plan | Present to user, await confirm |
| 7 — Implementation | Varies: 1–4 phases |
| 8 — Changelog | 1 read + 1 write |

**Never skip Phase 5 (matrix approval) or Phase 6 (plan approval).** The user must confirm scope before any file is modified.
