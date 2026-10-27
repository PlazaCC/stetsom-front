"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminPagination } from "./admin-pagination";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface AdminPaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  error?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
  keyExtractor: (row: T) => string;
  /** Toolbar slot — rendered top-left (search, filters, chips). */
  toolbar?: React.ReactNode;
  /** Action slot — rendered top-right (create buttons, etc.). */
  action?: React.ReactNode;
  /** Toolbox slot — rendered in the fixed footer of the table card. */
  tableFooter?: React.ReactNode;
  pagination?: AdminPaginationConfig;
  className?: string;
  selectable?: boolean;
  selectedRowIds?: string[];
  onSelectedRowIdsChange?: (ids: string[]) => void;
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  error,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  emptyAction,
  keyExtractor,
  toolbar,
  action,
  tableFooter,
  pagination,
  className,
  selectable = false,
  selectedRowIds = [],
  onSelectedRowIdsChange,
}: AdminDataTableProps<T>) {
  const columnMap = React.useMemo(
    () => new Map(columns.map((c) => [c.key, c])),
    [columns],
  );

  const tanstackColumns = React.useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((col) => ({
        id: col.key,
        accessorFn: (row) => (row as Record<string, unknown>)[col.key],
        header: col.header,
        cell: ({ row }) =>
          col.render
            ? col.render(row.original, row.index)
            : (row.getValue(col.key) as React.ReactNode),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnMap],
  );

  // TanStack Table returns stateful functions that must not be compiler-memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: keyExtractor,
    enableRowSelection: selectable,
    state: {
      rowSelection: Object.fromEntries(selectedRowIds.map((id) => [id, true])),
    },
    onRowSelectionChange: (updater) => {
      const current = Object.fromEntries(
        selectedRowIds.map((id) => [id, true]),
      );
      const next = typeof updater === "function" ? updater(current) : updater;
      onSelectedRowIdsChange?.(
        Object.entries(next)
          .filter(([, selected]) => selected)
          .map(([id]) => id),
      );
    },
  });

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      {(toolbar || action) && (
        <div className="flex shrink-0 flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">{toolbar}</div>
          {action && <div className="w-full shrink-0 sm:w-auto">{action}</div>}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      {/*
       * The rounded/bordered card owns the scroll body and toolbox footer.
       * overflow-y-auto clips descendants (including the sticky <thead>) to the
       * border-radius, while the footer stays fixed below the scroll region.
       * Height comes from the flex chain (min-h-0 flex-1); the parent page bounds
       * it via AdminPageLayout.
       */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card border border-border bg-card shadow-cms-card">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {error ? (
            <div className="flex items-center justify-center px-6 py-16 text-center text-sm text-destructive">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : data.length === 0 ? (
            <AdminEmptyState
              title={emptyTitle}
              description={emptyDescription}
              icon={emptyIcon}
              action={emptyAction}
            />
          ) : (
            <table className="w-full text-sm">
              {/*
               * bg-muted is opaque so rows scrolling beneath are fully covered;
               * shadow-sm gives visual separation from the body.
               */}
              <TableHeader className="sticky top-0 z-10 bg-muted shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-muted">
                    {selectable && (
                      <TableHead className="w-12 bg-muted px-4 py-3">
                        <Checkbox
                          aria-label="Selecionar todos os itens visíveis"
                          checked={table.getIsAllRowsSelected()}
                          indeterminate={table.getIsSomeRowsSelected()}
                          onCheckedChange={(checked) =>
                            table.toggleAllRowsSelected(checked)
                          }
                        />
                      </TableHead>
                    )}
                    {headerGroup.headers.map((header) => {
                      const col = columnMap.get(header.id);
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "h-auto bg-muted px-4 py-3 text-xs font-medium text-muted-foreground",
                            col?.headerClassName,
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30">
                    {selectable && (
                      <TableCell className="w-12 px-4 py-3">
                        <Checkbox
                          aria-label={`Selecionar ${keyExtractor(row.original)}`}
                          checked={row.getIsSelected()}
                          onCheckedChange={(checked) =>
                            row.toggleSelected(checked)
                          }
                        />
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => {
                      const col = columnMap.get(cell.column.id);
                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "px-4 py-3 whitespace-normal",
                            col?.className,
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </table>
          )}
        </div>

        {tableFooter && (
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 text-sm">
            {tableFooter}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      {pagination && pagination.total > 0 && (
        <div className="flex shrink-0 items-center justify-between pt-3 text-sm text-muted-foreground">
          <span>
            {pagination.total}{" "}
            {pagination.total === 1 ? "resultado" : "resultados"}
          </span>
          <AdminPagination
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            hideCount
            className="pt-0"
          />
        </div>
      )}
    </div>
  );
}
