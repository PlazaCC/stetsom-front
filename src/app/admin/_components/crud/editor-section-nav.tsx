"use client";

import { cn } from "@/lib/utils";
import { Plus, type LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface EditorSectionNavProps {
  items: NavItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  addItem?: { label: string; onAdd: () => void };
}

export function EditorSectionNav({
  items,
  activeId,
  onSelect,
  addItem,
}: EditorSectionNavProps) {
  return (
    <nav className="flex shrink-0 items-stretch gap-0.5 overflow-x-auto border-b border-border bg-card px-2 py-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30">
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeId;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-md px-3 py-1.5 text-2xs font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
      {addItem ? (
        <button
          type="button"
          onClick={addItem.onAdd}
          className="flex shrink-0 flex-col items-center gap-1 rounded-md px-3 py-1.5 text-2xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-4" />
          {addItem.label}
        </button>
      ) : null}
    </nav>
  );
}
