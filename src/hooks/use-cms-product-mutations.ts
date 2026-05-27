"use client";

import type {
  CmsProductMutationResult,
  CreateCmsProductInput,
  UpdateCmsProductInput,
} from "@/lib/api/contracts";
import { proxyFetch } from "@/lib/api/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  return proxyFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return proxyFetch<T>(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(path, { method: "DELETE", cache: "no-store" });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => null);
    const message: string =
      body?.error?.message ?? `Falha ao excluir (${res.status})`;
    throw new Error(message);
  }
}

/**
 * Mutations para create, update e delete de produtos via BFF proxy.
 * Invalida o cache de listagem após cada operação bem-sucedida.
 */
export function useCmsProductMutations() {
  const qc = useQueryClient();

  const invalidateProducts = () =>
    qc.invalidateQueries({ queryKey: ["cms-products"] });

  const create = useMutation({
    mutationFn: (input: CreateCmsProductInput) =>
      apiPost<CmsProductMutationResult>("/api/proxy/admin/products", input),
    onSuccess: invalidateProducts,
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCmsProductInput }) =>
      apiPatch<CmsProductMutationResult>(
        `/api/proxy/admin/products/${id}`,
        input,
      ),
    onSuccess: invalidateProducts,
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/proxy/admin/products/${id}`),
    onSuccess: invalidateProducts,
  });

  return { create, update, remove };
}
