"use client";

import {
  useGetApiProductsAdmin,
  useGetApiProductsAdminId,
} from "@/api/stetsom";
import type { CmsProductRow } from "@/api/stetsom/model";
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
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;
const RESULT_LIMIT = 20;

interface ProductComboboxProps {
  /** Currently associated product id, or "" when none. */
  value: string;
  onChange: (productId: string) => void;
  placeholder?: string;
}

/**
 * Picks a product by searching its name, instead of pasting an id.
 *
 * The saved value is still the product id. When editing an entity that only
 * carries the id, the product is fetched once so the trigger shows its name
 * rather than an opaque ObjectId.
 */
export function ProductCombobox({
  value,
  onChange,
  placeholder = "Buscar produto…",
}: ProductComboboxProps) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (search === query) return;
    const id = setTimeout(() => setQuery(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search, query]);

  const { data, isLoading } = useGetApiProductsAdmin({
    q: query || undefined,
    pageSize: RESULT_LIMIT,
  });
  const products = data?.items ?? [];

  // The search results only contain what matched the current query, so the
  // selected product is resolved on its own to label the trigger.
  const inResults = products.find((p) => p.id === value) ?? null;
  const { data: selectedDetail } = useGetApiProductsAdminId(value, {
    query: { enabled: Boolean(value) && !inResults },
  });

  const selectedLabel =
    inResults?.name ?? selectedDetail?.product.name.pt ?? (value ? "…" : "");

  return (
    <div className="flex items-center gap-2">
      <Combobox
        items={products}
        value={inResults}
        itemToStringLabel={(p: CmsProductRow) => p.name}
        onValueChange={(product: CmsProductRow | null) =>
          onChange(product?.id ?? "")
        }
        // The query runs on the server, so the built-in client filter is turned
        // off — otherwise a result matched by sku or slug would be hidden for
        // not containing the query in its name.
        filter={null}
        onInputValueChange={(next: string) => setSearch(next)}
      >
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between overflow-hidden font-normal"
            >
              <ComboboxValue>
                {() =>
                  selectedLabel ? (
                    <span className="block truncate">{selectedLabel}</span>
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )
                }
              </ComboboxValue>
            </Button>
          }
        />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Buscar por nome" />
          <ComboboxEmpty>
            {isLoading ? "Buscando…" : "Nenhum produto encontrado."}
          </ComboboxEmpty>
          <ComboboxList>
            {(p: CmsProductRow) => (
              <ComboboxItem key={p.id} value={p}>
                <span className="truncate">{p.name}</span>
                <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                  {p.category}
                </span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {value && (
        <button
          type="button"
          aria-label="Remover produto associado"
          onClick={() => onChange("")}
          className="shrink-0 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
