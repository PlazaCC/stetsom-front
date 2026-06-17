"use client";

import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import type { BlockDefinition } from "./block-builder";
import { BlockStyleForm } from "./block-style-form";

type BlockTab = "content" | "style";

interface BlockEditorCardProps {
  def: BlockDefinition;
  blockType: string;
  data: Record<string, unknown>;
  order: number;
  handle: React.ReactNode;
  onChange: (data: Record<string, unknown>) => void;
  onRemove: () => void;
}

const TABS: { id: BlockTab; label: string }[] = [
  { id: "content", label: "Conteúdo" },
  { id: "style", label: "Estilização" },
];

/**
 * One block in the builder: drag handle, type header, and a tabbed editor
 * splitting per-type content (`def.Form`) from the universal styling form.
 */
export function BlockEditorCard({
  def,
  blockType,
  data,
  order,
  handle,
  onChange,
  onRemove,
}: BlockEditorCardProps) {
  const [tab, setTab] = useState<BlockTab>("content");
  const Icon = def.icon;

  return (
    <div className="rounded-[16px] border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        {handle}
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {def.label}
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          #{order + 1}
        </span>
        <button
          type="button"
          aria-label="Remover bloco"
          onClick={onRemove}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="flex gap-1 border-b border-border px-4 pt-3">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
              tab === id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "content" ? (
          <def.Form data={data} onChange={onChange} />
        ) : (
          <BlockStyleForm
            blockType={blockType}
            data={data}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
