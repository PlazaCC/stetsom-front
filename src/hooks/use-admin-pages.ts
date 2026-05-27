"use client";

import type {
  AdminPageDetailPayload,
  AdminPagesPayload,
  PageId,
  PageSection,
} from "@/lib/api/contracts";
import { proxyFetch } from "@/lib/api/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAdminPages() {
  return useQuery<AdminPagesPayload>({
    queryKey: ["admin-pages"],
    queryFn: () => proxyFetch<AdminPagesPayload>("/api/proxy/admin/pages"),
  });
}

export function useAdminPageSections(pageId: PageId) {
  return useQuery<AdminPageDetailPayload>({
    queryKey: ["admin-page-sections", pageId],
    queryFn: () =>
      proxyFetch<AdminPageDetailPayload>(`/api/proxy/admin/pages/${pageId}`),
    enabled: !!pageId,
  });
}

export function useUpdatePageSection() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      proxyFetch<PageSection>(`/api/proxy/admin/pages/sections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-page-sections"] });
      qc.invalidateQueries({ queryKey: ["admin-pages"] });
      toast.success("Seção salva com sucesso");
    },
    onError: (err: Error) => {
      toast.error("Erro ao salvar seção", {
        description: err.message || "Tente novamente.",
      });
    },
  });
}
