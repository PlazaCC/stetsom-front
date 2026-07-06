---
description: 'Use when building admin forms, content editors, upload flows, or handling API errors. Covers I18nInput, BlockManager, SortableList, upload hooks, error handling, and the BFF proxy contract.'
applyTo: 'src/app/admin/**/*.{ts,tsx}'
---

# Admin Components — Reusable Primitives & Patterns

## Multi-Language Input

Use `<I18nInput>` for every field that accepts multilingual content. It renders locale tabs (PT/EN/ES with flag icons) and manages `I18nString { pt, en?, es? }` state:

```tsx
<I18nInput label="Nome" required value={name} onChange={setName} multiline />
```

- PT is always required (red asterisk)
- Unfilled locales show a blue indicator dot
- Pass `multiline` for long-form text (renders `<Textarea>`)
- Never use `<Input>` or `<Textarea>` directly for `I18nString` fields

## Block Content Editor

Model content blocks as a typed `BlockRegistry`:

```tsx
const MY_BLOCK_REGISTRY: BlockDefinition[] = [
  { type: "TEXT", label: "Texto", icon: Type, defaultData: { content: "" }, Form: TextBlockForm },
  // ...
]
```

- Consume generically via `<BlockManager registry={MY_BLOCK_REGISTRY}>` for add/reorder/select/edit/delete
- Each block type defines its own `Form` render-prop component
- Use shared `<BlockStyleForm>` for cross-cutting styling (fullWidth, background, custom CSS)
- Define the registry in a single file per domain

## Drag-and-Drop Reordering

Use `<SortableList>` built on `@dnd-kit`:

```tsx
<SortableList
  items={items} getId={(item) => item.id}
  onReorder={setItems}
  renderItem={(item, handle) => (
    <div>{handle} {item.name}</div>
  )}
/>
```

- `renderItem` lets each consumer place the drag `handle` (a `<GripVertical>` button) wherever desired
- Re-invalidate the query after each reorder to keep server state in sync

## Upload Flows

| Hook | When to use |
|---|---|
| `useLibraryUpload` | Library assets (Fotos, Manuais, 3D models) — full presign → PUT → complete flow |
| `useInlineUpload` | Inline/pre-negotiated uploads (banner images with pre-obtained presign slots) |
| `postApiProductsIdImages` | Product images — presign URL returned as part of the image creation response |

All hooks manage progress states (idle → presigning → uploading → registering → done/error), concurrency, and preview URL lifecycle.

## API Error Handling

Display API errors using the admin toast pattern:

```tsx
const { apiError } = useAdminToast()
try {
  await createMutation.mutateAsync(payload)
} catch (error) {
  apiError(error, "Erro ao salvar")
}
```

- `useAdminToast().apiError(error, fallback)` maps Orval error codes to user-facing messages via `getApiErrorMessage`
- For per-field inline errors, use `<AdminFieldError>`

## BFF Proxy Contract

`/api/bff/[...path]` is a transparent passthrough proxy:

- Reads `admin_token` HttpOnly cookie, forwards as `Authorization: Bearer` header
- Forwards `content-type`, request body, and pass-through headers (`x-request-id`, rate-limit)
- Handles 204/205/304 responses correctly (no body)
- Preserves JSON vs text content types
- Rejects path traversal attacks
- In mock mode (`USE_MOCK_DATA=1`): GETs from mock fixtures, mutations return `{ _mock: true }`

**Do not** add per-path guards to the BFF — auth is enforced upstream by stetsom-api.