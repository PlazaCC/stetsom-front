"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { BlockStyleForm } from "./block-style-form";
import { SortableList } from "./sortable-list";
import {
  AdminFormSection,
  AdminFormSectionContent,
} from "./admin-form-section";

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

interface BlockManagerProps {
  registry: BlockRegistry;
  value: DraftBlock[];
  onChange: (blocks: DraftBlock[]) => void;
  addLabel?: string;
  className?: string;
  /** Controlled selection. When `onSelectChange` is passed, the parent owns it. */
  selectedId?: string | null;
  onSelectChange?: (id: string | null) => void;
  /** Controlled add-block menu. Without these, uses internal `showMenu` state. */
  menuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  /** When set, the picked block is inserted at this index instead of appended. */
  insertIndex?: number | null;
}

type DetailTab = "content" | "style";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "content", label: "Conteúdo" },
  { id: "style", label: "Estilização" },
];

function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Registry-driven accordion block editor. Each block owns its header, ordering
 * controls and editor so the form can use the full width of the panel.
 */
export function BlockManager({
  registry,
  value,
  onChange,
  addLabel = "Adicionar bloco",
  className,
  selectedId: controlledSelectedId,
  onSelectChange,
  menuOpen,
  onMenuOpenChange,
  insertIndex = null,
}: BlockManagerProps) {
  const controlled = onSelectChange !== undefined;
  const [internalId, setInternalId] = useState<string | null>(
    value[0]?.id ?? null,
  );
  const selectedId = controlled ? (controlledSelectedId ?? null) : internalId;
  const setSelectedId = (id: string | null) => {
    if (controlled) onSelectChange?.(id);
    else setInternalId(id);
  };
  const [detailTab, setDetailTab] = useState<DetailTab>("content");
  const [showMenu, setShowMenu] = useState(false);
  const menuControlled = menuOpen !== undefined;
  const menuVisible = menuControlled ? menuOpen : showMenu;
  const setMenu = (open: boolean) => {
    if (menuControlled) onMenuOpenChange?.(open);
    else setShowMenu(open);
  };

  function reindex(blocks: DraftBlock[]): DraftBlock[] {
    return blocks.map((b, i) => ({ ...b, order: i }));
  }

  function addBlock(type: string) {
    const def = registry[type];
    if (!def) return;
    const id = generateId();
    const block = { id, type, data: { ...def.defaultData }, order: 0 };
    const next =
      insertIndex != null
        ? reindex([
            ...value.slice(0, insertIndex),
            block,
            ...value.slice(insertIndex),
          ])
        : reindex([...value, block]);
    // Close before selecting: in controlled mode both update `selection` and the
    // last write wins, so the new block ends up selected (not reset to "blocks").
    setMenu(false);
    onChange(next);
    setSelectedId(id);
    setDetailTab("content");
  }

  function removeBlock(id: string) {
    const next = reindex(value.filter((b) => b.id !== id));
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  function updateData(id: string, data: Record<string, unknown>) {
    onChange(value.map((b) => (b.id === id ? { ...b, data } : b)));
  }

  function toggleBlock(id: string) {
    if (selectedId === id) {
      setSelectedId(null);
      return;
    }
    setSelectedId(id);
    setDetailTab("content");
  }

  const menuItems = Object.entries(registry).filter(([, d]) => !d.hideFromMenu);

  return (
    <div className={cn("w-full", className)}>
      <AdminFormSection title="Blocos" className="w-full" raw>
        <AdminFormSectionContent className="gap-3">
          {value.length === 0 && (
            <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              Nenhum bloco adicionado.
            </div>
          )}

          <SortableList
            items={value}
            getId={(b) => b.id}
            onReorder={(items) => onChange(reindex(items))}
            append={
              <button
                type="button"
                onClick={() => setMenu(true)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="size-4" />
                {addLabel}
              </button>
            }
            renderItem={(block, handle) => {
              const def = registry[block.type];
              if (!def) return null;
              const Icon = def.icon;
              const isExpanded = block.id === selectedId;
              const Form = def.Form;

              return (
                <div
                  className={cn(
                    "overflow-hidden rounded-md border bg-card transition-colors",
                    isExpanded
                      ? "border-primary shadow-sm"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div
                    className={cn(
                      "flex min-h-12 items-center gap-2 px-3 py-2.5 transition-colors",
                      isExpanded ? "bg-primary/5" : "hover:bg-muted/40",
                    )}
                  >
                    {handle}
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleBlock(block.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isExpanded ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                        {def.label}
                      </span>
                      <span className="shrink-0 text-2xs text-muted-foreground">
                        #{block.order + 1}
                      </span>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-transform",
                          isExpanded && "rotate-180 text-primary",
                        )}
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remover ${def.label}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border">
                      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          {def.label}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          #{block.order + 1}
                        </span>
                      </div>

                      <div className="flex gap-1 border-b border-border px-4 pt-3">
                        {DETAIL_TABS.map(({ id, label }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setDetailTab(id)}
                            className={cn(
                              "-mb-px border-b-2 px-3 py-2 text-xs font-semibold transition-colors",
                              detailTab === id
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <div className="p-4">
                        {detailTab === "content" ? (
                          <Form
                            data={block.data}
                            onChange={(data) => updateData(block.id, data)}
                          />
                        ) : (
                          <BlockStyleForm
                            blockType={block.type}
                            data={block.data}
                            onChange={(data) => updateData(block.id, data)}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </AdminFormSectionContent>
      </AdminFormSection>

      {/* Add-block type menu */}
      {menuVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
          onClick={() => setMenu(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-card border border-border bg-card shadow-cms-card-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">
                Selecionar tipo
              </h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setMenu(false)}
                className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-brand"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 divide-y divide-border overflow-y-auto p-4">
              {menuItems.map(([type, def]) => {
                const Icon = def.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-sm border-2 border-dashed px-5 py-3.5 text-left transition-colors hover:border-brand hover:bg-muted"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center">
                      <Icon className="size-10 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-center text-sm font-medium text-foreground">
                        {def.label}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
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
