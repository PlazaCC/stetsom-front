"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");
  pages.push(total);

  return pages;
}

export function AdminPagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total <= pageSize) return null;

  const pages = buildPageNumbers(page, totalPages);

  const btnBase =
    "flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors";

  return (
    <div className={cn("flex items-center justify-between pt-2", className)}>
      <span className="text-xs text-muted-foreground">
        {total} {total === 1 ? "item" : "itens"}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            btnBase,
            "border border-border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="flex size-8 items-center justify-center text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                btnBase,
                p === page
                  ? "bg-foreground text-background"
                  : "border border-border hover:bg-muted text-foreground",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            btnBase,
            "border border-border hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
