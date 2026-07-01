# Execution Plan: Product Wizard Refactor (CMS)

Companion to `product-wizard-refactor-handoff.md`. The handoff holds the per-step spec and contract rules. This file holds the image-derived refinements, the architecture decisions, and the phase checklist to execute on.

Branch: `feat/cms-product-wizard-revision`.

## Context

The CMS product create/edit wizard at `/admin/produtos/novo` and `/admin/produtos/[id]` is misaligned with the real design. This is a deep refactor: a `useReducer` rewrite in a new `product-wizard/` folder, faithful to the Figma and reusing the CMS primitives. The plan is grounded in seven exported reference images in `.raw/figma-products-wizard/` plus the six Figma nodes in file `huD41oTL0FAa7xsNEK8tAM`.

## Design Source

| Reference image | Screen |
|---|---|
| `Dados gerais.png` | Step 1 |
| `Especificações tecnicas.png` | Step 2 |
| `Arquivos e Manual 1.png` | Step 3 Arquivos |
| `Arquivos e Manual 2 Preenchido.png` | Step 4 Blocos |
| `Arquivos e Manual 3 Selecionar Bloco.png` | Step 4 add-block modal |
| `Exemplo Edição de Bloco.png` | Block editor background options |
| `conclusão.png` | Step 4 Publicação |

## Refinements from the exported images

These supersede the first-pass reading of the raw Figma YAML.

- **In-card footers.** Each step renders its action footer inside the form card, not a global sticky bar. Build `wizard-footer.tsx`, do not use `AdminSaveBar` here.
  - Steps 1 to 3: "Salvar como rascunho" (amber, left) · "Cancelar" · "Próximo".
  - Step 4: "Pré-visualizar" (left) · "Salvar rascunho" · "Publicar produto".
- **Shared locale switcher.** Steps 1 and 2 carry a single PT / Inglês / Espanhol segmented control at the card top that switches the active locale for every i18n field at once. Build `locale-tabs.tsx`. Bind plain inputs to `value[activeLocale]` instead of the per-field `I18nInput` tabs.
- **Step 1 gallery.** Large cover on the left, six numbered "Foto adicional" slots in a 3 by 2 grid on the right. Cover hint "Formatos suportados: JPEG, PNG (1080 x 1080)".
- **Step 1 layout.** Row: Nome (left) and Status radio "Em linha / Descontinuado" (right). Row: Categoria, Linha, Tipo (acessório, disabled). Descrição full width. No SKU, no slug field.
- **Step 2 table.** Columns ATRIBUTO, VALOR, DESTAQUE. DESTAQUE is a toggle switch. Each row has a trash action and a drag handle. "Adicionar Especificação" is a full-width dashed button. The "Copiar de outro produto" button is replaced by a Template selector.
- **Step 3.** Two cards, Certificados and Manuais, each a dashed dropzone "Drag & drop files or Browse".
- **Step 4.** Blocos customizáveis at the top, Publicação below. Publicação fields: launch date and time in one field with hint "Deixe em branco para publicar imediatamente.", Status radio "Em linha / Fora de linha", read-only "Idiomas cadastrados" and "Variações do produto".
- **Add-block modal.** Six cards in a 2 by 3 grid: Imagem Full, Imagem Side, Vídeo, Seção livre (HTML), Arquivo 3D, Texto / Descritiva. Footer "Cancelar" and "Avançar". Select then advance.
- **Preview panel.** Right side on every step. Title "Preview" with a Mobile/Desktop toggle. Renders a device-framed product preview: title, category, cover, thumbnail carousel, description, Stetsom footer.

## Added requirements

- **Preserve the enriched block system from main.** The block editor was enriched with MODEL3D via `Model3DViewer` and YouTube embedding. Reuse `BlockBuilder`, `PRODUCT_BLOCK_REGISTRY`, `BlockEditorCard`, `BlockStyleForm`, `Model3DViewer`, `YouTubeEmbed` as is. Do not rebuild block editors. The only addition is the Figma add-block modal, injected through a new optional custom-menu prop on `BlockBuilder` so existing behavior stays intact. Imagem Full and Imagem Side are both `IMAGE`, differentiated by `data.layout`. Rendering `side` on the public site is a follow-up, out of scope here.
- **Keep the final feedback screen, generic and reusable, with an open-page link.** Keep `product-wizard-step-success.tsx` on top of the generic `AdminSuccessPage`. Fix the open-page action: it currently gates on `status === "ACTIVE"` which never matches. Show it for `PUBLISHED` and link to the public product page `/produtos/{slug}`, opening in a new tab.

## Architecture and decisions

- State: single `useReducer` store (`wizard-store.ts`) mirroring `PostApiProductsBody` plus sub-resources.
- `status` is derived from the save action and launch date. "Salvar rascunho" yields DRAFT. "Publicar produto" yields PUBLISHED, or SCHEDULED when `launch_date` is in the future. The radio controls only `is_discontinued`.
- `is_featured` and `is_spotlight` have no UI. Preserve on edit, default false on create.
- `available_locales` is derived from locales with content in name or description.
- File type for Certificados and Manuais is set at upload via `use-typed-upload.ts`, which completes with an explicit `type`. The product-file link body has no `type`.
- Design system is the CMS scope. The `primary` token resolves to `#4375e2` under `.cms`.
- No tests for now.

## File map

New folder `src/app/admin/_components/product-wizard/`.

