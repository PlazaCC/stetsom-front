"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export interface CatalogFilterOption {
  name: string;
  slug: string;
}

export interface CatalogFilterFieldsProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  activeLine: string;
  onLineChange: (slug: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  typeFilterOptions: CatalogFilterOption[];
  productLines: CatalogFilterOption[];
  showDiscontinued: boolean;
  onShowDiscontinuedChange: (value: boolean) => void;
  showExport: boolean;
  onShowExportChange: (value: boolean) => void;
}

export function CatalogFilterFields({
  search,
  onSearchChange,
  onClose,
  activeCategory,
  onCategoryChange,
  activeLine,
  onLineChange,
  sort,
  onSortChange,
  typeFilterOptions,
  productLines,
  showDiscontinued,
  onShowDiscontinuedChange,
  showExport,
  onShowExportChange,
}: CatalogFilterFieldsProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2.5">
      <div className="py-2.5">
        <p className="font-sans text-sm font-medium text-muted-foreground uppercase">
          {t("sortBy")}
        </p>
        <div className="relative mt-2">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-11 w-full appearance-none rounded border border-border bg-white px-3 pr-9 text-sm text-muted-foreground outline-none focus:border-brand"
          >
            <option value="relevance">{t("sortRelevance")}</option>
            <option value="newest">{t("sortNewest")}</option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      <hr className="border-border" />

      <div className="py-2.5">
        <div className="flex items-center justify-between">
          <span className="font-sans text-sm font-medium text-muted-foreground uppercase">
            {t("search")}
          </span>
        </div>
        <div className="mt-2 flex h-11 items-center gap-2.5 border border-border bg-white px-3">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onClose();
              }
            }}
            placeholder={t("searchPlaceholder")}
            className="flex-1 border-none bg-transparent text-sm text-brand-dark outline-none"
          />
        </div>
      </div>

      <hr className="border-border" />

      <Collapsible defaultOpen className="group/collapsible py-2.5">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
          <span className="font-sans text-sm font-medium text-muted-foreground uppercase">
            {t("options")}
          </span>
          <ChevronDown
            size={16}
            className="text-muted-foreground transition-transform group-data-open/collapsible:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 flex flex-col gap-4">
          <label className="flex cursor-pointer items-center gap-3 text-base text-muted-foreground">
            <Switch
              checked={showDiscontinued}
              onCheckedChange={onShowDiscontinuedChange}
            />
            {t("showDiscontinued")}
          </label>
          <label className="flex cursor-pointer items-center gap-3 text-base text-muted-foreground">
            <Switch checked={showExport} onCheckedChange={onShowExportChange} />
            {t("showExport")}
          </label>
        </CollapsibleContent>
      </Collapsible>

      <hr className="border-border" />

      <Collapsible defaultOpen className="group/collapsible py-2.5">
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
          <span className="font-sans text-sm font-medium text-muted-foreground uppercase">
            {t("productType")}
          </span>
          <ChevronDown
            size={16}
            className="text-muted-foreground transition-transform group-data-open/collapsible:rotate-180"
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 flex flex-col gap-3">
          {typeFilterOptions.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center gap-3 text-base text-muted-foreground"
            >
              <Checkbox
                checked={activeCategory === cat.slug}
                onCheckedChange={() =>
                  onCategoryChange(
                    activeCategory === cat.slug ? "todos" : cat.slug,
                  )
                }
              />
              {cat.name}
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <hr className="border-border" />

      {productLines.length > 0 && (
        <Collapsible defaultOpen className="group/collapsible py-2.5">
          <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between">
            <span className="font-sans text-sm font-medium text-muted-foreground uppercase">
              {t("productLines")}
            </span>
            <ChevronDown
              size={16}
              className="text-muted-foreground transition-transform group-data-open/collapsible:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 flex flex-col gap-3 text-base text-muted-foreground">
            {productLines.map((line) => (
              <label
                key={line.slug}
                className="flex cursor-pointer items-center gap-3"
              >
                <Checkbox
                  checked={activeLine === line.slug}
                  onCheckedChange={() =>
                    onLineChange(activeLine === line.slug ? "todas" : line.slug)
                  }
                />
                {line.name}
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
