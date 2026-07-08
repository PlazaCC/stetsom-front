---
description: 'Use when building admin UI components and layouts. Covers card containers, shadcn data-slot convention, CMS images, dynamic imports, and mutation loading states.'
applyTo: 'src/app/admin/**/*.tsx, src/components/ui/**/*.tsx'
---

# Admin UI Patterns

## `data-slot` for shadcn Wrappers

Every `@base-ui/react` wrapper in `src/components/ui/` adds a `data-slot` attribute for debugging and styling:

```tsx
<Button.Primitive data-slot="button" className={...}>
```

## CMS Images — Plain `<img>` with ESLint Disable

User-uploaded CMS assets use plain `<img>` since dimensions are unknown at build time:

```tsx
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={item.thumbnail_url} alt={item.nome} className="h-20 w-20 rounded object-cover" />
```

`next/image` is reserved for static assets from the `public/` directory.

## Dynamic Imports for Browser-Only Components

Components depending on browser APIs (e.g. `three.js`, WebGL) use `dynamic()` with SSR disabled:

```tsx
const Model3DViewer = dynamic(
  () => import("@/components/ui/model-3d-viewer").then((m) => m.Model3DViewer),
  { ssr: false },
)
```

## Mutation Loading State Naming

- Use `isSaving` for save/publish actions (OR of create + update pending states)
- Use `isPending` for delete actions
- `EditorFooter` receives `isPrimaryLoading` for the primary button state

## Enable/Disable Button Convention

Admin action buttons are enabled when `!isPending`, show a `Loader2` spinner while loading, and update text to "Salvando..."/"Aguarde...":

```tsx
<Button type="submit" disabled={isSaving}>
  {isSaving ? <Loader2 className="animate-spin" /> : null}
  {isSaving ? "Salvando..." : "Salvar"}
</Button>
```

## `key={dataUpdatedAt}` for Reactive Remount

Use `key={dataUpdatedAt}` on child components to force remount when React Query data refetches:

```tsx
return <BannersContent key={dataUpdatedAt} initialBanners={data} />
```

This ensures the child re-initializes with fresh data without deep comparison logic.

## `.catch(fallback satisfies Type)` for Public Pages

Public site data fetches use `.catch()` with `satisfies` for type-safe fallbacks:

```tsx
const data = await getApiPagesSlug("home", { locale }).catch(
  () => fallback satisfies GetApiPagesSlug200,
)
```

This preserves type safety while providing graceful degradation when the API is unavailable.
