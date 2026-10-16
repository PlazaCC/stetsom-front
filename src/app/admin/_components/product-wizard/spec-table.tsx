"use client";

import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Attribute,
  AttributeGroup,
  I18nString,
} from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { reindexByOrder } from "@/lib/utils/reindex";
import { AlertTriangle, Plus, Trash2, X } from "lucide-react";
import { ToggleSwitch } from "./toggle-switch";
import { newSpec, type TemplateLayout, type WizardSpec } from "./wizard-store";

export type SpecLocale = "pt" | "en" | "es";

interface SpecTableProps {
  specs: WizardSpec[];
  attributes: Attribute[];
  attributeGroups: AttributeGroup[];
  /**
   * attribute_id → group_id of the product's template. When set, only the
   * template's attributes can be added, each under its template group.
   */
  templateLayout: TemplateLayout | null;
  maxHighlights: number;
  /** Locale edited across the whole table, chosen in the step header. */
  locale: SpecLocale;
  onChange: (specs: WizardSpec[]) => void;
  /** Tightens spacing when the editor panel is narrow. */
  compact?: boolean;
}

/**
 * One attribute and every line recorded for it. Multiple lines are the
 * entries of a matrix cell, rendered side by side on the site.
 */
interface AttributeRows {
  /** Attribute id, or the spec id while no attribute is chosen yet. */
  key: string;
  attribute_id: string;
  specs: WizardSpec[];
}

/** One section of the table: an attribute group and the attributes under it. */
interface GroupSection {
  /** Group id; empty for lines saved before groups existed. */
  group_id: string;
  rows: AttributeRows[];
}

/**
 * Collapse the flat spec list into sections, in the order each group first
 * appears, and each section into one entry per attribute. Rows without an
 * attribute yet stay on their own so several can be pending at once.
 */
export function toSections(specs: WizardSpec[]): GroupSection[] {
  const sections: GroupSection[] = [];
  const sectionByGroup = new Map<string, GroupSection>();
  const rowsByKey = new Map<string, AttributeRows>();

  for (const spec of [...specs].sort((a, b) => a.order - b.order)) {
    let section = sectionByGroup.get(spec.group_id);
    if (!section) {
      section = { group_id: spec.group_id, rows: [] };
      sectionByGroup.set(spec.group_id, section);
      sections.push(section);
    }

    if (!spec.attribute_id) {
      section.rows.push({ key: spec.id, attribute_id: "", specs: [spec] });
      continue;
    }

    const rowKey = `${spec.group_id}:${spec.attribute_id}`;
    const existing = rowsByKey.get(rowKey);
    if (existing) {
      existing.specs.push(spec);
      continue;
    }
    const rows: AttributeRows = {
      key: spec.attribute_id,
      attribute_id: spec.attribute_id,
      specs: [spec],
    };
    rowsByKey.set(rowKey, rows);
    section.rows.push(rows);
  }

  return sections;
}

/** Back to a flat list: lines of a section stay contiguous, orders dense. */
export function flattenSections(sections: GroupSection[]): WizardSpec[] {
  return reindexByOrder(
    sections.flatMap((section) =>
      section.rows.flatMap((row) =>
        row.specs.map((spec) => ({ ...spec, group_id: section.group_id })),
      ),
    ),
  );
}

