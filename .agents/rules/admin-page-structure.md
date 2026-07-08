---
description: 'Use when creating or refactoring admin CMS pages. Covers the standard admin page skeleton, inline error/loading states, and mutation patterns.'
applyTo: 'src/app/admin/**/*.tsx'
---

# Admin Page Structure

## Standard Admin List Page Skeleton

```tsx
"use client"

import { useState, useEffect } from "react"
import { useGetApiProducts } from "@/api/stetsom"
import { AdminPageLayout } from "../_components/crud/admin-page-layout"
import { AdminDataTable } from "../_components/crud/admin-data-table"
import { AdminRowActions } from "../_components/crud/admin-row-actions"
import { AdminConfirmDialog } from "../_components/crud/admin-confirm-dialog"

export default function ProductsPage() {
  // 1. Search state
  const [inputValue, setInputValue] = useState("")
  const [query, setQuery] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 300)
    return () => clearTimeout(t)
  }, [inputValue])

  // 2. React Query hook
  const { data, isLoading, isError, dataUpdatedAt } = useGetApiProducts({ q: query })

  // 3. Table columns
  const columns: AdminTableColumn<Product>[] = [
    { header: "Nome", accessorKey: "name" },
    { header: "Status", accessorKey: "status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { header: "", id: "actions", cell: ({ row }) => <AdminRowActions>...</AdminRowActions> },
  ]

  // 4. Inline error
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>Sessão expirada ou sem permissão. <Link href="/admin/login">Faça login novamente</Link>.</p>
      </div>
    )
  }

  // 5. Structure
  return (
    <AdminPageLayout>
      <AdminDataTable columns={columns} data={data?.items ?? []} />
    </AdminPageLayout>
  )
}
```

## Key Patterns

- **No `loading.tsx` or `error.tsx`** — all states are handled inline within the page component
- **AdminRowActions** trailing column: use `href` for navigation, `onClick` with `variant="destructive"` for delete
- **Status badges**: use `StatusBadge` with `STATUS_MAP` for content status (PUBLISHED/DRAFT/SCHEDULED) and audit action types
- **Delete confirmation**: `AdminConfirmDialog` wrapping the delete mutation

## Mutation Side-Effect Ordering

Chain side effects in `onSuccess` in this order:

1. Invalidate related React Query caches
2. Show toast notification (`sonner`)
3. Close dialog/modal
4. Clear selection state

```tsx
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["getApiProducts"] })
  toast.success("Produto atualizado")
  setIsDialogOpen(false)
  setSelectedProduct(null)
}
```

Use `onSettled` for cleanup that should run regardless of success/failure (e.g. setting `isPending` to false).

## Admin Error Distinction

- Auth errors ("Sessão expirada ou sem permissão.") — show login link, usually when the token is missing or expired
- Not-found errors ("Produto não encontrado.") — no login link, data-specific resource is missing
- Both are rendered inline, never redirect to a separate error page

## Admin Card Container

Every admin card/dashboard section uses the canonical box pattern:

```tsx
<div className="rounded-card border border-border bg-card p-4 lg:p-6">
  {/* content */}
</div>
```

The `--radius-card: 1rem` token is defined in `globals.css`.
