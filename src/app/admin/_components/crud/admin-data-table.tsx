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
  emptyIcon?: LucideIcon;
  emptyAction?: React.ReactNode;
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
  emptyIcon,
  emptyAction,
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

  // TanStack Table returns stateful functions that must not be compiler-memoized.
  // eslint-disable-next-line react-hooks/incompatible-library
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
       * The scroll container IS the rounded/bordered card. overflow-y-auto clips
       * descendants (including the sticky <thead>) to the border-radius, and
       * position:sticky sticks relative to this same element — so the corners
       * clip cleanly AND the header keeps pinning. Height comes from the flex
       * chain (min-h-0 flex-1); the parent page bounds it via AdminPageLayout.
       */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-card border border-border bg-card shadow-cms-card">
        {isLoading ? (
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
