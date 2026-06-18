# Handoff: Product Wizard Refactor — CMS Product Create/Edit

## Context

The CMS product create/edit screens at `/admin/produtos/novo` and `/admin/produtos/[id]` are completely out of sync with the real design. The current front-end was built without faithfully reviewing the Figma source, so a deep refactor is required.

This document is the executable spec. It is grounded in a direct inspection of the six Figma nodes in the "Stetsom | CMS" file and in the real Orval contracts. It supersedes the earlier draft of this handoff, which contained material errors. Those errors are listed in [Corrections vs the earlier draft](#corrections-vs-the-earlier-draft).

Architecture decision confirmed with the client: rewrite the wizard with `useReducer` in a new `product-wizard/` folder, reusing the existing admin primitives rather than recreating them.

## Design System

The wizard belongs to the **admin/CMS** design system. Blue `#4375e2` accent, Geist font, reference at `/admin/styleguide`. It is delivered through the `Admin*` primitives. Do not use the public-site tokens. `bg-brand` red and Barlow do not apply here.

## Figma References

File key: `huD41oTL0FAa7xsNEK8tAM`.

| Step | Node ID | Screen |
|------|---------|--------|
| 1 | `1090:21089` | Dados gerais |
| 2 | `1090:21314` | Especificações técnicas |
| 3 | `1090:21570` | Arquivos — Certificados + Manuais |
| 4a | `1090:21707` | Customização — Blocos customizáveis |
| 4b | `1090:21847` | Customização — "Adicione um bloco" modal |
| 4c | `1090:22031` | Customização — Publicação |

Re-fetch the relevant node with `get_figma_data` before building each step. Use `download_figma_images` for a screenshot reference. Control `depth` to avoid truncation. Fetch one node at a time.

## Step Structure

Four steps, fixed in the indicator: **Dados gerais → Especificações técnicas → Arquivos → Customização**. The shared chrome is the admin sidebar, the step indicator, and a fixed "Preview" panel on the right. Reuse `AdminWizardPage` for the shell plus aside and `AdminStepIndicator` for the indicator.

### Step 1 — Dados gerais (`1090:21089`)

- Title "Dados Gerais do Produto".
- Gallery: one large "Foto de capa" with hint "Formatos suportados: JPEG, PNG 1080 x 1080", plus six "Foto adicional" slots numbered 1 to 6.
- "Nome do produto" with PT/EN/ES locale tabs. Use `I18nInput`.
- "Status" radio: "Em linha" or "Descontinuado". Maps to `is_discontinued`.
- "Categoria" select. "Linha" select, dependent on the chosen category. "Tipo (acessório)" select, disabled.
- "Descrição" textarea, i18n.
- Buttons: "Salvar como rascunho", "Cancelar", "Próximo".

### Step 2 — Especificações técnicas (`1090:21314`)

- Title "Especificações Técnicas".
- Locale tabs at the top, PT/EN/ES, scope the VALOR column.
- "Variações do produto": tabs "1 Ohm", "2 Ohm", and "+" to add a variation.
- Template picker replaces the "Copiar de outro produto" button. This is a client correction. Selecting a template fills the active variation specs only when they are empty, to avoid clobbering edits.
- Spec table columns: ATRIBUTO is an attribute select, VALOR is an `I18nInput`, DESTAQUE is a switch. Each row has a drag handle and a remove action. Button "Adicionar Especificação".

### Step 3 — Arquivos (`1090:21570`)

Two drag-and-drop upload sections. Each shows "Drag & drop files or Browse" and "Arraste aqui para adicionar um ou mais arquivos".

1. Certificados, icon `file-text`. Upload assets with `type=CERTIFICATE`.
2. Manuais, icon `book-open`. Upload assets with `type=MANUAL`.

Buttons: "Cancelar", "Próximo".

### Step 4 — Customização (`1090:21707`, `1090:21847`, `1090:22031`)

Blocks editor at the top, publication settings below, in one step.

- "Blocos customizáveis": a Mobile/Desktop toggle, a product preview, and a grid of blocks.
- "Adicione um bloco" modal, a card grid with "Cancelar" and "Avançar". Six cards:

  | Card | Description | API type |
  |------|-------------|----------|
  | Imagem Full | Imagem que vai tomar a tela horizontal toda do layout | `IMAGE`, `data.layout="full"` |
  | Imagem Side | Imagem lateral | `IMAGE`, `data.layout="side"` |
  | Vídeo | Exibe um vídeo incorporado por link youtube/vimeo | `VIDEO` |
  | Seção livre (HTML) | Permite inserir um conteúdo HTML personalizado | `HTML` |
  | Arquivo 3D | Exibe um modelo 3d interativo .glb/.gltf | `MODEL3D` |
  | Texto / Descritiva | Bloco de texto | `TEXT` |

- "Publicação", below the blocks:
  - "Data de lançamento": date and time, with hint "Deixe em branco para publicar imediatamente."
  - "Status" radio "Em linha" or "Fora de linha". Maps to `is_discontinued`.
  - "Idiomas cadastrados": display only, "Português, Inglês e Espanhol."
  - "Variações do produto": display only, "1 Ohm, 2 Ohm".
  - Buttons: "Pré-visualizar", "Salvar rascunho", "Publicar produto".

## Status Model

`status` is derived, not selected. "Salvar rascunho" sets `DRAFT`. "Publicar produto" sets `PUBLISHED`, or `SCHEDULED` when `launch_date` is in the future. The radio controls only `is_discontinued`.

## API Contract Constraints

Types and hooks are generated by Orval from the stetsom-api OpenAPI spec. Do not edit generated files under `src/api/stetsom/`.

- `PostApiProductsBody` and `PatchApiProductsIdBody` fields: `name, slug, description, category_id, line_id, template_id, status, is_discontinued, launch_date, is_featured, is_spotlight, available_locales, highlight_attributes, variants`. There is no `sku`.
- `is_featured` and `is_spotlight` have no UI in any of the six screens. Preserve incoming values on edit. Default `false` on create. Catalog-level featured/spotlight toggles live outside this wizard.
- `PostApiProductsIdFilesBody` is `{ library_id, locale?, is_active? }`. There is no `type`. The Certificado vs Manual distinction comes from the library asset, set at upload time. `LibraryAssetPicker` and `useLibraryUpload` accept `type: GetApiLibraryType`. `MANUAL` and `CERTIFICATE` exist in the enum.
- `ProductBlockType` is `IMAGE | VIDEO | HTML | MODEL3D | TEXT | GALLERY`. "Imagem Full" and "Imagem Side" are both `IMAGE`, distinguished by `data.layout`. `GALLERY` is not in the modal. Hide it from the add-block menu.
- `page_blocks` is product-level, not per-variation. The variation tabs on the blocks screen are preview context, not a data link.
- `highlight_attributes` is derived from specs flagged `highlighted: true`. The logic already exists in the current `buildPayload`.
- Images use presign on POST. `postApiProductsIdImages` returns an upload descriptor, then `PUT` to S3. Order 0 is the cover.

### Endpoints

All in `src/api/stetsom/endpoints/products/products.ts`.

| Operation | Function |
|-----------|----------|
| Create | `postApiProducts` |
| CMS detail | `getApiProductsAdminId` |
| Update | `patchApiProductsId` |
| Delete | `deleteApiProductsId` |
| Images | `postApiProductsIdImages`, `patchApiProductsIdImagesImageId`, `deleteApiProductsIdImagesImageId` |
| Blocks | `postApiProductsIdBlocks`, `patchApiProductsIdBlocksBlockId`, `deleteApiProductsIdBlocksBlockId` |
| Files | `postApiProductsIdFiles`, `patchApiProductsIdFilesFileId`, `deleteApiProductsIdFilesFileId` |

Select sources: `useGetApiCategories` for categories and their lines, `useGetApiTemplates` for templates, `useGetApiAttributes` for attributes.

## File Structure

New folder `src/app/admin/_components/product-wizard/`.

| File | Responsibility |
|------|----------------|
| `wizard.tsx` | Orchestrator. Consumes the reducer, mounts `AdminWizardPage` plus `AdminSaveBar` plus the preview panel, triggers save and sync. |
| `wizard-store.ts` | `WizardState` mirroring `PostApiProductsBody` plus sub-resources, `wizardReducer`, actions, `initWizardState(detail?)`, `buildPayload()`. |
| `wizard-sync.ts` | `syncBlocks`, `syncImages`, `syncFiles`, extracted from the current orchestrator. |
| `step-general.tsx`, `image-gallery.tsx` | Step 1. Cover plus six slots. |
| `step-specs.tsx`, `spec-table.tsx`, `variation-tabs.tsx`, `template-picker.tsx` | Step 2. |
| `step-files.tsx`, `file-dropzone.tsx` | Step 3. |
| `step-customize.tsx`, `block-device-preview.tsx`, `publish-summary.tsx` | Step 4. |
| `preview-panel.tsx` | Fixed right panel, extracted from the current `previewAside`. |
| `wizard-store.test.ts` | Reducer and `buildPayload` tests. |

### Reuse, do not recreate

`AdminWizardPage`, `AdminSaveBar`, `AdminFormSection`, `AdminPanel`, `AdminPageHeader`, `AdminStepIndicator`, `AdminConfirmDialog`, `AdminSelect`, `BlockBuilder`, `PRODUCT_BLOCK_REGISTRY`, `LibraryAssetPicker`, `I18nInput`, `SortableList`, `useLibraryUpload`, `useInlineUpload`, `useAdminToast`, `slugify`.

### Shared primitives to adjust

- `product-block-registry.tsx`: split `IMAGE` into "Imagem Full" and "Imagem Side" via `data.layout`. Apply the Figma labels, descriptions, and icons. Set `hideFromMenu` on `GALLERY`.
- `BlockBuilder`: restyle the add-block modal to match the card grid in `1090:21847`, with "Cancelar" and "Avançar".
- `block-device-preview.tsx`: reuse the public ProductDetail block renderer if feasible. Fallback is a device frame plus a block list.

### Remove at the end

`product-wizard.tsx`, `product-wizard-step1.tsx`, `product-wizard-step-specs.tsx`, `product-wizard-step-files.tsx`, `product-wizard-step-publish.tsx`, `product-wizard-types.ts`. Keep `product-wizard-step-success.tsx`. Update imports in `produtos/novo/page.tsx` and `produtos/[id]/page.tsx`.

## Corrections vs the earlier draft

| # | Earlier draft said | Reality |
|---|--------------------|---------|
| 1 | Template selector in Step 1 | Step 1 has no template. It has a disabled "Tipo (acessório)" field. The template belongs in Step 2, replacing "Copiar de outro produto". |
| 2 | Block modal has three types | The modal has six types: Imagem Full, Imagem Side, Vídeo, Seção livre (HTML), Arquivo 3D, Texto/Descritiva. |
| 3 | Step 3 holds Certificados, Manuais, and blocks | Step 3 "Arquivos" holds Certificados and Manuais only. Blocks live in Step 4 "Customização", alongside Publicação. |
| 4 | Step 4 swaps status for an is_discontinued radio | Confirmed. The final-step selector is the "Em linha / Fora de linha" radio, which is `is_discontinued`. `status` is derived from the action and `launch_date`. |
| 5 | Remove SKU, featured, spotlight | Correct. The bodies have no `sku`, and no screen exposes featured or spotlight. Preserve those flags on edit, default `false` on create. |
| 6 | Tailwind `bg-brand` red plus Barlow | Wrong for the CMS. The wizard uses the admin design system, blue `#4375e2` plus Geist. |
| 7 | Create block-picker-modal and preview-panel from scratch | Both exist. The add-block modal lives inside `BlockBuilder`. The preview panel exists as `previewAside`. Reuse them. |

## Execution Phases

0. Scaffolding. Create the folder, `wizard-store.ts`, `wizard-sync.ts`, and reducer tests. Mount a minimal `wizard.tsx` with four placeholder steps wired into both pages. Keep `tsc` and `lint` clean.
1. Step 1. `step-general.tsx` plus `image-gallery.tsx`.
2. Step 2. `step-specs.tsx`, `spec-table.tsx`, `variation-tabs.tsx`, `template-picker.tsx`.
3. Step 3. `step-files.tsx`, `file-dropzone.tsx`.
4. Step 4. `step-customize.tsx`, `block-device-preview.tsx`, `publish-summary.tsx`, plus the registry adjustments.
5. Preview panel, polish, cleanup. Extract `preview-panel.tsx`, remove the old files, run a fidelity pass.

For each phase: re-fetch the Figma node, run `pnpm tsc --noEmit` and `pnpm lint`, validate in the browser. Deliver one PR per phase or per step. Do not commit without an explicit request.

## Verification

- `pnpm tsc --noEmit` and `pnpm lint` clean after each phase.
- Create flow end to end. Fill the four steps, upload a cover and additional images, add specs from a template, add certificados and manuais, add blocks of all six types, publish. Confirm `POST /api/products` and the sub-resource calls in the Network panel.
- Edit flow. Open an existing product, confirm hydrated state, edit, save with PATCH, reorder and remove images and blocks.
- Status derivation. Confirm draft vs publish vs scheduled by a future `launch_date`, and `is_discontinued` via the radio.
- Fidelity. Compare each step against the Figma screenshot and against `/admin/styleguide`.
- Reducer tests. Cover `initWizardState`, step transitions, spec and variation edits, and `buildPayload` for `highlight_attributes`, status derivation, and null `line_id` and `template_id`.

No test runner is configured yet. Either add Vitest for `wizard-store.test.ts` or keep the tests as an executable spec until a runner exists. Confirm with the user before adding Vitest.

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start the dev server at localhost:3000 |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm tsc --noEmit` | Type-check |
| `pnpm orval` | Regenerate Orval types when the API spec changes |