| File | Status |
|---|---|
| `wizard-store.ts` | done |
| `wizard-sync.ts` | done |
| `use-typed-upload.ts` | done |
| `image-gallery.tsx` | done, cover left and 3 by 2 grid right |
| `locale-tabs.tsx` | done |
| `wizard-footer.tsx` | done |
| `step-general.tsx` | done |
| `step-specs.tsx`, `spec-table.tsx`, `variation-tabs.tsx`, `template-picker.tsx`, `toggle-switch.tsx` | done |
| `step-files.tsx`, `file-dropzone.tsx` | done |
| `step-customize.tsx`, `block-picker-modal.tsx`, `publish-summary.tsx` | done |
| `preview-panel.tsx` | done |
| `wizard.tsx` | done |

Reuse without changes: `AdminWizardPage`, `AdminStepIndicator`, `AdminFormSection`, `AdminPanel`, `AdminPageHeader`, `AdminConfirmDialog`, `AdminInput`, `AdminSelect`, `AdminLabel`, `AdminTextarea`, `AdminSuccessPage`, `LibraryAssetPicker`, `SortableList`, `useLibraryUpload`, `useAdminToast`, `slugify`.

Adjust: `BlockBuilder` (optional custom add-menu prop), `PRODUCT_BLOCK_REGISTRY` (Figma labels and icons, hide GALLERY, IMAGE layout field).

Remove at the end: `product-wizard.tsx`, `product-wizard-step1.tsx`, `product-wizard-step-specs.tsx`, `product-wizard-step-files.tsx`, `product-wizard-step-publish.tsx`, `product-wizard-types.ts`. Keep `product-wizard-step-success.tsx`.

## Phase Checklist

### Phase 0 — Scaffolding and store
- [x] `wizard-store.ts` with state, reducer, actions, `initWizardState`, `buildPayload`, status derivation
- [x] `wizard-sync.ts` for images, blocks, files reconciliation
- [x] `use-typed-upload.ts` for MANUAL and CERTIFICATE uploads
- [x] `locale-tabs.tsx` shared PT / Inglês / Espanhol switcher
- [x] `wizard-footer.tsx` in-card footer with per-step labels
- [x] Minimal `wizard.tsx` orchestrator with the 4 steps wired
- [x] Wire `produtos/novo/page.tsx` and `produtos/[id]/page.tsx` to the new wizard
- [x] `pnpm tsc --noEmit` and `pnpm lint` clean

### Phase 1 — Step 1 Dados gerais
- [x] Rework `image-gallery.tsx`: cover left, 3 by 2 numbered grid right
- [x] `step-general.tsx`: locale tabs, name, status radio, categoria, linha, disabled tipo, descrição
- [x] Category change clears linha and template
- [x] Validate against `Dados gerais.png`

### Phase 2 — Step 2 Especificações técnicas
- [x] `variation-tabs.tsx`: 1 Ohm, 2 Ohm, add
- [x] `template-picker.tsx`: replaces "Copiar de outro produto", prefill specs only if empty
- [x] `toggle-switch.tsx`: DESTAQUE switch
- [x] `spec-table.tsx`: ATRIBUTO, VALOR locale-scoped, DESTAQUE, trash, drag handle, add row
- [x] `step-specs.tsx` composition
- [x] Validate against `Especificações tecnicas.png`

### Phase 3 — Step 3 Arquivos
- [x] `file-dropzone.tsx`: dashed dropzone using `useTypedUpload`
- [x] `step-files.tsx`: Certificados (CERTIFICATE) and Manuais (MANUAL) sections plus uploaded lists
- [x] Validate against `Arquivos e Manual 1.png`

### Phase 4 — Step 4 Customização
- [x] Extend `BlockBuilder` with an optional custom add-menu renderer, no regression to existing editors
- [x] Adjust `PRODUCT_BLOCK_REGISTRY`: Figma labels and icons, hide GALLERY, IMAGE `data.layout`
- [x] `block-picker-modal.tsx`: 2 by 3 grid, Cancelar and Avançar, select then advance
- [x] `publish-summary.tsx`: launch date and time, status radio, read-only idiomas and variações
- [x] `step-customize.tsx`: blocks plus publish
- [x] Validate against `Arquivos e Manual 2/3` and `conclusão.png`

### Phase 5 — Preview, success, cleanup
- [x] `preview-panel.tsx`: Preview plus Mobile/Desktop, device-framed product preview
- [x] Keep `product-wizard-step-success.tsx`, fix open-page link for PUBLISHED to `/produtos/{slug}` in a new tab
- [x] Remove old `product-wizard-*` files, update imports
- [x] Figma fidelity pass across all steps
- [x] `pnpm tsc --noEmit` and `pnpm lint` clean

## Verification

- Create flow end to end. Fill the four steps, upload cover and additional images, add specs from a template, add certificados and manuais, add blocks of all six types, publish. Confirm `POST /api/products` and sub-resource calls in the Network panel.
- Edit flow. Open an existing product, confirm hydrated state across all steps, edit, save with PATCH, reorder and remove images and blocks.
- Status derivation. Confirm draft, publish, and scheduled by a future launch date, and `is_discontinued` via the radio.
- Success screen. Confirm the open-page link appears on publish and opens `/produtos/{slug}`.
- Fidelity. Compare each step with the matching reference image and with `/admin/styleguide`.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the dev server at localhost:3000 |
| `pnpm tsc --noEmit` | Type-check |
| `pnpm lint` | Run ESLint |
