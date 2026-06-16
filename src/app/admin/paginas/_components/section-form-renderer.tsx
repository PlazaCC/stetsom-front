"use client";

import type { I18nString } from "@/api/stetsom/model";
import {
  AdminInput,
  AdminLabel,
  AdminSelect,
} from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Plus, Trash2 } from "lucide-react";
import type { FieldSpec } from "./section-field-spec";

type Data = Record<string, unknown>;
type Item = Record<string, unknown>;

/** Coerce any persisted value into an editable I18nString ({ pt, en?, es? }). */
function asI18n(value: unknown): I18nString {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as I18nString;
  }
  if (typeof value === "string") return { pt: value };
  return { pt: "" };
}

function asStr(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(36).slice(2)}`;
}

/** Stable drag id for a list item — uses its persisted id or a positional one. */
function itemId(item: Item, index: number): string {
  const id = item.id;
  return typeof id === "string" && id ? id : `idx-${index}`;
}

interface FieldProps {
  field: FieldSpec;
  data: Data;
  onChange: (data: Data) => void;
}

function Field({ field, data, onChange }: FieldProps) {
  switch (field.kind) {
    case "i18n":
      return (
        <I18nInput
          label={field.label}
          multiline={field.multiline}
          value={asI18n(data[field.key])}
          onChange={(v) => onChange({ ...data, [field.key]: v })}
        />
      );

    case "text":
      return (
        <div>
          <AdminLabel>{field.label}</AdminLabel>
          <AdminInput
            type={field.inputType ?? "text"}
            placeholder={field.placeholder}
            value={asStr(data[field.key])}
            onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
          />
        </div>
      );

    case "select":
      return (
        <div>
          <AdminLabel>{field.label}</AdminLabel>
          <AdminSelect
            value={asStr(data[field.key])}
            onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
          >
            <option value="">—</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </AdminSelect>
        </div>
      );

    case "asset":
      return (
        <LibraryAssetPicker
          label={field.label}
          type={field.assetType ?? "IMAGE"}
          variant={field.variant ?? "image"}
          accept={field.accept}
          value={{ file_url: asStr(data[field.key]) }}
          onChange={(asset) =>
            onChange({ ...data, [field.key]: asset?.file_url ?? "" })
          }
        />
      );

    case "group": {
      const group =
        data[field.key] && typeof data[field.key] === "object"
          ? (data[field.key] as Data)
          : {};
      return (
        <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {field.label}
          </p>
          {field.fields.map((sub) => (
            <Field
              key={sub.key}
              field={sub}
              data={group}
              onChange={(next) => onChange({ ...data, [field.key]: next })}
            />
          ))}
        </div>
      );
    }

    case "stringList":
      return <StringListField field={field} data={data} onChange={onChange} />;

    case "list":
      return <ListField field={field} data={data} onChange={onChange} />;

    default:
      return null;
  }
}

function StringListField({
  field,
  data,
  onChange,
}: {
  field: Extract<FieldSpec, { kind: "stringList" }>;
  data: Data;
  onChange: (data: Data) => void;
}) {
  const values: string[] = Array.isArray(data[field.key])
    ? (data[field.key] as unknown[]).map(asStr)
    : [];

  function set(next: string[]) {
    onChange({ ...data, [field.key]: next });
  }

  return (
    <div className="space-y-2">
      <AdminLabel>{field.label}</AdminLabel>
      <SortableList
        items={values.map((value, i) => ({ value, i, key: `s-${i}` }))}
        getId={(it) => it.key}
        onReorder={(next) => set(next.map((it) => it.value))}
        renderItem={(it, handle) => {
          const i = it.i;
          return (
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5">
              {handle}
              <AdminInput
                className="border-0 px-1 py-0.5 focus:ring-0"
                placeholder={field.placeholder}
                value={it.value}
                onChange={(e) =>
                  set(values.map((v, j) => (j === i ? e.target.value : v)))
                }
              />
              <button
                type="button"
                aria-label="Remover"
                onClick={() => set(values.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        }}
      />
      <button
        type="button"
        onClick={() => set([...values, ""])}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="size-4" />
        {field.addLabel}
      </button>
    </div>
  );
}

function ListField({
  field,
  data,
  onChange,
}: {
  field: Extract<FieldSpec, { kind: "list" }>;
  data: Data;
  onChange: (data: Data) => void;
}) {
  const items: Item[] = Array.isArray(data[field.key])
    ? (data[field.key] as Item[])
    : [];

  function set(next: Item[]) {
    onChange({ ...data, [field.key]: next });
  }

  function rowTitle(item: Item, index: number): string {
    if (field.itemTitleKey) {
      const raw = item[field.itemTitleKey];
      const text =
        typeof raw === "string"
          ? raw
          : raw && typeof raw === "object"
            ? asI18n(raw).pt
            : "";
      if (text) return text;
    }
    return `Item ${index + 1}`;
  }

  const indexed = items.map((item, i) => ({ item, i, key: itemId(item, i) }));

  return (
    <div className="space-y-2">
      <AdminLabel>{field.label}</AdminLabel>
      <SortableList
        items={indexed}
        getId={(it) => it.key}
        onReorder={(next) => set(next.map((it) => it.item))}
        renderItem={({ item, i }, handle) => (
          <div className="space-y-3 rounded-md border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              {handle}
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-muted-foreground">
                {rowTitle(item, i)}
              </span>
              <button
                type="button"
                aria-label="Remover"
                onClick={() => set(items.filter((_, j) => j !== i))}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {field.itemFields.map((sub) => (
              <Field
                key={sub.key}
                field={sub}
                data={item}
                onChange={(next) =>
                  set(items.map((it, j) => (j === i ? next : it)))
                }
              />
            ))}
          </div>
        )}
      />
      <button
        type="button"
        onClick={() => set([...items, { id: newId() }])}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="size-4" />
        {field.addLabel}
      </button>
    </div>
  );
}

interface SectionFormRendererProps {
  fields: FieldSpec[];
  data: Data;
  onChange: (data: Data) => void;
}

export function SectionFormRenderer({
  fields,
  data,
  onChange,
}: SectionFormRendererProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <Field key={field.key} field={field} data={data} onChange={onChange} />
      ))}
    </div>
  );
}
