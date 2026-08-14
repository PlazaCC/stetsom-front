"use client";

import type { I18nString, ProductCardItem } from "@/api/stetsom/model";
import { AdminLabel } from "@/app/admin/_components/crud/admin-input";
import { I18nInput } from "@/app/admin/_components/crud/i18n-input";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { LibraryAssetPicker } from "@/app/admin/_components/crud/library-asset-picker";
import type { LibraryUrlOnlyRef } from "@/app/admin/_components/crud/library-asset-ref";
import { SortableList } from "@/app/admin/_components/crud/sortable-list";
import { Plus, Trash2 } from "lucide-react";
import { useGetApiCategories } from "@/api/stetsom";
import { useGetApiProducts } from "@/api/stetsom";
import type { FieldSpec } from "./section-field-spec";
import { FaqItemsField } from "./faq-items-field";
import { useEffect, useState } from "react";

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
          <Input
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
          <Select
            value={asStr(data[field.key])}
            onValueChange={(value) =>
              onChange({ ...data, [field.key]: value ?? "" })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="—" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">—</SelectItem>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "asset": {
      // Page-section `data` only persists a flat URL for this field kind —
      // the public renderer never reads a sibling `library_id`.
      const value: LibraryUrlOnlyRef = { file_url: asStr(data[field.key]) };
      return (
        <LibraryAssetPicker
          label={field.label}
          type={field.assetType ?? "IMAGE"}
          variant={field.variant ?? "image"}
          accept={field.accept}
          value={value}
          onChange={(asset) =>
            onChange({ ...data, [field.key]: asset?.file_url ?? "" })
          }
        />
      );
    }

    case "group": {
      const group =
        data[field.key] && typeof data[field.key] === "object"
          ? (data[field.key] as Data)
          : {};
      return (
        <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
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

    case "featured-tabs":
      return (
        <FeaturedTabsField data={data} field={field} onChange={onChange} />
      );

    case "stringList":
      return <StringListField field={field} data={data} onChange={onChange} />;

    case "list":
      return <ListField field={field} data={data} onChange={onChange} />;

    case "faq-items":
      return <FaqItemsField field={field} />;

    default:
      return null;
  }
}

function FeaturedTabsField({
  field,
  data,
  onChange,
}: {
  field: Extract<FieldSpec, { kind: "featured-tabs" }>;
  data: Data;
  onChange: (data: Data) => void;
}) {
  const categoriesQuery = useGetApiCategories({ locale: "pt" });
  const tabs = Array.isArray(data[field.key])
    ? (data[field.key] as Array<{ category_id: string; product_ids: string[] }>)
    : [];
  const categories = categoriesQuery.data ?? [];
  const showNoveltiesTab = data.show_novelties_tab === true;

  function setTabs(next: typeof tabs) {
    onChange({ ...data, [field.key]: next });
  }

  return (
    <div className="space-y-4">
      <AdminLabel>{field.label}</AdminLabel>
      <label className="flex items-start gap-3 rounded-md border border-border bg-muted/30 p-3">
        <Checkbox
          checked={showNoveltiesTab}
          onCheckedChange={(checked) =>
            onChange({ ...data, show_novelties_tab: checked === true })
          }
        />
        <span className="space-y-0.5">
          <span className="block text-sm font-medium">
            Habilitar aba de Novidades
          </span>
          <span className="block text-xs text-muted-foreground">
            Exibe automaticamente os 5 produtos publicados mais recentes.
          </span>
        </span>
      </label>
      <SortableList
        items={tabs.map((tab, index) => ({
          tab,
          index,
          key: `${tab.category_id}-${index}`,
        }))}
        getId={(item) => item.key}
        onReorder={(items) => setTabs(items.map((item) => item.tab))}
        renderItem={({ tab, index }, handle) => {
          const category = categories.find(
            (item) => item.id === tab.category_id,
          );
          return (
            <FeaturedTabEditor
              tab={tab}
              category={category}
              categories={categories}
              selectedCategoryIds={
                new Set(tabs.map((item) => item.category_id))
              }
              handle={handle}
              onChange={(next) =>
                setTabs(
                  tabs.map((item, itemIndex) =>
                    itemIndex === index ? next : item,
                  ),
                )
              }
              onRemove={() =>
                setTabs(tabs.filter((_, itemIndex) => itemIndex !== index))
              }
            />
          );
        }}
      />
      <button
        type="button"
        onClick={() => setTabs([...tabs, { category_id: "", product_ids: [] }])}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="size-4" /> Adicionar aba
      </button>
    </div>
  );
}

