"use client";

import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import type { Attribute, I18nString } from "@/api/stetsom/model";
import { Plus, Trash2 } from "lucide-react";
import { ToggleSwitch } from "./toggle-switch";
import { newSpec, type WizardSpec } from "./wizard-store";

export type SpecLocale = "pt" | "en" | "es";

interface SpecTableProps {
  specs: WizardSpec[];
  attributes: Attribute[];
  maxHighlights: number;
  /** Locale edited across the whole table, chosen in the step header. */
  locale: SpecLocale;
  onChange: (specs: WizardSpec[]) => void;
  /** Stacked layout: attribute on top, value below, separated by border-b. */
  compact?: boolean;
}

function reindex(specs: WizardSpec[]): WizardSpec[] {
  return specs.map((s, i) => ({ ...s, order: i }));
}

export function SpecTable({
  specs,
  attributes,
  maxHighlights,
  locale,
  onChange,
  compact = false,
}: SpecTableProps) {
  const highlightCount = specs.filter((s) => s.highlighted).length;

  function update(id: string, patch: Partial<WizardSpec>) {
    onChange(specs.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function setValue(spec: WizardSpec, text: string) {
    const value: I18nString = { ...spec.value, pt: spec.value.pt ?? "" };
    if (locale === "pt") value.pt = text;
    else value[locale] = text || undefined;
    update(spec.id, { value });
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {!compact && (
        <div className="grid grid-cols-[44px_1fr_1fr_80px] gap-3 border-b border-border bg-muted px-3 py-2.5 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
          <span />
          <span>Atributo</span>
          <span>Valor</span>
          <span />
        </div>
      )}

      <SortableList
        items={specs}
        getId={(s) => s.id}
        onReorder={(list) => onChange(reindex(list))}
        renderItem={(spec, handle) => {
          const attrCombobox = (
            <Combobox
              items={attributes}
              value={attributes.find((a) => a.id === spec.attribute_id) ?? null}
              itemToStringLabel={(a: Attribute) => a.name.pt}
              onValueChange={(attr: Attribute | null) =>
                update(spec.id, {
                  attribute_id: attr?.id ?? "",
                  attribute_name: attr?.name,
                })
              }
            >
              <ComboboxTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal"
                  >
                    <ComboboxValue>
                      {(value: Attribute | null) =>
                        value?.name.pt ?? (
                          <span className="text-muted-foreground">
                            Selecione...
                          </span>
                        )
                      }
                    </ComboboxValue>
                  </Button>
                }
              />
              <ComboboxContent>
                <ComboboxInput
                  showTrigger={false}
                  placeholder="Buscar atributo"
                />
                <ComboboxEmpty>Nenhum atributo encontrado.</ComboboxEmpty>
                <ComboboxList>
                  {(a: Attribute) => (
                    <ComboboxItem key={a.id} value={a}>
                      {a.name.pt}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          );

          const deleteBtn = (
            <button
              type="button"
              aria-label="Remover especificação"
              onClick={() =>
                onChange(reindex(specs.filter((s) => s.id !== spec.id)))
              }
              className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          );

          if (compact) {
            return (
              <div className="border-b border-border bg-card last:border-b-0">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="flex shrink-0 items-center [&_button]:cursor-grab [&_button]:active:cursor-grabbing">
                    {handle}
                  </div>
                  <div className="min-w-0 flex-1">{attrCombobox}</div>
                  {deleteBtn}
                </div>
                <div className="border-t border-border px-3 pt-1.5 pb-2.5">
                  <Input
                    value={spec.value[locale] ?? ""}
                    onChange={(e) => setValue(spec, e.target.value)}
                    placeholder="Valor"
                  />
                </div>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-[44px_1fr_1fr_80px] gap-3 border-b border-border bg-card px-3 py-1.5 last:border-b-0">
              <div className="flex items-center [&_button]:cursor-grab [&_button]:active:cursor-grabbing">
                {handle}
              </div>
              {attrCombobox}
              <Input
                value={spec.value[locale] ?? ""}
                onChange={(e) => setValue(spec, e.target.value)}
                placeholder="Valor"
              />
              <div className="flex items-center justify-end gap-1 text-muted-foreground">
                {deleteBtn}
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
