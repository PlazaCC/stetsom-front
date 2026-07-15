"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import type { Banner, BannersPayload } from "@/api/stetsom/model";
import { patchApiBannersId, getGetApiBannersQueryKey } from "@/api/stetsom";
import type { PatchApiBannersIdBodyStatus } from "@/api/stetsom/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { formatDateRange } from "./banner-form";

function toLocaleDisplay(locale: string): string {
  if (locale === "pt-BR" || locale === "pt") return "PT";
  if (locale === "en") return "EN";
  return "ES";
}

export function BannersContent({
  initialBanners,
}: {
  initialBanners: BannersPayload;
}) {
  const queryClient = useQueryClient();
  const banners = initialBanners.items;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getGetApiBannersQueryKey() });
  }

  const updateBanner = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: { status: PatchApiBannersIdBodyStatus };
    }) => patchApiBannersId(id, body),
  });

  const columns: AdminTableColumn<Banner>[] = [
    {
      key: "preview",
      header: "Preview",
      className: "w-20",
      render: () => (
        <div className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-md bg-muted">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      ),
    },
    {
      key: "name",
      header: "Nome",
      render: (banner) => (
        <div>
          <p className="font-medium text-foreground">{banner.name}</p>
          {banner.link_url && (
            <p className="mt-0.5 max-w-40 truncate text-xs text-muted-foreground">
              {banner.link_url}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "available_locales",
      header: "Idioma",
      render: (banner) => (
        <span className="text-xs text-muted-foreground">
          {toLocaleDisplay(banner.available_locales?.[0] ?? "pt-BR")}
        </span>
      ),
    },
    {
      key: "display_from",
      header: "Exibição",
      render: (banner) => (
        <span className="text-xs text-muted-foreground">
          {formatDateRange(banner.display_from, banner.display_until)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (banner) => (
        <div className="flex items-center gap-2">
          {banner.status !== "SCHEDULED" && (
            <AdminStatusToggle
              active={banner.status === "ACTIVE"}
              onToggle={async () => {
                const newStatus =
                  banner.status === "ACTIVE"
                    ? ("INACTIVE" as const)
                    : ("ACTIVE" as const);
                await updateBanner.mutateAsync({
                  id: banner.id,
                  body: { status: newStatus },
                });
                invalidate();
              }}
            />
          )}
          <StatusBadge status={banner.status} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (banner) => (
        <Link
          href={`/admin/banners/${banner.id}`}
          className="rounded border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Editar
        </Link>
      ),
    },
  ];

  const createBannerAction = (
    <Link
      href="/admin/banners/novo"
      className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
    >
      <Plus className="size-4" />
      Novo banner
    </Link>
  );

  return (
    <AdminPageLayout>
      <AdminDataTable
        columns={columns}
        data={banners}
        keyExtractor={(banner) => banner.id}
        emptyTitle="Nenhum banner cadastrado"
        emptyDescription="Crie um banner para destacar campanhas na página inicial."
        emptyIcon={ImageIcon}
        emptyAction={createBannerAction}
        action={<AdminActionBar>{createBannerAction}</AdminActionBar>}
      />
    </AdminPageLayout>
  );
}
