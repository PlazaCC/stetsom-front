"use client";

import type { Banner } from "@/api/stetsom/model";
import { AdminEmptyState } from "@/app/admin/_components/crud/admin-empty-state";
import { AlertCircle, ArrowRight, ImageIcon, Plus } from "lucide-react";
import Link from "next/link";

interface BannersSummaryPanelProps {
  banners: Banner[];
  isLoading?: boolean;
  isError?: boolean;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function BannerStatusBadge({ status }: { status: Banner["status"] }) {
  const map: Record<string, { label: string; classes: string }> = {
    ACTIVE: { label: "Ativo", classes: "bg-green-500/15 text-green-600" },
    SCHEDULED: {
      label: "Agendado",
      classes: "bg-yellow-500/15 text-yellow-600",
    },
    INACTIVE: {
      label: "Inativo",
      classes: "bg-muted-foreground/10 text-muted-foreground",
    },
  };
  const s = map[status] ?? {
    label: status,
    classes: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-medium ${s.classes}`}
    >
      {s.label}
    </span>
  );
}

export function BannersSummaryPanel({
  banners,
  isLoading = false,
  isError = false,
}: Readonly<BannersSummaryPanelProps>) {
  if (isLoading) {
    return (
      <div role="status" className="flex items-center justify-center py-16">
        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
        <span className="sr-only">Carregando banners...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert">
        <AdminEmptyState
          title="Não foi possível carregar os banners"
          description="Tente novamente em alguns instantes."
          icon={AlertCircle}
          className="py-8 [&_svg]:size-8"
        />
      </div>
    );
  }

  const active = banners.filter(
    (b) =>
      b.status === "ACTIVE" &&
      (!b.display_from || new Date(b.display_from) <= new Date()) &&
      (!b.display_until || new Date(b.display_until) > new Date()),
  );
  const scheduled = banners.filter(
    (b) =>
      b.status === "SCHEDULED" ||
      (b.display_from && new Date(b.display_from) > new Date()),
  );
  const inactive = banners.filter((b) => b.status === "INACTIVE");

  if (banners.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-foreground">Banners (0)</h3>
        <AdminEmptyState
          title="Nenhum banner cadastrado"
          description="Crie um banner para destacar conteúdo na página inicial."
          icon={ImageIcon}
          className="py-8 [&_svg]:size-8"
          action={
            <Link
              href="/admin/banners/novo"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              <Plus className="size-4" />
              Criar banner
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">
          Banners ({banners.length})
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-green-500" />
            {active.length} ativos
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-yellow-500" />
            {scheduled.length} agendados
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-muted-foreground/30" />
            {inactive.length} inativos
          </li>
        </ul>
      </div>

      <div className="space-y-1.5">
        <p className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
          Últimos banners
        </p>
        {banners.slice(0, 5).map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <ImageIcon className="size-4 text-muted-foreground/50" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {banner.title?.pt || banner.name || "Sem título"}
              </p>
              <div className="flex items-center gap-2 text-2xs text-muted-foreground">
                <BannerStatusBadge status={banner.status} />
                {banner.display_from && (
                  <span>{formatDate(banner.display_from)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/admin/banners"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        Gerenciar banners
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
