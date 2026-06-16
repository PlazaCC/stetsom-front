"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminSelect } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import type {
  WizardProductSpec,
  WizardProductVariation,
} from "@/app/admin/_components/product-wizard-types";
import type { Attribute } from "@/api/stetsom/model";
import { CMS_UI } from "@/lib/cms/constants";
import { Plus, Trash2, X } from "lucide-react";

interface ProductWizardStepSpecsProps {
  variations: WizardProductVariation[];
  activeVariationId: string;
  /** Global attributes available for selection. */
  attributes: Attribute[];
  onVariationsChange: (variations: WizardProductVariation[]) => void;
  onActiveVariationChange: (variationId: string) => void;
}

function newSpec(order: number): WizardProductSpec {
  return {
    id: `spec-${Date.now()}-${Math.random()}`,
    attribute_id: "",
    value: { pt: "" },
    order,
    highlighted: false,
  };
}

function newVariation(
  order: number,
  baseSpecs: WizardProductSpec[] = [],
): WizardProductVariation {
  return {
    id: `variation-${Date.now()}-${Math.random()}`,
    label: `${order} Ohm`,
    order,
    specs: baseSpecs.map((spec, index) => ({
      id: `spec-${Date.now()}-${Math.random()}-${index}`,
      attribute_id: spec.attribute_id,
      attribute_name: spec.attribute_name,
      value: { pt: "" },
      order: index,
      highlighted: spec.highlighted,
    })),
  };
}

function VariationTabs({
  variations,
  activeId,
  onSelect,
  onUpdate,
  onRemove,
  onAdd,
}: {
  variations: WizardProductVariation[];
  activeId: string;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<WizardProductVariation>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {variations.map((v) => (
        <div
          key={v.id}
          className={
            v.id === activeId
              ? "flex items-center gap-1 rounded border border-primary bg-primary/5 px-2 py-1"
              : "flex items-center gap-1 rounded border border-border px-2 py-1"
          }
        >
          {v.id === activeId ? (
            <input
              value={v.label}
              onChange={(e) => onUpdate(v.id, { label: e.target.value })}
              className="w-20 border-none bg-transparent text-sm font-medium text-foreground outline-none"
              placeholder="Nome"
            />
          ) : (
            <button type="button" onClick={() => onSelect(v.id)}>
              <span className="text-sm text-muted-foreground">{v.label}</span>
            </button>
          )}
          {variations.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(v.id)}
              className="ml-1 text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1 rounded border border-dashed border-border px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <Plus className="size-3" />
        Variação
      </button>
    </div>
  );
}

export function ProductWizardStepSpecs({
  variations,
  activeVariationId,
  attributes,
  onVariationsChange,
  onActiveVariationChange,
}: ProductWizardStepSpecsProps) {
  const activeVariation =
    variations.find((v) => v.id === activeVariationId) ?? variations[0];
  const activeSpecs = activeVariation?.specs ?? [];
  const highlightCount = activeSpecs.filter((s) => s.highlighted).length;

  function patchActiveSpecs(
    updater: (specs: WizardProductSpec[]) => WizardProductSpec[],
  ) {
    if (!activeVariation) return;
    onVariationsChange(
      variations.map((v) =>
        v.id === activeVariation.id ? { ...v, specs: updater(v.specs) } : v,
      ),
    );
  }

  function addVariation() {
    const next = [
      ...variations,
      newVariation(variations.length + 1, activeVariation?.specs ?? []),
    ];
    onVariationsChange(next);
    onActiveVariationChange(next.at(-1)?.id ?? activeVariation?.id);
  }

  function removeVariation(id: string) {
    const next = variations.filter((v) => v.id !== id);
    onVariationsChange(next);
    if (id === activeVariationId && next.length > 0) {
      onActiveVariationChange(next[0]!.id);
    }
  }

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Variações"
        description="Gerencie as variações do produto (ex: 1 Ohm, 2 Ohms). Cada variação tem seus próprios valores técnicos."
      >
        <VariationTabs
          variations={variations}
          activeId={activeVariationId}
          onSelect={onActiveVariationChange}
          onUpdate={(id, patch) =>
            onVariationsChange(
              variations.map((v) => (v.id === id ? { ...v, ...patch } : v)),
            )
          }
          onRemove={removeVariation}
          onAdd={addVariation}
        />
      </AdminFormSection>

      <AdminFormSection
        title="Especificações Técnicas"
        description={`Selecione o atributo e informe o valor. Até ${CMS_UI.MAX_HIGHLIGHTS} podem ser destacados no cabeçalho do produto.`}
      >
        <div className="space-y-2">
          {activeSpecs.map((spec) => {
            const highlightDisabled =
              !spec.highlighted && highlightCount >= CMS_UI.MAX_HIGHLIGHTS;
            return (
              <div
                key={spec.id}
                className="flex items-end gap-3 rounded-md border border-border bg-card p-3"
              >
                <div className="w-48 shrink-0">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Atributo
                  </label>
                  <AdminSelect
                    value={spec.attribute_id}
                    onChange={(e) => {
                      const attr = attributes.find(
                        (a) => a.id === e.target.value,
                      );
                      patchActiveSpecs((specs) =>
                        specs.map((s) =>
                          s.id === spec.id
                            ? {
                                ...s,
                                attribute_id: e.target.value,
                                attribute_name: attr?.name,
                              }
                            : s,
                        ),
                      );
                    }}
                  >
                    <option value="">Selecione...</option>
                    {attributes.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name.pt}
                      </option>
                    ))}
                  </AdminSelect>
                </div>
                <I18nInput
                  className="flex-1"
                  label="Valor"
                  value={spec.value}
                  onChange={(value) =>
                    patchActiveSpecs((specs) =>
                      specs.map((s) =>
                        s.id === spec.id ? { ...s, value } : s,
                      ),
                    )
                  }
                  placeholder="Ex: 8000W RMS"
                />
                <label className="flex shrink-0 flex-col items-center gap-1 pb-2 text-xs text-muted-foreground">
                  Destaque
                  <input
                    type="checkbox"
                    checked={spec.highlighted}
                    disabled={highlightDisabled}
                    onChange={(e) =>
                      patchActiveSpecs((specs) =>
                        specs.map((s) =>
                          s.id === spec.id
                            ? { ...s, highlighted: e.target.checked }
                            : s,
                        ),
                      )
                    }
                    className="size-4 accent-primary disabled:opacity-40"
                  />
                </label>
                <button
                  type="button"
                  aria-label="Remover"
                  onClick={() =>
                    patchActiveSpecs((specs) =>
                      specs.filter((s) => s.id !== spec.id),
                    )
                  }
                  className="pb-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            patchActiveSpecs((specs) => [...specs, newSpec(specs.length)])
          }
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <Plus className="size-4" />
          Adicionar especificação
        </button>
      </AdminFormSection>
    </div>
  );
}
