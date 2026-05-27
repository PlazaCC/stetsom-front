"use client";

import type { BannerWithUploads, CreateBannerInput } from "@/lib/api/contracts";
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
    const message = body?.error?.message ?? `Failed (${res.status})`;
    throw new Error(message);
  }
}

export function useBannerMutations() {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["admin", "banners"] });

  const create = useMutation({
    mutationFn: (input: CreateBannerInput) =>
      apiPost<BannerWithUploads>("/api/proxy/admin/banners", input),
    onSuccess: () => invalidate(),
    onError: (err: Error) =>
      toast.error("Erro ao criar banner", { description: err.message }),
  });

  const update = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<CreateBannerInput>;
    }) => apiPatch<BannerWithUploads>(`/api/proxy/admin/banners/${id}`, input),
    onSuccess: () => invalidate(),
    onError: (err: Error) =>
      toast.error("Erro ao atualizar banner", { description: err.message }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiDelete(`/api/proxy/admin/banners/${id}`),
    onSuccess: () => invalidate(),
    onError: (err: Error) =>
      toast.error("Erro ao excluir banner", { description: err.message }),
  });

  return { create, update, remove };
}
