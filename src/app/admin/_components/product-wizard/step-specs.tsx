"use client";

import type { Attribute, AttributeGroup, Template } from "@/api/stetsom/model";
import { Button } from "@/components/ui/button";
import { CMS_UI } from "@/lib/cms/constants";
import { FileSpreadsheet } from "lucide-react";
import { SpecImportDialog } from "./spec-import-dialog";
import { SpecTable, type SpecLocale } from "./spec-table";
import { VariationTabs } from "./variation-tabs";
import {
  newVariation,
  templateLayoutOf,
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
  attributeGroups: AttributeGroup[];
  templates: Template[];
  compact?: boolean;
}

/** One empty line per template attribute, group by group, in template order. */
function buildSpecs(tpl: Template, attributes: Attribute[]): WizardSpec[] {
  return [...tpl.groups]
    .sort((a, b) => a.order - b.order)
    .flatMap((group) =>
      [...group.attributes]
        .sort((a, b) => a.order - b.order)
        .map((ta) => ({
          group_id: group.group_id,
          attribute_id: ta.attribute_id,
        })),
    )
    .map((ta, i) => ({
      id: `spec-tpl-${ta.attribute_id}-${i}`,
      attribute_id: ta.attribute_id,
      attribute_name: attributes.find((a) => a.id === ta.attribute_id)?.name,
      group_id: ta.group_id,
      value: { pt: "" },
      order: i,
      highlighted: false,
    }));
}

export function StepSpecs({
  state,
  dispatch,
  attributes,
  attributeGroups,
  templates,
  compact = false,
}: StepSpecsProps) {
  const [locale, setLocale] = useState<SpecLocale>("pt");
  const [importOpen, setImportOpen] = useState(false);

  // Templates are scoped to the product's category — the list stays empty until
  // one is picked, so the combobox has nothing to apply before that.
  const hasCategory = Boolean(state.category_id);
  const categoryTemplates = templates.filter(
    (template) => template.category_id === state.category_id,
  );
  const currentTemplate = categoryTemplates.find(
    (template) => template.id === state.template_id,
  );

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
          items={categoryTemplates}
          value={currentTemplate ?? null}
          itemToStringLabel={(item: Template) => item.name["pt"]}
          onValueChange={(template: Template | null) => {
            if (!template) return;

            dispatch({
              type: "apply_template",
              templateId: template.id,
              specs: buildSpecs(template, attributes),
            });
          }}
        >
          <ComboboxInput
            disabled={!hasCategory}
            placeholder={
              hasCategory
                ? "Aplicar Template"
                : "Selecione uma categoria primeiro"
            }
          />
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => setImportOpen(true)}
        >
          <FileSpreadsheet className="size-4" />
          Importar planilha
        </Button>
      </div>

      {importOpen && (
        <SpecImportDialog
          templateId={state.template_id}
          templateName={currentTemplate?.name.pt}
          productName={state.name.pt}
          variations={state.variations}
          onApply={(variations) => {
            setVariations(variations);
            if (variations[0]) {
              dispatch({ type: "set_active_variation", id: variations[0].id });
            }
          }}
          onClose={() => setImportOpen(false)}
        />
      )}

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
          attributeGroups={attributeGroups}
          templateLayout={templateLayoutOf(currentTemplate)}
          maxHighlights={CMS_UI.MAX_HIGHLIGHTS}
          locale={locale}
          onChange={patchActiveSpecs}
          compact={compact}
        />
      </div>
    </div>
  );
}
