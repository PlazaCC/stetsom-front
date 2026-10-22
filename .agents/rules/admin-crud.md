---
description: 'Use when creating admin CRUD pages (list, create, edit, delete). Covers list/table pattern, mutation triad, form pattern (drawer vs full-page), confirm dialog, and editor footer.'
applyTo: 'src/app/admin/**/*.{ts,tsx}'
---

# Admin CRUD — Pages & Forms

## List / Table Pages

Every CRUD list page follows this pattern. Use `/admin/produtos` as the canonical
UX reference for debounce, filters, loading/error/empty states and pagination.

```tsx
"use client"
// 1. Search/filter/pagination state
const [search, setSearch] = useState("")
const [page, setPage] = useState(1)

// 2. React Query hook via BFF
const { data, isLoading } = useGetApiEntity({ search, page, pageSize: 20 })

// 3. Column definitions typed as AdminTableColumn<T>[]
const columns: AdminTableColumn<Entity>[] = [
  { key: "name", header: "Nome", render: (row) => row.name },
  // ...trailing actions column
]

// 4. Render
<AdminPageLayout>
  <AdminDataTable
    columns={columns} data={data?.items}
    keyExtractor={(item) => item.id}
    emptyTitle="Nenhum registro"
    emptyDescription="Crie o primeiro registro para começar"
    toolbar={<SearchInput />}
    action={<Button href="/novo">Novo</Button>}
    pagination={{ page, pageSize, total: data?.total ?? 0, onPageChange: setPage }}
  />
</AdminPageLayout>
```

## Mutation Triad

Define exactly three `useMutation` hooks per entity:

```tsx
const queryClient = useQueryClient()
const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetApiEntityQueryKey() })

const createMutation = useMutation({ mutationFn: postApiEntity, onSuccess: invalidate })
const updateMutation = useMutation({ mutationFn: (data) => patchApiEntityId(id, data), onSuccess: invalidate })
const deleteMutation = useMutation({ mutationFn: () => deleteApiEntityId(id), onSuccess: invalidate })
```

- Use the typed query key generators (e.g., `getGetApiEntityQueryKey()`) for cache invalidation
- Chain `onSuccess` callbacks to close modals, show toasts, or redirect

## Form Layout Decision

| Entity complexity | Form type | Pattern |
|---|---|---|
| Simple (few fields: attributes, users) | Dialog / Drawer | Embedded in list page, controlled by `open` state |
| Complex (many fields: categories, banners, products) | Full-page | Dedicated route at `/{entity}/novo` and `/{entity}/[id]` with `<EditorFooter>` |

Both form types accept a `mode: "create" | "edit"` prop.

## Full-Page Form Structure

```tsx
<AdminPageLayout footer={<EditorFooter onBack={handleBack} onPrimary={handleSave} deleteAction={handleDelete} />}>
  <AdminFormSection title="Dados Gerais" description="Informações básicas">
    {/* form fields */}
  </AdminFormSection>
</AdminPageLayout>
```

- Use `<AdminFormSection>` for each logical group of fields (bordered card with optional title)
- Use `<AdminFormSectionContent>` for consistent padding
- Use `<AdminFormSectionTitle>` for visual dividers within a section
- Forms use the full available width by default. Use responsive grids (`grid-cols-1`
  with `sm:`/`lg:` variants) for short fields and stack them on mobile.
- Do not put `overflow-hidden` or `overflow-auto` on ordinary form sections. The
  shell/page owns the vertical scroll; inner scroll is reserved for explicit
  full-height editor surfaces.

## Related data

Related products and similar records use `AdminSearchInput`, a debounced query,
`AdminDataTable`, `AdminPagination`, and `next/link`. Never use `.slice()` as a
substitute for pagination or raw `<a>` elements for internal Admin navigation.

## Table actions

- Use `AdminRowActions` and `AdminRowAction` for every trailing action cell.
- Keep one or two frequent actions inline; use `variant="destructive"` for
  unlink/delete/deactivate actions.
- Actions that navigate to a long-form editor use `target="_blank"` and
  `rel="noopener noreferrer"` when the current parent editor must remain open.
- Do not duplicate button classes inside table cells.
- Use `StatusBadge` for status enums; never print raw values such as `PUBLISHED`.
- `AdminDataTable` toolbars contain search and filters. Primary creation or
  relationship actions belong in its `action` slot so hierarchy stays consistent.
- Toolbars stack at the base breakpoint and become horizontal at `sm`.

## Readability and decomposition

- Keep page components as orchestration layers; extract data hooks, table columns,
  form sections and picker components when a file mixes those responsibilities.
- Prefer named variables, early returns and small components over nested ternaries.
- Feature-local components must not be imported from another feature. Promote shared
  Admin behavior to `src/app/admin/_components/`.

## Confirmation Dialog

Guard every destructive action with `<AdminConfirmDialog>`:

```tsx
const [deleteTarget, setDeleteTarget] = useState<Entity | null>(null)

<AdminConfirmDialog
  open={!!deleteTarget}
  onOpenChange={() => setDeleteTarget(null)}
  title="Excluir registro?"
  description="Esta ação não pode ser desfeita."
  confirmLabel="Excluir"
  destructive
  isPending={deleteMutation.isPending}
  onConfirm={() => deleteMutation.mutateAsync(deleteTarget!.id).then(() => setDeleteTarget(null))}
/>
```

- Set `destructive` when the action results in data loss (delete, deactivate)
- Control visibility with a state variable storing the target item (null when closed)
- Pass `isPending` from the mutation to disable buttons during the API call

## Editor Footer

The fixed bottom bar for full-page forms:

| Prop | Type | Purpose |
|---|---|---|
| `onPrimary` | `() => void` | Main save/create/publish action |
| `primaryLabel` | `string` | Button text (default "Salvar") |
| `onBack` | `() => void` | Navigation back |
| `deleteAction` | `() => void` | Opens embedded confirm dialog |
| `previewAction` | `() => void` | Preview (added to dropdown menu) |
| `saveDraftAction` | `() => void` | Save as draft (added to dropdown menu) |
