"use client";

import type {
  CmsProductMutationResult,
  CreateCmsProductInput,
  UpdateCmsProductInput,
} from "@/lib/api/contracts";
import { proxyFetch } from "@/lib/api/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const res = await fetch(path, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => null);
    const message: string =
      body?.error?.message ?? `Falha ao excluir (${res.status})`;
    throw new Error(message);
  }
}

export function useCmsProductMutations() {
  const qc = useQueryClient();

  const invalidateProducts = () =>
    qc.invalidateQueries({ queryKey: ["cms", "products"] });

  const create = useMutation({
    mutationFn: (input: CreateCmsProductInput) =>
      apiPost<CmsProductMutationResult>("/api/proxy/admin/products", input),
    onSuccess: invalidateProducts,
    onError: (err: Error) => {
      toast.error("Erro ao criar produto", {
        description: err.message || "Tente novamente.",
      });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCmsProductInput }) =>
      apiPatch<CmsProductMutationResult>(
        `/api/proxy/admin/products/${id}`,
        input,
      ),
    onSuccess: invalidateProducts,
    onError: (err: Error) => {
      toast.error("Erro ao salvar produto", {
        description: err.message || "Tente novamente.",
      });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/proxy/admin/products/${id}`),
    onSuccess: invalidateProducts,
    onError: (err: Error) => {
      toast.error("Erro ao excluir produto", {
        description: err.message || "Tente novamente.",
      });
    },
  });

  return { create, update, remove };
}
