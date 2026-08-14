"use client";

import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { cn } from "@/lib/utils";
import { reindexByOrder } from "@/lib/utils/reindex";
import { Plus, Trash2, X } from "lucide-react";
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
  /** Tightens spacing when the editor panel is narrow. */
  compact?: boolean;
}

/**
 * One attribute and every line recorded for it. Multiple lines are what the
 * site renders as a stacked matrix cell.
 */
interface SpecGroup {
  /** Attribute id, or the spec id while no attribute is chosen yet. */
  key: string;
  attribute_id: string;
  specs: WizardSpec[];
}

/**
 * Collapse the flat spec list into one group per attribute, preserving order.
 * Rows without an attribute yet stay on their own so several can be pending at
 * once.
 */
export function toGroups(specs: WizardSpec[]): SpecGroup[] {
  const groups: SpecGroup[] = [];
  const byAttribute = new Map<string, SpecGroup>();

  for (const spec of [...specs].sort((a, b) => a.order - b.order)) {
    if (!spec.attribute_id) {
      groups.push({ key: spec.id, attribute_id: "", specs: [spec] });
      continue;
    }

    const existing = byAttribute.get(spec.attribute_id);
    if (existing) {
      existing.specs.push(spec);
      continue;
    }

    const group: SpecGroup = {
      key: spec.attribute_id,
      attribute_id: spec.attribute_id,
      specs: [spec],
    };
    byAttribute.set(spec.attribute_id, group);
    groups.push(group);
  }

  return groups;
}

export function flatten(groups: SpecGroup[]): WizardSpec[] {
  return reindexByOrder(groups.flatMap((g) => g.specs));
}

