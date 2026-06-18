"use client";

import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import type {
  WizardProductSpec,
  WizardProductVariation,
} from "@/app/admin/_components/product-wizard-types";
import type { Attribute } from "@/api/stetsom/model";
import { CMS_UI } from "@/lib/cms/constants";
import { cn } from "@/lib/utils";
import { Layers, Plus, Trash2 } from "lucide-react";

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
  const attributeOptions = attributes.map((a) => ({
    value: a.id,
    label: a.name.pt,
  }));

  function reindex(list: WizardProductVariation[]): WizardProductVariation[] {
    return list.map((v, i) => ({ ...v, order: i }));
  }

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

  function updateVariation(id: string, patch: Partial<WizardProductVariation>) {
    onVariationsChange(
      variations.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    );
  }

  function addVariation() {
    const next = reindex([
      ...variations,
      newVariation(variations.length + 1, activeVariation?.specs ?? []),
    ]);
    onVariationsChange(next);
    onActiveVariationChange(next.at(-1)?.id ?? activeVariation?.id);
  }

  function removeVariation(id: string) {
    const next = reindex(variations.filter((v) => v.id !== id));
    onVariationsChange(next);
    if (id === activeVariationId && next.length > 0) {
      onActiveVariationChange(next[0]!.id);
    }
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* Card 1 — variations */}
      <div className="rounded-[16px] border border-border bg-card lg:w-72 lg:shrink-0">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Variações</h3>
        </div>
        <div className="space-y-2 p-3">
          <SortableList
            items={variations}
            getId={(v) => v.id}
            onReorder={(items) => onVariationsChange(reindex(items))}
            renderItem={(v, handle) => {
              const isActive = v.id === activeVariationId;
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
                    onClick={() => onActiveVariationChange(v.id)}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {v.label || "Sem nome"}
                    </span>
                    <span className="shrink-0 text-2xs text-muted-foreground">
                      {v.specs.length} specs
                    </span>
                  </button>
                  {variations.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remover variação"
                      onClick={() => removeVariation(v.id)}
                      className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              );
            }}
          />

          <button
            type="button"
            onClick={addVariation}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" />
            Adicionar variação
          </button>
        </div>
      </div>

      {/* Card 2 — specs of the selected variation */}
      <div className="min-w-0 flex-1 rounded-[16px] border border-border bg-card">
        {activeVariation ? (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Layers className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {activeVariation.label || "Variação"}
              </span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {activeSpecs.length} specs
              </span>
            </div>

            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Nome da variação
                </label>
                <Input
                  value={activeVariation.label}
                  onChange={(e) =>
                    updateVariation(activeVariation.id, {
                      label: e.target.value,
                    })
                  }
                  placeholder="Ex: 2 Ohms"
                />
              </div>

              <div>
                <p className="mb-2 text-xs text-muted-foreground">
                  {`Selecione o atributo e informe o valor. Até ${CMS_UI.MAX_HIGHLIGHTS} podem ser destacados no cabeçalho do produto.`}
                </p>

                <div className="space-y-2">
                  {activeSpecs.map((spec) => {
                    return (
                      <div
                        key={spec.id}
                        className="flex flex-wrap items-end gap-3 rounded-md border border-border bg-card p-3"
                      >
                        <div className="flex-1 shrink-0">
                          <label className="mb-1 block text-xs font-medium text-muted-foreground">
                            Atributo
                          </label>
                          <Combobox
                            items={attributeOptions}
                            value={
                              attributeOptions.find(
                                (o) => o.value === spec.attribute_id,
                              ) ?? null
                            }
                            isItemEqualToValue={(a, b) => a.value === b.value}
                            onValueChange={(val) => {
                              const attr = val
                                ? attributes.find((a) => a.id === val.value)
                                : undefined;
                              patchActiveSpecs((specs) =>
                                specs.map((s) =>
                                  s.id === spec.id
                                    ? {
                                        ...s,
                                        attribute_id: val?.value ?? "",
                                        attribute_name: attr?.name,
                                      }
                                    : s,
                                ),
                              );
                            }}
                          >
                            <ComboboxInput
                              className="w-full"
                              placeholder="Selecione..."
                            />
                            <ComboboxContent>
                              <ComboboxEmpty>
                                Nenhum atributo encontrado.
                              </ComboboxEmpty>
                              <ComboboxList>
                                {(option: { value: string; label: string }) => (
                                  <ComboboxItem
                                    key={option.value}
                                    value={option}
                                  >
                                    {option.label}
                                  </ComboboxItem>
                                )}
                              </ComboboxList>
                            </ComboboxContent>
                          </Combobox>
                        </div>
                        <I18nInput
                          className="min-w-48 flex-1"
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
                    patchActiveSpecs((specs) => [
                      ...specs,
                      newSpec(specs.length),
                    ])
                  }
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="size-4" />
                  Adicionar especificação
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Selecione uma variação para editar.
          </div>
        )}
      </div>
    </div>
  );
}