export function SpecTable({
  specs,
  attributes,
  attributeGroups,
  templateLayout,
  maxHighlights,
  locale,
  onChange,
  compact = false,
}: SpecTableProps) {
  const sections = toSections(specs);
  const allRows = sections.flatMap((s) => s.rows);

  // Highlighting is per attribute — the saved payload keeps a set of attribute
  // ids — so the budget counts attributes, not lines.
  const highlightCount = allRows.filter((r) =>
    r.specs.some((s) => s.highlighted),
  ).length;

  const usedAttributeIds = new Set(
    allRows.map((r) => r.attribute_id).filter(Boolean),
  );

  // With a template the table can only hold the template's groups; without
  // one any registered group can be added.
  const allowedGroupIds = templateLayout
    ? new Set(templateLayout.values())
    : new Set(attributeGroups.map((g) => g.id));
  const addableGroups = attributeGroups.filter(
    (g) =>
      allowedGroupIds.has(g.id) && !sections.some((s) => s.group_id === g.id),
  );

  function groupName(groupId: string) {
    return attributeGroups.find((g) => g.id === groupId)?.name.pt ?? "Grupo";
  }

  function commit(next: GroupSection[]) {
    onChange(flattenSections(next));
  }

  function replaceSection(groupId: string, next: GroupSection | null) {
    commit(
      sections.flatMap((s) => {
        if (s.group_id !== groupId) return [s];
        return next && next.rows.length > 0 ? [next] : [];
      }),
    );
  }

  function replaceRows(
    section: GroupSection,
    key: string,
    next: AttributeRows | null,
  ) {
    replaceSection(section.group_id, {
      ...section,
      rows: section.rows.flatMap((r) => {
        if (r.key !== key) return [r];
        return next ? [next] : [];
      }),
    });
  }

  /** Moves an attribute (all its lines) to another group, at the end. */
  function moveRows(from: GroupSection, row: AttributeRows, toGroupId: string) {
    const withoutRow = sections
      .map((s) =>
        s.group_id === from.group_id
          ? { ...s, rows: s.rows.filter((r) => r.key !== row.key) }
          : s,
      )
      .filter((s) => s.rows.length > 0);
    const target = withoutRow.find((s) => s.group_id === toGroupId);
    commit(
      target
        ? withoutRow.map((s) =>
            s === target ? { ...s, rows: [...s.rows, row] } : s,
          )
        : [...withoutRow, { group_id: toGroupId, rows: [row] }],
    );
  }

  function addSection(groupId: string) {
    commit([
      ...sections,
      {
        group_id: groupId,
        rows: [{ key: "", attribute_id: "", specs: [newSpec(0, groupId)] }],
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      <SortableList
        items={sections}
        getId={(s) => s.group_id || "__ungrouped__"}
        onReorder={commit}
        className="space-y-3"
        renderItem={(section, sectionHandle) => {
          // Template attributes of this group, or anything when there is no
          // template; an attribute appears once in the whole table.
          const selectable = attributes.filter((a) =>
            templateLayout
              ? templateLayout.get(a.id) === section.group_id
              : true,
          );
          const otherGroups = attributeGroups.filter(
            (g) => g.id !== section.group_id && allowedGroupIds.has(g.id),
          );
          const isUngrouped = !section.group_id;

          return (
            <div
              className={cn(
                "rounded-md border bg-muted/30",
                isUngrouped ? "border-amber-400" : "border-border",
              )}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="flex shrink-0 items-center">
                  {sectionHandle}
                </div>
                {isUngrouped ? (
                  <span className="flex flex-1 items-center gap-1.5 text-sm font-semibold text-amber-700">
                    <AlertTriangle className="size-4" />
                    Sem grupo — mova cada atributo para um grupo
                  </span>
                ) : (
                  <span className="flex-1 text-sm font-semibold text-foreground uppercase">
                    {groupName(section.group_id)}
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Remover grupo e seus atributos"
                  onClick={() => replaceSection(section.group_id, null)}
                  className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2 px-2 pb-2">
                <SortableList
                  items={section.rows}
                  getId={(r) => r.key || r.specs[0]!.id}
                  onReorder={(rows) =>
                    replaceSection(section.group_id, { ...section, rows })
                  }
                  renderItem={(row, handle) => (
                    <AttributeCard
                      row={row}
                      handle={handle}
                      attributes={attributes}
                      selectable={selectable.filter(
                        (a) =>
                          a.id === row.attribute_id ||
                          !usedAttributeIds.has(a.id),
                      )}
                      otherGroups={otherGroups}
                      canChangeGroup={!templateLayout || isUngrouped}
                      highlightCount={highlightCount}
                      maxHighlights={maxHighlights}
                      locale={locale}
                      compact={compact}
                      onChange={(next) => replaceRows(section, row.key, next)}
                      onMove={(toGroupId) => moveRows(section, row, toGroupId)}
                    />
                  )}
                  append={
                    !isUngrouped && (
                      <button
                        type="button"
                        onClick={() =>
                          replaceSection(section.group_id, {
                            ...section,
                            rows: [
                              ...section.rows,
                              {
                                key: "",
                                attribute_id: "",
                                specs: [newSpec(0, section.group_id)],
                              },
                            ],
                          })
                        }
                        className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        <Plus className="size-3.5" />
                        Adicionar atributo em {groupName(section.group_id)}
                      </button>
                    )
                  }
                />
              </div>
            </div>
          );
        }}
      />

      {addableGroups.length > 0 ? (
        <Select
          value=""
          onValueChange={(value) => {
            if (value) addSection(value);
          }}
        >
          <SelectTrigger className="w-full border-dashed">
            <SelectValue placeholder="Adicionar grupo de atributos..." />
          </SelectTrigger>
          <SelectContent>
            {addableGroups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name.pt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        attributeGroups.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum grupo de atributos cadastrado. Cadastre os grupos em Catálogo
            › Grupos de atributos.
          </p>
        )
      )}
    </div>
  );
}

interface AttributeCardProps {
  row: AttributeRows;
  handle: React.ReactNode;
  attributes: Attribute[];
  /** Attributes this row may switch to. */
  selectable: Attribute[];
  otherGroups: AttributeGroup[];
  /** False when a template fixes the group of every attribute. */
  canChangeGroup: boolean;
  highlightCount: number;
  maxHighlights: number;
  locale: SpecLocale;
  compact: boolean;
  onChange: (next: AttributeRows | null) => void;
  onMove: (toGroupId: string) => void;
}

function AttributeCard({
  row,
  handle,
  attributes,
  selectable,
  otherGroups,
  canChangeGroup,
  highlightCount,
  maxHighlights,
  locale,
  compact,
  onChange,
  onMove,
}: AttributeCardProps) {
  const isHighlighted = row.specs.some((s) => s.highlighted);
  const attribute = attributes.find((a) => a.id === row.attribute_id);
  const isMatrix = attribute?.type === "MATRIX" || row.specs.length > 1;
  const highlightDisabledReason = !row.attribute_id
    ? "Selecione um atributo para marcar como destaque."
    : isMatrix
      ? "Atributos com múltiplas linhas não podem ser destacados."
      : !isHighlighted && highlightCount >= maxHighlights
        ? `Você pode destacar no máximo ${maxHighlights} atributos.`
        : null;

  function setAttribute(next: Attribute | null) {
    onChange({
      key: next?.id ?? row.specs[0]!.id,
      attribute_id: next?.id ?? "",
      specs: row.specs.map((s) => ({
        ...s,
        attribute_id: next?.id ?? "",
        attribute_name: next?.name,
        highlighted: next?.type === "MATRIX" ? false : s.highlighted,
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
    specId: string,
    field: "value" | "description",
    text: string,
  ) {
    onChange({
      ...row,
      specs: row.specs.map((s) =>
        s.id === specId ? { ...s, [field]: withLocale(s[field], text) } : s,
      ),
    });
  }

  function addLine() {
    const first = row.specs[0]!;
    onChange({
      ...row,
      specs: [
        ...row.specs,
        {
          ...newSpec(0, first.group_id),
          attribute_id: row.attribute_id,
          attribute_name: first.attribute_name,
        },
      ],
    });
  }

  function removeLine(specId: string) {
    const remaining = row.specs.filter((s) => s.id !== specId);
    onChange(remaining.length ? { ...row, specs: remaining } : null);
  }

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
            value={attribute ?? null}
            itemToStringLabel={(a: Attribute) => a.name.pt}
            onValueChange={(attr: Attribute | null) => setAttribute(attr)}
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
                        <span className="block truncate">{value.name.pt}</span>
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
              <ComboboxEmpty>Nenhum atributo disponível.</ComboboxEmpty>
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
          {canChangeGroup && otherGroups.length > 0 && row.attribute_id && (
            <Select
              value=""
              onValueChange={(to) => {
                if (to) onMove(to);
              }}
            >
              <SelectTrigger
                size="sm"
                className="h-7 w-auto gap-1 px-1.5 text-xs text-muted-foreground"
                aria-label="Mover para outro grupo"
              >
                <SelectValue placeholder="Grupo" />
              </SelectTrigger>
              <SelectContent>
                {otherGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name.pt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <span className="text-2xs text-muted-foreground uppercase">
            Destaque
          </span>
          {highlightDisabledReason ? (
            <Tooltip>
              <TooltipTrigger render={<span tabIndex={0} />}>
                <ToggleSwitch
                  checked={isHighlighted}
                  onChange={() => {}}
                  disabled
                  aria-label="Marcar como destaque"
                />
              </TooltipTrigger>
              <TooltipContent>{highlightDisabledReason}</TooltipContent>
            </Tooltip>
          ) : (
            <ToggleSwitch
              checked={isHighlighted}
              onChange={(checked) =>
                onChange({
                  ...row,
                  specs: row.specs.map((s) => ({ ...s, highlighted: checked })),
                })
              }
              aria-label="Marcar como destaque"
            />
          )}
          <button
            type="button"
            aria-label="Remover especificação"
            onClick={() => onChange(null)}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 px-3 py-2.5">
        {row.specs.map((spec, i) => (
          <div key={spec.id} className="flex items-start gap-2">
            <div
              className={cn(
                "grid min-w-0 flex-1 gap-2",
                compact || !isMatrix ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {isMatrix ? (
                <Input
                  value={spec.value[locale] ?? ""}
                  onChange={(e) =>
                    setLineField(spec.id, "value", e.target.value)
                  }
                  placeholder="Valor — ex: 1 x 3500W"
                />
              ) : (
                // Text values may span lines (e.g. "Freq: …" / "Boost: …");
                // the site keeps the breaks.
                <Textarea
                  rows={1}
                  value={spec.value[locale] ?? ""}
                  onChange={(e) =>
                    setLineField(spec.id, "value", e.target.value)
                  }
                  placeholder="Valor — ex: 2,8 kg"
                  className="min-h-9 resize-y"
                />
              )}
              {isMatrix && (
                <Input
                  value={spec.description?.[locale] ?? ""}
                  onChange={(e) =>
                    setLineField(spec.id, "description", e.target.value)
                  }
                  placeholder="Rótulo — ex: @1 Ohm"
                />
              )}
            </div>
            <button
              type="button"
              aria-label={`Remover linha ${i + 1}`}
              onClick={() => removeLine(spec.id)}
              className={cn(
                "mt-2 shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
                row.specs.length === 1 && "invisible",
              )}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {isHighlighted ? (
          <Tooltip>
            <TooltipTrigger render={<span className="w-fit" tabIndex={0} />}>
              <button
                type="button"
                disabled
                className="flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground opacity-50"
              >
                <Plus className="size-3.5" />
                Adicionar entrada
              </button>
            </TooltipTrigger>
            <TooltipContent>
              Remova o destaque para adicionar mais entradas.
            </TooltipContent>
          </Tooltip>
        ) : (
          <button
            type="button"
            onClick={addLine}
            className="flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Plus className="size-3.5" />
            Adicionar entrada
          </button>
        )}
      </div>
    </div>
  );
}
