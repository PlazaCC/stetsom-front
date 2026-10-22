"use client";

import { patchApiProductsId, useGetApiProductsAdmin } from "@/api/stetsom";
import type { CmsProductRow } from "@/api/stetsom/model";
import { AdminPagination } from "./admin-pagination";
import { AdminSearchInput } from "./admin-search-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductLinkDialogProps {
  open: boolean;
  categoryId: string;
  lineId: string;
  onOpenChange: (open: boolean) => void;
  onLinked: () => Promise<unknown> | void;
}

export function ProductLinkDialog({
  open,
  categoryId,
  lineId,
  onOpenChange,
  onLinked,
}: ProductLinkDialogProps) {
  const toast = useAdminToast();
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [onlyWithoutLine, setOnlyWithoutLine] = useState(true);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CmsProductRow | null>(null);
  const pageSize = 7;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(inputValue.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  const productsQuery = useGetApiProductsAdmin(
    {
      q: query || undefined,
      has_line: onlyWithoutLine ? false : undefined,
      exclude_line_id: lineId,
      page,
      pageSize,
    },
    { query: { enabled: open } },
  );

  const linkMutation = useMutation({
    mutationFn: () => {
      if (!selected) throw new Error("Selecione um produto");
      return patchApiProductsId(selected.id, {
        category_id: categoryId,
        line_id: lineId,
        ...(selected.category_id !== categoryId ? { template_id: null } : {}),
      });
    },
    onSuccess: async () => {
      await onLinked();
      handleOpenChange(false);
      toast.success("Produto vinculado à linha");
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível vincular o produto"),
  });

  const rows = productsQuery.data?.items ?? [];
  const movingCategory = Boolean(
    selected && selected.category_id !== categoryId,
  );
  const movingLine = Boolean(selected?.line_id && selected.line_id !== lineId);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
      setQuery("");
      setOnlyWithoutLine(true);
      setPage(1);
      setSelected(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[min(760px,calc(100vh-2rem))] overflow-hidden sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Vincular produto à linha</DialogTitle>
          <DialogDescription>
            Pesquise um Produto do CMS e selecione o registro que deve pertencer
            a esta Linha.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AdminSearchInput
              value={inputValue}
              onChange={setInputValue}
              placeholder="Buscar por nome, SKU ou path"
              className="min-w-64 flex-1"
            />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={onlyWithoutLine}
                onCheckedChange={(checked) => {
                  setOnlyWithoutLine(checked);
                  setPage(1);
                  setSelected(null);
                }}
                size="sm"
              />
              Somente Produtos sem Linha
            </label>
          </div>

          <div className="min-h-0 overflow-auto rounded-lg border border-border">
            {productsQuery.isLoading ? (
              <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin" /> Carregando
                Produtos...
              </div>
            ) : productsQuery.isError ? (
              <div className="flex min-h-56 items-center justify-center text-sm text-destructive">
                Não foi possível carregar os Produtos.
              </div>
            ) : rows.length === 0 ? (
              <div className="flex min-h-56 items-center justify-center px-6 text-center text-sm text-muted-foreground">
                Nenhum Produto encontrado com os filtros atuais.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-muted text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="w-12 px-3 py-2" />
                    <th className="px-3 py-2">Produto</th>
                    <th className="px-3 py-2">Categoria</th>
                    <th className="px-3 py-2">Linha atual</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((product) => {
                    const isCurrentLine = product.line_id === lineId;
                    const isSelected = selected?.id === product.id;
                    return (
                      <tr
                        key={product.id}
                        onClick={() => !isCurrentLine && setSelected(product)}
                        className={[
                          "border-t border-border transition",
                          isCurrentLine
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-muted/40",
                          isSelected
                            ? "bg-primary/5 ring-1 ring-primary ring-inset"
                            : "",
                        ].join(" ")}
                      >
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            disabled={isCurrentLine}
                            aria-label={`Selecionar ${product.name}`}
                            aria-pressed={isSelected}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected(product);
                            }}
                            className="flex size-7 items-center justify-center rounded focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {isSelected && (
                              <Check className="size-4 text-primary" />
                            )}
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="size-9 shrink-0 overflow-hidden rounded bg-muted">
                              {product.thumbnail_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.thumbnail_url}
                                  alt=""
                                  className="size-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {product.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {product.sku ?? product.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {product.category}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {isCurrentLine
                            ? "Esta Linha"
                            : (product.line ?? "Sem Linha")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {productsQuery.data && productsQuery.data.total > 0 && (
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={productsQuery.data.total}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                setSelected(null);
              }}
            />
          )}
        </div>

        {selected && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm">
            {movingCategory ? (
              <p>
                Este Produto será movido para a Categoria desta Linha e o
                template atual será removido.
              </p>
            ) : movingLine ? (
              <p>Este Produto será movido da Linha atual para esta Linha.</p>
            ) : (
              <p>Este Produto será vinculado a esta Linha.</p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={linkMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => linkMutation.mutate()}
            disabled={!selected || linkMutation.isPending}
          >
            {linkMutation.isPending
              ? "Vinculando..."
              : movingCategory
                ? "Mover e vincular"
                : "Vincular produto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
