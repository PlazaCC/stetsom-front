"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Plus, Trash2, X } from "lucide-react";
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
}

type DetailTab = "content" | "style";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "content", label: "Conteúdo" },
  { id: "style", label: "Estilização" },
];

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Registry-driven master-detail block editor. The left card lists the blocks
 * with reorder/delete actions; the right card edits the selected block's
 * content (`def.Form`) and styling (`BlockStyleForm`). Replaces the old
 * single-list `BlockBuilder` so ordering and per-block editing don't compete
 * for the same space.
 */
export function BlockManager({
  registry,
  value,
  onChange,
  addLabel = "Adicionar bloco",
  className,
}: BlockManagerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    value[0]?.id ?? null,
  );
  const [detailTab, setDetailTab] = useState<DetailTab>("content");
  const [showMenu, setShowMenu] = useState(false);

  function reindex(blocks: DraftBlock[]): DraftBlock[] {
    return blocks.map((b, i) => ({ ...b, order: i }));
  }

  function addBlock(type: string) {
    const def = registry[type];
    if (!def) return;
    const id = generateId();
    onChange(
      reindex([
        ...value,
        { id, type, data: { ...def.defaultData }, order: value.length },
      ]),
    );
    setSelectedId(id);
    setDetailTab("content");
    setShowMenu(false);
  }

  function removeBlock(id: string) {
    const next = reindex(value.filter((b) => b.id !== id));
    onChange(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  }

  function updateData(id: string, data: Record<string, unknown>) {
    onChange(value.map((b) => (b.id === id ? { ...b, data } : b)));
  }

  function selectBlock(id: string) {
    setSelectedId(id);
    setDetailTab("content");
  }

  const menuItems = Object.entries(registry).filter(([, d]) => !d.hideFromMenu);
  const selected = value.find((b) => b.id === selectedId) ?? null;
  const selectedDef = selected ? registry[selected.type] : null;
  const SelectedIcon = selectedDef?.icon;
  const SelectedForm = selectedDef?.Form;

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-4 lg:flex-row lg:items-start",
        className,
      )}
    >
      {/* Card 1 — block list + actions */}
      <AdminFormSection title="Blocos" className="w-72! flex-initial">
        <AdminFormSectionContent className="gap-2">
          {value.length === 0 ? (
            <div className="rounded-md border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              Nenhum bloco adicionado.
            </div>
          ) : (
            <SortableList
              items={value}
              getId={(b) => b.id}
              onReorder={(items) => onChange(reindex(items))}
              renderItem={(block, handle) => {
                const def = registry[block.type];
                if (!def) return null;
                const Icon = def.icon;
                const isActive = block.id === selectedId;
                return (
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2.5 py-2 transition-colors",
                      isActive
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    {handle}
                    <button
                      type="button"
                      onClick={() => selectBlock(block.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <Icon
                        className={cn(
                          "size-4 shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                        {def.label}
                      </span>
                      <span className="shrink-0 text-2xs text-muted-foreground">
                        #{block.order + 1}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Remover bloco"
                      onClick={() => removeBlock(block.id)}
                      className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setShowMenu(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" />
            {addLabel}
          </button>
        </AdminFormSectionContent>
      </AdminFormSection>

      {/* Card 2 — selected block editor */}
      <AdminFormSection title="">
        {selected && selectedDef && SelectedIcon && SelectedForm ? (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <SelectedIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {selectedDef.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                #{selected.order + 1}
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
                <SelectedForm
                  data={selected.data}
                  onChange={(d) => updateData(selected.id, d)}
                />
              ) : (
                <BlockStyleForm
                  blockType={selected.type}
                  data={selected.data}
                  onChange={(d) => updateData(selected.id, d)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            {value.length === 0
              ? "Adicione um bloco para começar."
              : "Selecione um bloco para editar."}
          </div>
        )}
      </AdminFormSection>

      {/* Add-block type menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cms-overlay p-4"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-card border border-border bg-card shadow-xl"
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
