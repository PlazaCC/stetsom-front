"use client";

import * as React from "react";
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
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string;
  /** Toolbar slot — rendered top-left (search, filters, chips). */
  toolbar?: React.ReactNode;
  /** Action slot — rendered top-right (create buttons, etc.). */
  action?: React.ReactNode;
  pagination?: AdminPaginationConfig;
  className?: string;
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle,
  emptyDescription,
  keyExtractor,
  toolbar,
  action,
  pagination,
  className,
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

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: keyExtractor,
  });

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* ── Top bar ──────────────────────────────────────────────────────────── */}
      {(toolbar || action) && (
        <div className="flex shrink-0 items-start justify-between gap-4 pb-3">
          <div className="min-w-0 flex-1">{toolbar}</div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────────────────── */}
      {/*
       * No overflow-hidden here. overflow-hidden (and overflow-clip) both block
       * sticky positioning for the <thead>. The rounded border is purely cosmetic;
       * the negligible colour bleed at the corners is imperceptible (bg-muted vs
       * bg-card differ by ~8 lightness points).
       *
       * Height comes from the flex chain (min-h-0 flex-1), not a magic max-h
       * calc — the parent page provides the bounded height via AdminPageLayout.
       */}

      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-border">
        <div className="min-h-0 flex-1 overflow-y-auto bg-card">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : data.length === 0 ? (
            <AdminEmptyState
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            <table className="w-full text-sm">
              {/*
               * sticky top-0 — sticks to the top of <main> (the shell's single
               * scroll container). bg-muted is opaque so rows scrolling beneath
               * are fully covered. shadow-sm gives visual separation from body.
               */}
              <TableHeader className="sticky top-0 z-10 bg-muted shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-muted">
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
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      {pagination && (
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
