"use client";

import type { Attribute, Template } from "@/api/stetsom/model";
import { CMS_UI } from "@/lib/cms/constants";
import { SpecTable, type SpecLocale } from "./spec-table";
import { VariationTabs } from "./variation-tabs";
import {
  newVariation,
  type WizardAction,
  type WizardSpec,
  type WizardState,
  type WizardVariation,
} from "./wizard-store";
import { useState } from "react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrFlag, EsFlag, UsFlag } from "@/components/ui/flag-icons";
import { cn } from "@/lib/utils";

const LOCALES: { id: SpecLocale; Flag: React.ComponentType; label: string }[] =
  [
    { id: "pt", Flag: BrFlag, label: "PT" },
    { id: "en", Flag: UsFlag, label: "EN" },
    { id: "es", Flag: EsFlag, label: "ES" },
  ];

interface StepSpecsProps {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  attributes: Attribute[];
  templates: Template[];
  compact?: boolean;
}

function buildSpecs(tpl: Template, attributes: Attribute[]): WizardSpec[] {
  return [...tpl.attributes]
    .sort((a, b) => a.order - b.order)
    .map((ta, i) => ({
      id: `spec-tpl-${ta.attribute_id}-${i}`,
      attribute_id: ta.attribute_id,
      attribute_name: attributes.find((a) => a.id === ta.attribute_id)?.name,
      value: { pt: "" },
      order: i,
      highlighted: false,
    }));
}

export function StepSpecs({
  state,
  dispatch,
  attributes,
  templates,
  compact = false,
}: StepSpecsProps) {
  const [locale, setLocale] = useState<SpecLocale>("pt");

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
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2.5">
        <h2 className="text-sm font-semibold">Especificações Técnicas</h2>
        <Combobox
          items={templates}
          itemToStringLabel={(item: Template) => item.name["pt"]}
          onValueChange={(template) => {
            if (!template) return;

            dispatch({
              type: "apply_template",
              specs: buildSpecs(template, attributes),
            });
          }}
        >
          <ComboboxInput placeholder="Aplicar Template" />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.name["pt"]}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <div
        className={cn(
          "flex border-b border-border px-3 py-2.5",
          compact ? "flex-col gap-2" : "flex-wrap items-center gap-x-4 gap-y-2",
        )}
      >
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
        <Tabs value={locale} onValueChange={(v) => setLocale(v as SpecLocale)}>
          <TabsList className="gap-0.5">
            {LOCALES.map((loc) => (
              <TabsTrigger key={loc.id} value={loc.id} className="gap-1.5">
                <loc.Flag />
                <span className="text-xs font-semibold uppercase">
                  {loc.label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-auto px-3 py-2.5">
        <SpecTable
          specs={active.specs}
          attributes={attributes}
          maxHighlights={CMS_UI.MAX_HIGHLIGHTS}
          locale={locale}
          onChange={patchActiveSpecs}
          compact={compact}
        />
      </div>
    </div>
  );
}
