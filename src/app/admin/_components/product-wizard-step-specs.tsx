"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminInput } from "@/app/admin/_components/crud/admin-input";
import type {
  WizardProductSpec,
  WizardProductVariation,
} from "@/app/admin/_components/product-wizard-types";
import { GripVertical, Plus, Trash2, X } from "lucide-react";

interface ProductWizardStepSpecsProps {
  variations: WizardProductVariation[];
  activeVariationId: string;
  highlightAttributes: string[];
  onVariationsChange: (variations: WizardProductVariation[]) => void;
  onActiveVariationChange: (variationId: string) => void;
  onHighlightAttributesChange: (highlightAttributes: string[]) => void;
}

function newSpec(order: number): WizardProductSpec {
  return {
    id: `spec-${Date.now()}-${Math.random()}`,
    attribute: "",
    value: "",
    order,
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
      id: `spec-${Date.now()}-${Math.random()}`,
      attribute: spec.attribute,
      value: "",
      order: index + 1,
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
              ? "flex items-center gap-1 rounded border border-brand bg-brand/5 px-2 py-1"
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
          <button
            type="button"
            onClick={() => onRemove(v.id)}
            className="ml-1 text-muted-foreground hover:text-destructive"
          >
            <X className="size-3" />
          </button>
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

function SpecRow({
  spec,
  onChange,
  onRemove,
  highlighted,
  onToggleHighlight,
}: {
  spec: WizardProductSpec;
  onChange: (patch: Partial<WizardProductSpec>) => void;
  onRemove: () => void;
  highlighted: boolean;
  onToggleHighlight: (checked: boolean) => void;
}) {
  return (
    <tr>
      <td className="px-3 py-2">
        <GripVertical className="size-4 cursor-grab text-muted-foreground" />
      </td>
      <td className="px-3 py-2">
        <AdminInput
          value={spec.attribute}
          onChange={(e) => onChange({ attribute: e.target.value })}
          placeholder="Ex: Potência RMS"
          className="max-w-48"
        />
      </td>
      <td className="px-3 py-2">
        <AdminInput
          value={spec.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="Ex: 3000W"
          className="max-w-40"
        />
      </td>
      <td className="px-3 py-2 text-center">
        <input
          type="checkbox"
          checked={highlighted}
          onChange={(e) => onToggleHighlight(e.target.checked)}
          className="size-4 accent-brand"
        />
      </td>
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </td>
    </tr>
  );
}

export function ProductWizardStepSpecs({
  variations,
  activeVariationId,
  highlightAttributes,
  onVariationsChange,
  onActiveVariationChange,
  onHighlightAttributesChange,
}: ProductWizardStepSpecsProps) {
  const activeVariation =
    variations.find((v) => v.id === activeVariationId) ?? variations[0];
  const activeSpecs = activeVariation?.specs ?? [];

  function addVariation() {
    const next = [
      ...variations,
      newVariation(variations.length + 1, activeVariation?.specs ?? []),
    ];
    onVariationsChange(next);
    onActiveVariationChange(next.at(-1)?.id ?? activeVariation?.id);
  }

  function updateVariation(id: string, patch: Partial<WizardProductVariation>) {
    onVariationsChange(
      variations.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  }

  function removeVariation(id: string) {
    const next = variations.filter((v) => v.id !== id);
    onVariationsChange(next);
    if (id === activeVariationId && next.length > 0) {
      onActiveVariationChange(next[0]!.id);
    }
  }

  function addSpec() {
    if (!activeVariation) return;
    const newSpecItem = newSpec(activeSpecs.length + 1);
    onVariationsChange(
      variations.map((v) =>
        v.id === activeVariation.id
          ? { ...v, specs: [...v.specs, newSpecItem] }
          : v,
      ),
    );
  }

  function updateSpec(specId: string, patch: Partial<WizardProductSpec>) {
    if (!activeVariation) return;
    onVariationsChange(
      variations.map((v) =>
        v.id === activeVariation.id
          ? {
              ...v,
              specs: v.specs.map((s) =>
                s.id === specId ? { ...s, ...patch } : s,
              ),
            }
          : v,
      ),
    );
  }

  function removeSpec(specId: string) {
    if (!activeVariation) return;
    onVariationsChange(
      variations.map((v) =>
        v.id === activeVariation.id
          ? { ...v, specs: v.specs.filter((s) => s.id !== specId) }
          : v,
      ),
    );
  }

  function toggleHighlight(specAttribute: string, checked: boolean) {
    if (!specAttribute.trim()) return;
    if (checked) {
      onHighlightAttributesChange(
        Array.from(new Set([...highlightAttributes, specAttribute.trim()])),
      );
    } else {
      onHighlightAttributesChange(
        highlightAttributes.filter((item) => item !== specAttribute),
      );
    }
  }

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Variações"
        description="Gerencie as variações do produto (ex: 1 Ohm, 2 Ohms, 4 Ohms). Cada variação pode ter especificações técnicas diferentes."
      >
        <VariationTabs
          variations={variations}
          activeId={activeVariationId}
          onSelect={onActiveVariationChange}
          onUpdate={updateVariation}
          onRemove={removeVariation}
          onAdd={addVariation}
        />
      </AdminFormSection>

      <AdminFormSection
        title="Especificações Técnicas"
        description="Adicione as especificações para a variação selecionada. Marque como destaque as principais que aparecerão no card do produto."
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="w-8 px-3 py-2" />
                <th className="px-3 py-2 font-medium">Atributo</th>
                <th className="px-3 py-2 font-medium">Valor</th>
                <th className="w-16 px-3 py-2 text-center font-medium">
                  Destaque
                </th>
                <th className="w-10 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {activeSpecs.map((spec) => (
                <SpecRow
                  key={spec.id}
                  spec={spec}
                  onChange={(patch) => updateSpec(spec.id, patch)}
                  onRemove={() => removeSpec(spec.id)}
                  highlighted={highlightAttributes.includes(spec.attribute)}
                  onToggleHighlight={(checked) =>
                    toggleHighlight(spec.attribute, checked)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addSpec}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <Plus className="size-4" />
          Adicionar especificação
        </button>
      </AdminFormSection>
    </div>
  );
}
