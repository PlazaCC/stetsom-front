"use client";

import { cn } from "@/lib/utils";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { SortingStrategy } from "@dnd-kit/sortable";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  /** Receives the items in their new order after a drag. */
  onReorder: (items: T[]) => void;
  /** `handle` is the drag-handle element to place wherever you want. */
  renderItem: (item: T, handle: React.ReactNode) => React.ReactNode;
  className?: string;
  /** Sortable strategy. Defaults to `verticalListSortingStrategy` for vertical lists. Use `rectSortingStrategy` for grids. */
  strategy?: SortingStrategy;
  /** Prevents dragging while a reorder mutation is in flight. */
  disabled?: boolean;
  /** Non-sortable node rendered as the last cell, inside the same container (e.g. an add button). */
  append?: React.ReactNode;
}

function SortableItem<T>({
  id,
  item,
  renderItem,
  disabled = false,
}: {
  id: string;
  item: T;
  renderItem: SortableListProps<T>["renderItem"];
  disabled?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handle = (
    <button
      type="button"
      disabled={disabled}
      aria-label="Reordenar"
      className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(event) => event.stopPropagation()}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );

  return (
    <div ref={setNodeRef} style={style}>
      {renderItem(item, handle)}
    </div>
  );
}

/**
 * Generic vertical drag-and-drop list built on dnd-kit. The item renderer
 * decides where the drag handle lives. Reused by product page-blocks, page
 * sections, variants and image galleries.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className,
  strategy = verticalListSortingStrategy,
  append,
  disabled = false,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (disabled || !over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => getId(i) === active.id);
    const newIndex = items.findIndex((i) => getId(i) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(getId)} strategy={strategy}>
        <div className={cn("space-y-2", className)}>
          {items.map((item) => (
            <SortableItem
              key={getId(item)}
              id={getId(item)}
              item={item}
              renderItem={renderItem}
              disabled={disabled}
            />
          ))}
          {append}
        </div>
      </SortableContext>
    </DndContext>
  );
}
