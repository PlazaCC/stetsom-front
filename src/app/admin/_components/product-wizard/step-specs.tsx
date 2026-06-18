"use client";

import type { Attribute, Template } from "@/api/stetsom/model";
import { CMS_UI } from "@/lib/cms/constants";
import { SpecTable } from "./spec-table";
import { TemplatePicker } from "./template-picker";
import { VariationTabs } from "./variation-tabs";
import {
  newVariation,
  type WizardAction,
  type WizardSpec,
  type WizardState,
  type WizardVariation,
} from "./wizard-store";

interface StepSpecsProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  attributes: Attribute[];
  templates: Template[];
}

export function StepSpecs({
  state,
  dispatch,
  attributes,
  templates,
}: StepSpecsProps) {
  const active =
    state.variations.find((v) => v.id === state.activeVariationId) ??
    state.variations[0]!;

  function setVariations(variations: WizardVariation[]) {
    dispatch({ type: "set_variations", variations });
  }

  function patchActiveSpecs(specs: WizardSpec[]) {
    setVariations(
      state.variations.map((v) => (v.id === active.id ? { ...v, specs } : v)),
    );
  }

  function addVariation() {
    const created = newVariation(state.variations.length + 1, active.specs);
    setVariations([...state.variations, created]);
    dispatch({ type: "set_active_variation", id: created.id });
  }

  function removeVariation(id: string) {
    const next = state.variations.filter((v) => v.id !== id);
    setVariations(next);
    if (id === state.activeVariationId && next[0]) {
      dispatch({ type: "set_active_variation", id: next[0].id });
    }
  }

  function renameVariation(id: string, label: string) {
    setVariations(
      state.variations.map((v) => (v.id === id ? { ...v, label } : v)),
    );
  }

  return (
    <div className="rounded-[16px] border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
        <h2 className="text-xl font-bold text-foreground">
          Especificações Técnicas
        </h2>
        <TemplatePicker
          templates={templates}
          attributes={attributes}
          categoryId={state.category_id}
          onApply={(specs) => dispatch({ type: "apply_template", specs })}
        />
      </div>

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Variações do produto
          </span>
          <VariationTabs
            variations={state.variations}
            activeId={state.activeVariationId}
            onSelect={(id) => dispatch({ type: "set_active_variation", id })}
            onRename={renameVariation}
            onRemove={removeVariation}
            onAdd={addVariation}
          />
        </div>

        <SpecTable
          specs={active.specs}
          attributes={attributes}
          maxHighlights={CMS_UI.MAX_HIGHLIGHTS}
          onChange={patchActiveSpecs}
        />
      </div>
    </div>
  );
}
