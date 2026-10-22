"use client";

import {
  useGetApiProductsAdmin,
  useGetApiProductsAdminId,
} from "@/api/stetsom";
import type { CmsProductRow } from "@/api/stetsom/model";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { AdminPagination } from "./admin-pagination";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface AdminProductPickerProps {
  value: string;
  onChange: (productId: string) => void;
  categoryId?: string;
  lineId?: string;
  disabled?: boolean;
  placeholder?: string;
}

type ProductOption = {
  id: string;
  name: string;
  sku: string | null;
  category: string;
  line?: string;
  thumbnail_url: string | null;
};

export function AdminProductPicker({
  value,
  onChange,
  categoryId,
  lineId,
  disabled = false,
  placeholder = "Selecione um produto",
}: AdminProductPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(inputValue.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  const selectedQuery = useGetApiProductsAdminId(value, {
    query: { enabled: Boolean(value) },
  });
  const productsQuery = useGetApiProductsAdmin(
    {
      q: query || undefined,
      category_id: categoryId,
      line_id: lineId,
      page,
      pageSize,
    },
    { query: { enabled: open } },
  );

  const rows = useMemo(
    () => (productsQuery.data?.items ?? []).map(toOption),
    [productsQuery.data?.items],
  );
  const selected = selectedQuery.data?.product;
  const selectedOption = selected
    ? {
        id: selected.id,
        name: selected.name.pt,
        sku: selected.sku ?? null,
        category: "",
        thumbnail_url: null,
      }
    : null;
  const selectedValue =
    selectedOption ?? rows.find((row) => row.id === value) ?? null;

  return (
    <Combobox<ProductOption>
      items={rows}
      value={selectedValue}
      onValueChange={(option) => onChange(option?.id ?? "")}
      itemToStringLabel={(option) => option?.name ?? ""}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={
          value ? (selectedValue?.name ?? "Produto selecionado") : placeholder
        }
        disabled={disabled}
        showClear={Boolean(value)}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <ComboboxContent>
        {productsQuery.isLoading && (
          <div className="flex items-center gap-2 px-3 py-3 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Carregando produtos...
          </div>
        )}
        {productsQuery.isError && (
          <p className="px-3 py-3 text-sm text-destructive">
            Não foi possível carregar os produtos.
          </p>
        )}
        {!productsQuery.isLoading && !productsQuery.isError && (
          <ComboboxList>
            <ComboboxEmpty>Nenhum produto encontrado.</ComboboxEmpty>
            {rows.map((option) => (
              <ComboboxItem key={option.id} value={option}>
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                  {option.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={option.thumbnail_url}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {option.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[option.sku, option.category, option.line]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        )}
        {productsQuery.data && (
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={productsQuery.data.total}
            onPageChange={setPage}
            className="border-t border-border px-2"
          />
        )}
      </ComboboxContent>
    </Combobox>
  );
}

function toOption(product: CmsProductRow): ProductOption {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    category: product.category,
    line: product.line,
    thumbnail_url: product.thumbnail_url,
  };
}
