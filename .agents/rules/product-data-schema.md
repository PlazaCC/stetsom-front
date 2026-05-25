---
description: 'Use when creating or validating product API payloads, mocks, or mappers. Covers Product (variation-based), ProductBlock, ProductFile, and detail payload constraints.'
applyTo: 'src/lib/api/contracts.ts'
---

# Product Data Schema

- **Product** (required):
  - `id`: uuid string
  - `name`: string (commercial name)
  - `slug`: string (lowercase, hyphen-separated)
  - `category_id`: uuid string
  - `subcategory_id?`: uuid string
  - `status`: 'ACTIVE' | 'DISCONTINUED'
  - `launch_date`: ISO 8601 date string
  - `description`: string
  - `variations`: `ProductVariation[]`
  - `highlight_attributes`: `string[]`
  - `thumbnail_url`: string (absolute or site-root-relative URL)
  - `video_url?`: string (optional video URL)
  - `badge?`: `string | null`
  - `markets?`: locale array (`pt-BR` | `en` | `es`)
  - `created_at`: ISO 8601 date string
  - `updated_at`: ISO 8601 date string
  - `created_by`: string (user id)

- **ProductVariation**:
  - `id`, `label`, `order`, `specs`

- **ProductSpec**:
  - `id`, `attribute`, `value`, `order`

- **Category**:
  - `id`, `name`, `slug`, `order`, `created_at`, `updated_at`

- **Subcategory**:
  - `id`, `category_id`, `name`, `slug`, `order`, `created_at`, `updated_at`

- **ProductBlock**:
  - `id`, `product_id`, `type` (IMAGE|VIDEO|HTML|MODEL3D|TEXT), `order` (integer unique per product), `data` (shape depends on `type`), `created_by`, `created_at`, `updated_at`
  - Example `data` shapes: IMAGE -> `{ images: string[], caption?: string, layout?: string }`; TEXT -> `{ title?: string, content: string, align?: string }`.

- **ProductFile**:
  - `id`, `product_id` (nullable), `file_url`, `type` (MANUAL|CATALOG|CERTIFICATE|IMAGE|OTHER), `version` (number), `is_active` (boolean), optional metadata (`name`, `fileSize`), `created_at`, `updated_at`

- **Product detail response shape**:
  - `{ product: Product, blocks: ProductBlock[], files: ProductFile[], category: Category, subcategory?: Subcategory, relatedProducts: ProductCardItem[] }`

**Rules / Guidelines**

- Use `src/lib/api/contracts.ts` as the single source of truth for TS types and enums.
- Keep property names and types exactly as in the contracts (English keys).
- Dates must be ISO 8601 strings when serialized via JSON.
- IDs must be UUID strings; `slug` must be lowercase and URL-safe.
- Image/file URLs should be absolute or start with `/` (site-root-relative).
- Specs are variation-based (`variations[].specs[]`) and ordered by `order`; do not reintroduce flat `specifications` objects.
- `highlight_attributes` should reference attributes present in the selected variation specs.
- `status` accepts only `ACTIVE` or `DISCONTINUED`.
- `blocks` must be ordered by `order` and `order` must be unique per product; render according to ascending `order`.
- Each product must have at least one active block for display (image/text/video as applicable).
- `files.version` increments per product+type; keep versions consistent in mocks and provider.
- If the schema changes, update `src/lib/api/contracts.ts`.

**Where to edit**

- Contract edits: `src/lib/api/contracts.ts`
- Mock data: `src/lib/mock/*` and `src/lib/api/providers/mock-provider.ts`
