"use client";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface AdminSortableRowProps {
  id: string;
  isDragging: boolean;
  isOver: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (targetId: string) => void;
  onDragEnd: () => void;
  children: React.ReactNode;
  className?: string;
}

export function AdminSortableRow({
  id,
  isDragging,
  isOver,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  children,
  className,
}: AdminSortableRowProps) {
  return (
    <tr
      draggable
      onDragStart={() => onDragStart(id)}
      onDragOver={(e) => onDragOver(e, id)}
      onDrop={() => onDrop(id)}
      onDragEnd={onDragEnd}
      className={cn(
        "transition-colors",
        isDragging && "opacity-40",
        isOver && "border-t-2 border-t-brand",
        className,
      )}
    >
      <td className="w-8 cursor-grab px-2 py-3 text-muted-foreground active:cursor-grabbing">
        <GripVertical className="size-4" />
      </td>
      {children}
    </tr>
  );
}
