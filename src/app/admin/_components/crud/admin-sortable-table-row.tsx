"use client";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AdminSortableTableRowProps {
  id: string;
  label?: string;
  children: React.ReactNode;
  disabled?: boolean;
  disabledReason?: string;
}

/** Semantic sortable table row. The drag handle is the only drag activator. */
export function AdminSortableTableRow({
  id,
  label,
  children,
  disabled = false,
  disabledReason,
}: AdminSortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "relative",
        isDragging && "z-10 bg-card opacity-60 shadow-lg",
      )}
    >
      <TableCell className="w-10 px-2 py-3">
        <button
          ref={setActivatorNodeRef}
          type="button"
          aria-label={label ? `Reordenar ${label}` : "Reordenar linha"}
          disabled={disabled}
          title={disabled ? disabledReason : undefined}
          className="flex size-8 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  );
}

export type { AdminSortableTableRowProps };
