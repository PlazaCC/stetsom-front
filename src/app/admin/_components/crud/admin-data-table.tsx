import { cn } from "@/lib/utils";
import { AdminEmptyState } from "./admin-empty-state";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  keyExtractor: (row: T) => string;
  className?: string;
}

export function AdminDataTable<T>({
  columns,
  data,
  isLoading,
  emptyTitle,
  emptyDescription,
  keyExtractor,
  className,
}: AdminDataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
        </div>
      ) : data.length === 0 ? (
        <AdminEmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 text-left text-xs font-medium text-muted-foreground",
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row, index) => (
                <tr
                  key={keyExtractor(row)}
                  className="transition-colors hover:bg-muted/30"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3", col.className)}
                    >
                      {col.render
                        ? col.render(row, index)
                        : ((row as Record<string, unknown>)[
                            col.key
                          ] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
