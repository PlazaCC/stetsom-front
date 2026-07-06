---
description: 'Use when creating admin CRUD pages (list, create, edit, delete). Covers list/table pattern, mutation triad, form pattern (drawer vs full-page), confirm dialog, and editor footer.'
applyTo: 'src/app/admin/**/*.{ts,tsx}'
---

# Admin CRUD — Pages & Forms

## List / Table Pages

Every CRUD list page follows this pattern:

```tsx
"use client"
// 1. Search/filter/pagination state
const [search, setSearch] = useState("")
const [page, setPage] = useState(1)

// 2. React Query hook via BFF
const { data, isLoading } = useGetApiEntity({ search, page, pageSize: 20 })

// 3. Column definitions typed as AdminTableColumn<T>[]
const columns: AdminTableColumn<Entity>[] = [
  { header: "Nome", accessor: "name", sortable: true },
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
    pagination={{ page, totalPages, onPageChange: setPage }}
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