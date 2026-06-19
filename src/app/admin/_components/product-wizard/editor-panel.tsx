"use client";

import type { Attribute, Template } from "@/api/stetsom/model";
import { BlockManager } from "@/app/admin/_components/crud/block-manager";
import { PRODUCT_BLOCK_REGISTRY } from "@/app/admin/_components/crud/product-block-registry";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  FileText,
  Info,
  LayoutGrid,
  Rocket,
  Table2,
  type LucideIcon,
} from "lucide-react";
import {
  sectionToTarget,
  targetToSection,
  type EditorSection,
  type EditorTarget,
} from "./editor-target";
import {
  GeneralEditor,
  type CategoryOption,
  type LineOption,
} from "./general-editor";
import { StepFiles } from "./step-files";
import { StepPublish } from "./step-publish";
import { StepSpecs } from "./step-specs";
import type { WizardAction, WizardState } from "./wizard-store";

interface EditorPanelProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  selection: EditorTarget;
  onSelectionChange: (target: EditorTarget) => void;
  categories: CategoryOption[];
  lines: LineOption[];
  attributes: Attribute[];
  templates: Template[];
  /** Sticky save actions rendered at the bottom of the panel. */
  footer?: React.ReactNode;
}

const NAV_ITEMS: { id: EditorSection; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "Geral", icon: Info },
  { id: "specs", label: "Specs", icon: Table2 },
  { id: "files", label: "Arquivos", icon: FileText },
  { id: "blocks", label: "Blocos", icon: LayoutGrid },
  { id: "publish", label: "Publicar", icon: Rocket },
];

export function EditorPanel({
  state,
  dispatch,
  selection,
  onSelectionChange,
  categories,
  lines,
  attributes,
  templates,
  footer,
}: EditorPanelProps) {
  const activeSection = targetToSection(selection);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Section navigator — replaces the old shell step tabs. */}
      <nav className="flex shrink-0 items-stretch gap-0.5 border-b border-border bg-card px-2 py-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectionChange(sectionToTarget(id))}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md px-1 py-1.5 text-2xs font-medium transition-colors",
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
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {/* Keyed so each section change fades in. */}
        <div key={activeSection} className="animate-in duration-150 fade-in-0">
          {activeSection === "general" && (
            <GeneralEditor
              state={state}
              dispatch={dispatch}
              categories={categories}
              lines={lines}
              field={selection.kind === "general" ? selection.field : undefined}
              onOpenField={(f) =>
                onSelectionChange({ kind: "general", field: f })
              }
              onBack={() => onSelectionChange({ kind: "general" })}
            />
          )}
          {activeSection === "specs" && (
            <StepSpecs
              state={state}
              dispatch={dispatch}
              attributes={attributes}
              templates={templates}
            />
          )}
          {activeSection === "files" && (
            <StepFiles state={state} dispatch={dispatch} />
          )}
          {activeSection === "blocks" &&
            (selection.kind === "addBlock" ? (
              <AddBlockPicker
                onCancel={() => onSelectionChange({ kind: "blocks" })}
                onPick={(type) => {
                  const block = {
                    id: generateBlockId(),
                    type,
                    data: { ...PRODUCT_BLOCK_REGISTRY[type]!.defaultData },
                    order: selection.index,
                  };
                  dispatch({
                    type: "insert_block",
                    block,
                    index: selection.index,
                  });
                  onSelectionChange({ kind: "block", blockId: block.id });
                }}
              />
            ) : (
              <BlockManager
                registry={PRODUCT_BLOCK_REGISTRY}
                value={state.blocks}
                onChange={(blocks) => dispatch({ type: "set_blocks", blocks })}
                addLabel="Adicione um bloco"
                selectedId={
                  selection.kind === "block" ? selection.blockId : null
                }
                onSelectChange={(id) =>
                  onSelectionChange(
                    id ? { kind: "block", blockId: id } : { kind: "blocks" },
                  )
                }
              />
            ))}
          {activeSection === "publish" && (
            <StepPublish state={state} dispatch={dispatch} />
          )}
        </div>
      </div>

      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
}

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface AddBlockPickerProps {
  onPick: (type: string) => void;
  onCancel: () => void;
}

/** Type selector shown when the "+" in the preview requests a new block. */
function AddBlockPicker({ onPick, onCancel }: AddBlockPickerProps) {
  const items = Object.entries(PRODUCT_BLOCK_REGISTRY).filter(
    ([, def]) => !def.hideFromMenu,
  );
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Voltar
      </button>
      <p className="text-sm font-semibold text-foreground">
        Escolha o tipo de bloco
      </p>
      <div className="flex flex-col gap-2">
        {items.map(([type, def]) => {
          const Icon = def.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onPick(type)}
              className="flex items-start gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <Icon className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-foreground">
                  {def.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {def.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
