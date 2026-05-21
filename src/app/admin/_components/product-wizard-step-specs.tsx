"use client";

import { AdminFormSection } from "@/app/admin/_components/crud/admin-form-section";
import { AdminInput } from "@/app/admin/_components/crud/admin-input";
import type { ProductSpec, ProductVariation } from "@/lib/api/contracts";
import { GripVertical, Plus, Trash2, X } from "lucide-react";

interface ProductWizardStepSpecsProps {
  variations: ProductVariation[];
  activeVariationId: string;
  highlightAttributes: string[];
  onVariationsChange: (variations: ProductVariation[]) => void;
  onActiveVariationChange: (variationId: string) => void;
  onHighlightAttributesChange: (highlightAttributes: string[]) => void;
}

function newSpec(order: number): ProductSpec {
  return {
    id: `spec-${Date.now()}-${Math.random()}`,
    attribute: "",
    value: "",
    order,
  };
}

function newVariation(
  order: number,
  baseSpecs: ProductSpec[] = [],
): ProductVariation {
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

export function ProductWizardStepSpecs({
  variations,
  activeVariationId,
  highlightAttributes,
  onVariationsChange,
  onActiveVariationChange,
  onHighlightAttributesChange,
}: ProductWizardStepSpecsProps) {
  const activeVariation =
    variations.find((variation) => variation.id === activeVariationId) ??
    variations[0];

  if (!activeVariation) {
    return null;
  }

  const specs = activeVariation?.specs ?? [];

  function updateActiveSpecs(nextSpecs: ProductSpec[]) {
    onVariationsChange(
      variations.map((variation) =>
        variation.id === activeVariation.id
          ? { ...variation, specs: nextSpecs }
          : variation,
      ),
    );
  }

  function addRow() {
    updateActiveSpecs([...specs, newSpec(specs.length + 1)]);
  }

  function removeRow(id: string) {
    const removingSpec = specs.find((spec) => spec.id === id);
    updateActiveSpecs(
      specs
        .filter((spec) => spec.id !== id)
        .map((spec, index) => ({ ...spec, order: index + 1 })),
    );

    if (removingSpec && highlightAttributes.includes(removingSpec.attribute)) {
      onHighlightAttributesChange(
        highlightAttributes.filter(
          (attribute) => attribute !== removingSpec.attribute,
        ),
      );
    }
  }

  function updateAttribute(id: string, value: string) {
    const current = specs.find((spec) => spec.id === id);
    updateActiveSpecs(
      specs.map((spec) =>
        spec.id === id ? { ...spec, attribute: value } : spec,
      ),
    );

    if (
      current &&
      current.attribute !== value &&
      highlightAttributes.includes(current.attribute)
    ) {
      const nextHighlights = highlightAttributes.filter(
        (attribute) => attribute !== current.attribute,
      );
      if (value.trim()) {
        nextHighlights.push(value.trim());
      }
      onHighlightAttributesChange(Array.from(new Set(nextHighlights)));
    }
  }

  function updateValue(id: string, value: string) {
    updateActiveSpecs(
      specs.map((spec) => (spec.id === id ? { ...spec, value } : spec)),
    );
  }

  function toggleHighlight(attribute: string, checked: boolean) {
    if (!attribute.trim()) return;

    if (checked) {
      onHighlightAttributesChange(
        Array.from(new Set([...highlightAttributes, attribute.trim()])),
      );
      return;
    }

    onHighlightAttributesChange(
      highlightAttributes.filter((item) => item !== attribute),
    );
  }

  function addVariation() {
    const next = [
      ...variations,
      newVariation(variations.length + 1, activeVariation?.specs ?? []),
    ];
    onVariationsChange(next);
    onActiveVariationChange(next.at(-1)?.id ?? activeVariation.id);
  }

  function removeActiveVariation() {
    if (variations.length <= 1) {
      return;
    }

    const next = variations
      .filter((variation) => variation.id !== activeVariation.id)
      .map((variation, index) => ({ ...variation, order: index + 1 }));
    onVariationsChange(next);
    onActiveVariationChange(next[0].id);
  }

  function renameVariation(id: string, label: string) {
    onVariationsChange(
      variations.map((variation) =>
        variation.id === id ? { ...variation, label } : variation,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <AdminFormSection
        title="Variações do produto"
        description="Selecione a variação ativa para editar as especificações técnicas dela."
      >
        <div className="flex flex-wrap items-center gap-2">
          {variations.map((variation) => {
            const isActive = variation.id === activeVariation.id;

            return (
              <button
                key={variation.id}
                type="button"
                onClick={() => onActiveVariationChange(variation.id)}
                className={
                  isActive
                    ? "rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-foreground"
                    : "rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-muted-foreground"
                }
              >
                {variation.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={addVariation}
            className="inline-flex items-center justify-center rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            aria-label="Adicionar variação"
          >
            <Plus className="size-4" />
          </button>

          <button
            type="button"
            onClick={removeActiveVariation}
            disabled={variations.length <= 1}
            className="inline-flex items-center justify-center rounded-md border border-border px-2.5 py-1.5 text-sm text-muted-foreground hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Remover variação ativa"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 max-w-64">
          <AdminInput
            value={activeVariation.label}
            onChange={(event) =>
              renameVariation(activeVariation.id, event.target.value)
            }
            placeholder="Nome da variação"
            className="h-9 text-sm"
          />
        </div>
      </AdminFormSection>

      <AdminFormSection
        title="Especificações técnicas"
        description="Defina atributo e valor para a variação selecionada."
      >
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-8 px-2 py-2" />
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Atributo
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Valor
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                  Destaque
                </th>
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {specs.map((spec) => (
                <tr key={spec.id} className="group">
                  <td className="px-2 py-2">
                    <GripVertical className="size-4 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100" />
                  </td>
                  <td className="px-3 py-2">
                    <AdminInput
                      value={spec.attribute}
                      onChange={(event) =>
                        updateAttribute(spec.id, event.target.value)
                      }
                      placeholder="Ex: Potência RMS"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <AdminInput
                      value={spec.value}
                      onChange={(event) =>
                        updateValue(spec.id, event.target.value)
                      }
                      placeholder="Ex: 4000W RMS"
                      className="h-8 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <label className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={highlightAttributes.includes(spec.attribute)}
                        onChange={(event) =>
                          toggleHighlight(spec.attribute, event.target.checked)
                        }
                        className="size-4 accent-brand"
                      />
                      Sim
                    </label>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(spec.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {specs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-muted-foreground"
                  >
                    Nenhuma especificação adicionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
        >
          <Plus className="size-4" />
          Adicionar especificação
        </button>
      </AdminFormSection>
    </div>
  );
}
