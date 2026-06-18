"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { BlockEditorCard } from "./block-editor-card";
import { SortableList } from "./sortable-list";

export interface DraftBlock {
  id: string;
  type: string;
  data: Record<string, unknown>;
  order: number;
}

export interface BlockDefinition {
  label: string;
  description: string;
  icon: LucideIcon;
  defaultData: Record<string, unknown>;
  /** Per-type editor form. */
  Form: (props: {
    data: Record<string, unknown>;
    onChange: (data: Record<string, unknown>) => void;
  }) => React.ReactNode;
  /** Hide from the "add block" menu (e.g. reference-only sections). */
  hideFromMenu?: boolean;
}

export type BlockRegistry = Record<string, BlockDefinition>;

interface BlockBuilderProps {
  registry: BlockRegistry;
  value: DraftBlock[];
  onChange: (blocks: DraftBlock[]) => void;
  addLabel?: string;
  className?: string;
  /**
   * Optional custom "add block" menu. When provided, it replaces the default
   * type list. `add(type, data?)` appends a block, merging `data` over the
   * registry default — used by the product wizard to map Figma cards (e.g.
   * Imagem Full / Imagem Side) to a single API type via `data.layout`.
   */
  renderMenu?: (helpers: {
    add: (type: string, data?: Record<string, unknown>) => void;
    close: () => void;
  }) => React.ReactNode;
}

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Registry-driven, drag-and-drop block editor shared by product page-blocks and
 * institutional page sections. Each project supplies its own registry of block
 * types; the shell handles add / remove / reorder / per-type form lookup.
 */
export function BlockBuilder({
  registry,
  value,
  onChange,
  addLabel = "Adicionar bloco",
  className,
  renderMenu,
}: BlockBuilderProps) {
  const [showMenu, setShowMenu] = useState(false);

  function reindex(blocks: DraftBlock[]): DraftBlock[] {
    return blocks.map((b, i) => ({ ...b, order: i }));
  }

  function addBlock(type: string, extra?: Record<string, unknown>) {
    const def = registry[type];
    if (!def) return;
    onChange(
      reindex([
        ...value,
        {
          id: generateId(),
          type,
          data: { ...def.defaultData, ...extra },
          order: value.length,
        },
      ]),
    );
    setShowMenu(false);
  }

  function removeBlock(id: string) {
    onChange(reindex(value.filter((b) => b.id !== id)));
  }

  function updateData(id: string, data: Record<string, unknown>) {
    onChange(value.map((b) => (b.id === id ? { ...b, data } : b)));
  }

  const menuItems = Object.entries(registry).filter(([, d]) => !d.hideFromMenu);

  return (
    <div className={cn("space-y-3", className)}>
      {value.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-10">
          <p className="text-sm text-muted-foreground">
            Nenhum bloco adicionado.
          </p>
        </div>
      )}

      <SortableList
        items={value}
        getId={(b) => b.id}
        onReorder={(items) => onChange(reindex(items))}
        renderItem={(block, handle) => {
          const def = registry[block.type];
          if (!def) return null;
          return (
            <BlockEditorCard
              def={def}
              blockType={block.type}
              data={block.data}
              order={block.order}
              handle={handle}
              onChange={(d) => updateData(block.id, d)}
              onRemove={() => removeBlock(block.id)}
            />
          );
        }}
      />

      <button
        type="button"
        onClick={() => setShowMenu(true)}
        className="flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" />
        {addLabel}
      </button>

      {showMenu &&
        renderMenu &&
        renderMenu({ add: addBlock, close: () => setShowMenu(false) })}

      {showMenu && !renderMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-[16px] border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                Selecionar tipo
              </h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setShowMenu(false)}
                className="rounded p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-96 divide-y divide-border overflow-y-auto">
              {menuItems.map(([type, def]) => {
                const Icon = def.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                      <Icon className="size-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {def.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {def.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
