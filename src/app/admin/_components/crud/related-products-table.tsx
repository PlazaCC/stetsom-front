"use client";

import {
  getGetApiCategoriesAdminQueryKey,
  getGetApiProductsAdminQueryKey,
  patchApiProductsId,
  useGetApiProductsAdmin,
} from "@/api/stetsom";
import type { CmsProductRow } from "@/api/stetsom/model";
import { AdminConfirmDialog } from "./admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "./admin-data-table";
import { AdminSearchInput } from "./admin-search-input";
import { AdminRowAction, AdminRowActions } from "./admin-row-actions";
import { ProductLinkDialog } from "./product-link-dialog";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { useAdminToast } from "@/hooks/use-admin-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Link2, Unlink } from "lucide-react";
import { useEffect, useState } from "react";

interface RelatedProductsTableProps {
  categoryId?: string;
  lineId?: string;
  onProductUnlinked?: (productId: string) => void;
}

export function RelatedProductsTable({
  categoryId,
  lineId,
  onProductUnlinked,
}: RelatedProductsTableProps) {
  const toast = useAdminToast();
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<CmsProductRow | null>(null);
  const pageSize = 8;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuery(inputValue.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [inputValue]);

  const productsQuery = useGetApiProductsAdmin({
    q: query || undefined,
    category_id: categoryId,
    line_id: lineId,
    page,
    pageSize,
  });
  const refreshProducts = async () => {
    await queryClient.invalidateQueries({
      queryKey: getGetApiProductsAdminQueryKey(),
    });
    await queryClient.invalidateQueries({
      queryKey: getGetApiCategoriesAdminQueryKey(),
    });
  };

  const unlinkMutation = useMutation({
    mutationFn: (product: CmsProductRow) =>
      patchApiProductsId(product.id, {
        category_id: product.category_id,
        line_id: null,
      }),
    onSuccess: async (_, product) => {
      await refreshProducts();
      onProductUnlinked?.(product.id);
      toast.success("Produto removido da linha");
      setUnlinkTarget(null);
    },
    onError: (error) =>
      toast.apiError(error, "Não foi possível remover o vínculo"),
  });

  const columns: AdminTableColumn<CmsProductRow>[] = [
    {
      key: "name",
      header: "Produto",
      render: (product) => (
        <div className="flex min-w-0 items-center gap-3">
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
          <span className="truncate font-medium">{product.name}</span>
        </div>
      ),
    },
    { key: "sku", header: "SKU", render: (product) => product.sku ?? "—" },
    {
      key: "status",
      header: "Status",
      render: (product) => <StatusBadge status={product.status} />,
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (product) => (
        <AdminRowActions>
          <AdminRowAction
            href={`/admin/produtos/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink />
            Editar
          </AdminRowAction>
          <AdminRowAction
            variant="destructive"
            onClick={() => setUnlinkTarget(product)}
          >
            <Unlink />
            Remover vínculo
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  const hasSearch = Boolean(query);
  return (
    <>
      <AdminDataTable
        columns={columns}
        data={productsQuery.data?.items ?? []}
        isLoading={productsQuery.isLoading}
        error={
          productsQuery.isError
            ? "Não foi possível carregar os produtos."
            : undefined
        }
        keyExtractor={(product) => product.id}
        emptyTitle={
          hasSearch ? "Nenhum produto encontrado" : "Nenhum produto vinculado"
        }
        emptyDescription={
          hasSearch
            ? "Ajuste a busca para encontrar produtos."
            : "Os produtos vinculados aparecerão aqui."
        }
        toolbar={
          <AdminSearchInput
            value={inputValue}
            onChange={setInputValue}
            placeholder="Buscar produto vinculado"
            className="w-full max-w-72"
          />
        }
        action={
          categoryId && lineId ? (
            <Button type="button" onClick={() => setLinkDialogOpen(true)}>
              <Link2 />
              Vincular produto
            </Button>
          ) : undefined
        }
        pagination={
          productsQuery.data
            ? {
                page,
                pageSize,
                total: productsQuery.data.total,
                onPageChange: setPage,
              }
            : undefined
        }
      />
      <AdminConfirmDialog
        open={Boolean(unlinkTarget)}
        title={`Remover "${unlinkTarget?.name ?? "produto"}" da linha?`}
        description="O Produto não será excluído e continuará vinculado à categoria atual."
        confirmLabel="Remover vínculo"
        destructive
        isPending={unlinkMutation.isPending}
        onConfirm={() => {
          if (unlinkTarget) unlinkMutation.mutate(unlinkTarget);
        }}
        onCancel={() => setUnlinkTarget(null)}
      />
      {categoryId && lineId && (
        <ProductLinkDialog
          open={linkDialogOpen}
          categoryId={categoryId}
          lineId={lineId}
          onOpenChange={setLinkDialogOpen}
          onLinked={refreshProducts}
        />
      )}
    </>
  );
}
