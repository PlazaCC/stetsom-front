"use client";

import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { AdminSelect } from "@/app/admin/_components/crud/admin-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import type { Attribute } from "@/api/stetsom/model";
import { Plus, Trash2 } from "lucide-react";
import { ToggleSwitch } from "./toggle-switch";
import { newSpec, type WizardSpec } from "./wizard-store";

interface SpecTableProps {
  specs: WizardSpec[];
  attributes: Attribute[];
  maxHighlights: number;
  onChange: (specs: WizardSpec[]) => void;
}

function reindex(specs: WizardSpec[]): WizardSpec[] {
  return specs.map((s, i) => ({ ...s, order: i }));
}

export function SpecTable({
  specs,
  attributes,
  maxHighlights,
  onChange,
}: SpecTableProps) {
  const highlightCount = specs.filter((s) => s.highlighted).length;

  function update(id: string, patch: Partial<WizardSpec>) {
    onChange(specs.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_80px_44px] gap-3 border-b border-border bg-muted px-3 py-2.5 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span>Atributo</span>
        <span>Valor</span>
        <span className="text-center">Destaque</span>
        <span />
      </div>

      <SortableList
        items={specs}
        getId={(s) => s.id}
        onReorder={(list) => onChange(reindex(list))}
        renderItem={(spec, handle) => {
          const highlightDisabled =
            !spec.highlighted && highlightCount >= maxHighlights;
          return (
            <div className="grid grid-cols-[1fr_1fr_80px_44px] gap-3 border-b border-border bg-card px-3 py-2.5 last:border-b-0">
              <AdminSelect
                value={spec.attribute_id}
                onChange={(e) => {
                  const attr = attributes.find((a) => a.id === e.target.value);
                  update(spec.id, {
                    attribute_id: e.target.value,
                    attribute_name: attr?.name,
                  });
                }}
              >
                <option value="">Selecione...</option>
                {attributes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name.pt}
                  </option>
                ))}
              </AdminSelect>
              <I18nInput
                value={spec.value}
                onChange={(value) => update(spec.id, { value })}
                placeholder="Valor"
              />
              <div className="flex items-center justify-center">
                <ToggleSwitch
                  checked={spec.highlighted}
                  disabled={highlightDisabled}
                  aria-label="Destacar especificação"
                  onChange={(checked) =>
                    update(spec.id, { highlighted: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-end gap-1 text-muted-foreground">
                <button
                  type="button"
                  aria-label="Remover especificação"
                  onClick={() =>
                    onChange(reindex(specs.filter((s) => s.id !== spec.id)))
                  }
                  className="rounded p-1 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
                <div className="[&_button]:cursor-grab [&_button]:active:cursor-grabbing">
                  {handle}
                </div>
              </div>
            </div>
          );
        }}
      />

      <button
        type="button"
        onClick={() => onChange([...specs, newSpec(specs.length)])}
        className="flex w-full items-center justify-center gap-2 border-t border-dashed border-border bg-card px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <Plus className="size-4" />
        Adicionar Especificação
      </button>
    </div>
  );
}
