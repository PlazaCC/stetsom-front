"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SortableList } from "./sortable-list";

interface AdminReorderItemMeta {
  position: number;
  isCurrent: boolean;
}

interface AdminReorderListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, meta: AdminReorderItemMeta) => React.ReactNode;
  movableItemId?: string;
  disabled?: boolean;
  className?: string;
}

/** Standard card list used by CMS reorder dialogs and table actions. */
export function AdminReorderList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  movableItemId,
  disabled = false,
  className,
}: AdminReorderListProps<T>) {
  const currentRef = useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, [items, movableItemId]);

  function handleReorder(nextItems: T[]) {
    const announcedId = movableItemId;
    if (announcedId) {
      const nextIndex = nextItems.findIndex(
        (item) => getId(item) === announcedId,
      );
      if (nextIndex >= 0) {
        setAnnouncement(`Item movido para a posição ${nextIndex + 1}.`);
      }
    }
    onReorder(nextItems);
  }

  return (
    <>
      <SortableList
        items={items}
        getId={getId}
        onReorder={handleReorder}
        disabled={disabled}
        isItemDraggable={
          movableItemId ? (item) => getId(item) === movableItemId : undefined
        }
        className={cn("space-y-2", className)}
        renderItem={(item, handle, controls) => {
          const id = getId(item);
          const isCurrent = movableItemId === id;
          const canMove = movableItemId ? isCurrent : true;

          return (
            <div
              ref={isCurrent ? currentRef : undefined}
              className={cn(
                "flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 transition-colors",
                isCurrent &&
                  "border-primary bg-primary/5 ring-1 ring-primary/15",
                controls.isDragging && "shadow-lg",
              )}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground tabular-nums">
                {controls.position}
              </span>

              {canMove ? (
                <div className="[&>button]:flex [&>button]:size-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-md [&>button]:hover:bg-muted">
                  {handle}
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                {renderItem(item, {
                  position: controls.position,
                  isCurrent,
                })}
              </div>

              {canMove ? (
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-md"
                    className="size-11"
                    aria-label={`Mover item da posição ${controls.position} para cima`}
                    disabled={!controls.canMoveUp}
                    onClick={controls.moveUp}
                  >
                    <ChevronUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-md"
                    className="size-11"
                    aria-label={`Mover item da posição ${controls.position} para baixo`}
                    disabled={!controls.canMoveDown}
                    onClick={controls.moveDown}
                  >
                    <ChevronDown className="size-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          );
        }}
      />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </>
  );
}

export type { AdminReorderItemMeta, AdminReorderListProps };