export function SpecTable({
  specs,
  attributes,
  maxHighlights,
  locale,
  onChange,
  compact = false,
}: SpecTableProps) {
  const groups = toGroups(specs);

  // Highlighting is per attribute — the saved payload keeps a set of attribute
  // ids — so the budget counts groups, not lines.
  const highlightCount = groups.filter((g) =>
    g.specs.some((s) => s.highlighted),
  ).length;

  function replaceGroup(key: string, next: SpecGroup | null) {
    onChange(
      flatten(
        groups.flatMap((g) => {
          if (g.key !== key) return [g];
          return next ? [next] : [];
        }),
      ),
    );
  }

  function setAttribute(group: SpecGroup, attribute: Attribute | null) {
    replaceGroup(group.key, {
      key: attribute?.id ?? group.specs[0]!.id,
      attribute_id: attribute?.id ?? "",
      specs: group.specs.map((s) => ({
        ...s,
        attribute_id: attribute?.id ?? "",
        attribute_name: attribute?.name,
        highlighted: attribute?.type === "MATRIX" ? false : s.highlighted,
      })),
    });
  }

  /** Writes `text` into the edited locale of an I18nString field. */
  function withLocale(current: I18nString | undefined, text: string) {
    const next: I18nString = { ...current, pt: current?.pt ?? "" };
    if (locale === "pt") next.pt = text;
    else next[locale] = text || undefined;
    return next;
  }

  function setLineField(
    group: SpecGroup,
    specId: string,
    field: "value" | "description",
    text: string,
  ) {
    replaceGroup(group.key, {
      ...group,
      specs: group.specs.map((s) =>
        s.id === specId ? { ...s, [field]: withLocale(s[field], text) } : s,
      ),
    });
  }

  function addLine(group: SpecGroup) {
    const created = newSpec(0);
    replaceGroup(group.key, {
      ...group,
      specs: [
        ...group.specs,
        {
          ...created,
          attribute_id: group.attribute_id,
          attribute_name: group.specs[0]?.attribute_name,
          highlighted: false,
        },
      ],
    });
  }

  function removeLine(group: SpecGroup, specId: string) {
    const remaining = group.specs.filter((s) => s.id !== specId);
    replaceGroup(
      group.key,
      remaining.length ? { ...group, specs: remaining } : null,
    );
  }

  function setHighlighted(group: SpecGroup, highlighted: boolean) {
    replaceGroup(group.key, {
      ...group,
      specs: group.specs.map((s) => ({ ...s, highlighted })),
    });
  }

  function addGroup() {
    onChange(
      flatten([...groups, { key: "", attribute_id: "", specs: [newSpec(0)] }]),
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <SortableList
        items={groups}
        getId={(g) => g.key}
        onReorder={(reordered) => onChange(flatten(reordered))}
        renderItem={(group, handle) => {
          const isHighlighted = group.specs.some((s) => s.highlighted);
          const attribute = attributes.find((a) => a.id === group.attribute_id);
          const isMatrix =
            attribute?.type === "MATRIX" || group.specs.length > 1;
          const highlightDisabledReason = !group.attribute_id
            ? "Selecione um atributo para marcar como destaque."
            : isMatrix
              ? "Atributos com múltiplas linhas não podem ser destacados."
              : !isHighlighted && highlightCount >= maxHighlights
                ? `Você pode destacar no máximo ${maxHighlights} atributos.`
                : null;
          // An attribute belongs to exactly one group, so the ones already in
          // use elsewhere are not offered again.
          const takenElsewhere = new Set(
            groups
              .filter((g) => g.key !== group.key)
              .map((g) => g.attribute_id)
              .filter(Boolean),
          );
          const selectable = attributes.filter(
            (a) => !takenElsewhere.has(a.id),
          );

          return (
            <div className="rounded-md border border-border bg-card">
              <div
                className={cn(
                  "flex items-center gap-2 border-b border-border px-3",
                  compact ? "py-2" : "py-2.5",
                )}
              >
                <div className="flex shrink-0 items-center [&_button]:cursor-grab [&_button]:active:cursor-grabbing">
                  {handle}
                </div>

                <div className="min-w-0 flex-1">
                  <Combobox
                    items={selectable}
                    value={
                      attributes.find((a) => a.id === group.attribute_id) ??
                      null
                    }
                    itemToStringLabel={(a: Attribute) => a.name.pt}
                    onValueChange={(attr: Attribute | null) =>
                      setAttribute(group, attr)
                    }
                  >
                    <ComboboxTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-between overflow-hidden font-normal"
                        >
                          <ComboboxValue>
                            {(value: Attribute | null) =>
                              value?.name.pt ? (
                                <span className="block truncate">
                                  {value.name.pt}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  Selecione o atributo...
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
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-2xs text-muted-foreground uppercase">
                    Destaque
                  </span>
                  {highlightDisabledReason ? (
                    <Tooltip>
                      <TooltipTrigger render={<span tabIndex={0} />}>
                        <ToggleSwitch
                          checked={isHighlighted}
                          onChange={(checked) => setHighlighted(group, checked)}
                          disabled
                          aria-label="Marcar como destaque"
                        />
                      </TooltipTrigger>
                      <TooltipContent>{highlightDisabledReason}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <ToggleSwitch
                      checked={isHighlighted}
                      onChange={(checked) => setHighlighted(group, checked)}
                      aria-label="Marcar como destaque"
                    />
                  )}
                  <button
                    type="button"
                    aria-label="Remover especificação"
                    onClick={() => replaceGroup(group.key, null)}
                    className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 px-3 py-2.5">
                {group.specs.map((spec, i) => (
                  <div key={spec.id} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "grid min-w-0 flex-1 gap-2",
                        compact || !isMatrix ? "grid-cols-1" : "grid-cols-2",
                      )}
                    >
                      <Input
                        value={spec.value[locale] ?? ""}
                        onChange={(e) =>
                          setLineField(group, spec.id, "value", e.target.value)
                        }
                        placeholder="Título — ex: 1 x 3500W"
                      />
                      {isMatrix && (
                        <Input
                          value={spec.description?.[locale] ?? ""}
                          onChange={(e) =>
                            setLineField(
                              group,
                              spec.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Descrição — ex: 1 OHM"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remover linha ${i + 1}`}
                      onClick={() => removeLine(group, spec.id)}
                      className={cn(
                        "shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                        group.specs.length === 1 && "invisible",
                      )}
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}

                {isHighlighted ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={<span className="w-fit" tabIndex={0} />}
                    >
                      <button
                        type="button"
                        disabled
                        className="flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground opacity-50"
                      >
                        <Plus className="size-3.5" />
                        Adicionar linha
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Remova o destaque para adicionar mais linhas.
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    type="button"
                    onClick={() => addLine(group)}
                    className="flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Plus className="size-3.5" />
                    Adicionar linha
                  </button>
                )}
              </div>
            </div>
          );
        }}
        append={
          <button
            type="button"
            onClick={addGroup}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Plus className="size-4" />
            Adicionar Especificação
          </button>
        }
      />
    </div>
  );
}