function FeaturedTabEditor({
  tab,
  category,
  categories,
  selectedCategoryIds,
  handle,
  onChange,
  onRemove,
}: {
  tab: { category_id: string; product_ids: string[] };
  category?: { id: string; name: string; slug: string };
  categories: Array<{ id: string; name: string; slug: string }>;
  selectedCategoryIds: Set<string>;
  handle: React.ReactNode;
  onChange: (tab: { category_id: string; product_ids: string[] }) => void;
  onRemove: () => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);
  const productsQuery = useGetApiProducts({
    category: category?.slug,
    q: debouncedSearch || undefined,
    status: "PUBLISHED",
    page: 1,
    pageSize: 100,
    locale: "pt",
  });
  const selectedProductsQuery = useGetApiProducts({
    category: category?.slug,
    status: "PUBLISHED",
    page: 1,
    pageSize: 100,
    locale: "pt",
  });
  const products = (productsQuery.data?.items ?? []).filter(
    (product) => !tab.product_ids.includes(product.id),
  );
  const selectedProducts = selectedProductsQuery.data?.items ?? [];
  const selected = tab.product_ids
    .map((id) => selectedProducts.find((product) => product.id === id))
    .filter(Boolean);
  const hasReachedProductLimit = tab.product_ids.length >= 5;

  return (
    <div className="space-y-3 rounded-md border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2">
        <div className="[&_button]:cursor-grab [&_button]:active:cursor-grabbing">
          {handle}
        </div>
        <Select
          value={tab.category_id}
          onValueChange={(categoryId) =>
            onChange({ category_id: categoryId ?? "", product_ids: [] })
          }
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione a categoria">
              {category?.name ?? "Selecione a categoria"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                disabled={
                  selectedCategoryIds.has(item.id) &&
                  item.id !== tab.category_id
                }
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remover aba"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {category && (
        <Combobox
          items={products}
          value={null}
          itemToStringLabel={(product: ProductCardItem) => product.name}
          inputValue={search}
          onInputValueChange={setSearch}
          onValueChange={(product: ProductCardItem | null) => {
            if (!product || hasReachedProductLimit) return;
            onChange({ ...tab, product_ids: [...tab.product_ids, product.id] });
            setSearch("");
          }}
        >
          {hasReachedProductLimit ? (
            <Tooltip>
              <TooltipTrigger render={<span className="block" tabIndex={0} />}>
                <Button
                  variant="outline"
                  disabled
                  className="w-full justify-between font-normal"
                >
                  Adicionar produto publicado
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Você atingiu o limite de 5 produtos nesta categoria.
              </TooltipContent>
            </Tooltip>
          ) : (
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  <ComboboxValue>
                    {() => "Adicionar produto publicado"}
                  </ComboboxValue>
                </Button>
              }
            />
          )}
          <ComboboxContent>
            <ComboboxInput
              showTrigger={false}
              placeholder="Buscar por nome ou SKU"
            />
            <ComboboxEmpty>Nenhum produto encontrado.</ComboboxEmpty>
            <ComboboxList>
              {(product: ProductCardItem) => (
                <ComboboxItem key={product.id} value={product}>
                  <span className="flex items-center gap-2">
                    <span className="size-8 shrink-0 overflow-hidden rounded bg-muted">
                      {product.thumbnail_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail_url}
                          alt=""
                          className="size-full object-cover"
                        />
                      )}
                    </span>
                    <span className="truncate">
                      {product.name}
                      {product.sku ? ` (${product.sku})` : ""}
                    </span>
                  </span>
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
      <SortableList
        items={selected.map((product) => product!).filter(Boolean)}
        getId={(product) => product.id}
        onReorder={(items) =>
          onChange({ ...tab, product_ids: items.map((product) => product.id) })
        }
        renderItem={(product, handle) => (
          <div className="flex items-center gap-2 rounded border border-border bg-card px-2 py-1.5 text-sm">
            {handle}
            <span className="size-11 shrink-0 overflow-hidden rounded bg-muted">
              {product.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnail_url}
                  alt=""
                  className="size-full object-cover"
                />
              )}
            </span>
            <span className="truncate">{product.name}</span>
            <button
              type="button"
              className="ml-auto text-muted-foreground hover:text-destructive"
              onClick={() =>
                onChange({
                  ...tab,
                  product_ids: tab.product_ids.filter(
                    (id) => id !== product.id,
                  ),
                })
              }
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        )}
      />
      <p className="text-xs text-muted-foreground">
        Selecione de 1 a 5 produtos. A ordem define destaque e grade.
      </p>
    </div>
  );
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
              <Input
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
