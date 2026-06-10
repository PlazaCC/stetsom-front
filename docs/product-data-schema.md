# Product Data Schema

Source of truth for TypeScript types: `stetsom-api/docs/frontend-contracts.md`.

This document is a quick reference to the current types and their key rules. For the complete type definitions, see the contracts file. For pagination shapes, upload flow, and the error contract, see `docs/api-integration.md`.

---

## Core Types

| Type | Description |
|---|---|
| `Product` | Full product entity — used in CMS and public detail views |
| `ProductCardItem` | Light catalog item for listing views |
| `Variant` | Product variation (e.g. "1 Ohm", "2 Ohms") — `order === 0` is the default |
| `VariantAttr` | Technical attribute of a variant — has `attribute_id`, `value`, `order`, `highlighted` |
| `ProductBlock` | Page content block — types: `IMAGE`, `VIDEO`, `HTML`, `MODEL3D`, `TEXT`, `GALLERY` |
| `ProductFile` | Downloadable file linked via `library_id` |
| `Category` | Category with embedded `lines[]` |
| `Line` | Line within a category (formerly Subcategory) — embedded in `Category.lines[]` |

All types are available as Orval-generated exports from `src/api/stetsom/model/index.ts`.

---

## Key Rules

- `variants[].attributes[]` are ordered by `order` ascending. Sort before rendering.
- `page_blocks` are ordered by `order` ascending. Sort before rendering.
- `files.is_active` determines visibility. Do not display inactive files publicly.
- `highlight_attributes` lists the attribute IDs to show in product cards and headers. Use it to filter specs; do not hardcode attribute names.
- `available_locales` restricts product visibility by locale. An empty array means visible in all locales.
- `images[0]` is the thumbnail. The `thumbnail_url` on `ProductCardItem` is already resolved by the API.
- Dates are ISO 8601 strings. IDs are UUID strings.

---

## Multilingual Fields

Fields with `I18nString` type store translations as `{ pt: string, en?: string, es?: string }`. The key is `pt`, not `pt-BR`.

CMS endpoints return raw `I18nString`. Public endpoints return locale-resolved `string` — the frontend does not call any locale resolver.
