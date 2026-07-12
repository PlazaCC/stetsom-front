"use client";

import { useGetApiDashboard } from "@/api/stetsom";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  History,
  Image,
  Mail,
  Package,
  Plus,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const QUICK_ICONS: Record<string, LucideIcon> = {
  package: Package,
  image: Image,
  upload: Upload,
  mail: Mail,
};

const ACTION_BORDER: Record<string, string> = {
  CREATE: "border-l-green-500",
  UPDATE: "border-l-blue-500",
  DELETE: "border-l-muted-foreground/30",
  PUBLISH: "border-l-emerald-500",
  LOGIN: "border-l-amber-500",
  LOGOUT: "border-l-muted-foreground/20",
};

type DashboardActivity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  user_name: string;
  action: string;
};

function AuditActivityCard({ entry }: { entry: DashboardActivity }) {
  const borderColor = entry.action
    ? (ACTION_BORDER[entry.action] ?? "border-l-muted-foreground/20")
    : "border-l-muted-foreground/20";

  return (
    <div
      className={cn(
        "-mx-3 flex items-start gap-3 rounded-r-md border-l-2 px-3 py-2 pl-3 transition-colors hover:bg-muted/50",
        borderColor,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-foreground">
        {(entry.user_name ?? "?").charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {entry.user_name ?? "Desconhecido"}
          </span>
          {entry.action && <StatusBadge status={entry.action} />}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
          {entry.title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          {timeAgo(entry.timestamp)}
        </p>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "agora";
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 10) return "agora";
  if (diffSec < 60) return `há ${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin}min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `há ${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `há ${diffDay}d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function AdminHome() {
  const dashboard = useGetApiDashboard();

  if (dashboard.isLoading) {
    return (
      <div className="px-4 py-4 text-muted-foreground lg:px-11.75 lg:py-7.25">
        Carregando dashboard...
      </div>
    );
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="px-4 py-4 text-destructive lg:px-11.75 lg:py-7.25">
        Não foi possível carregar o dashboard.
      </div>
    );
  }

  const { metrics, scheduleItems, quickActions, recentActivities } =
    dashboard.data;

  return (
    <div className="space-y-6 px-4 py-4 lg:px-11.75 lg:py-7.25">
      <header>
        <h1 className="text-4xl font-bold text-foreground">
          {dashboard.data.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard.data.subtitle}
        </p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="flex items-start gap-4 rounded-[16px] border border-border bg-card p-5 transition-shadow hover:shadow-cms-card"
          >
            {metric.thumbnail_url && (
              <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={metric.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                {metric.label}
              </p>
              <p className="mt-1 text-3xl font-bold text-foreground">
                {metric.value}
              </p>
              {metric.sub && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {metric.sub}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Recent activities */}
          <section className="rounded-[16px] border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Atividades recentes
              </h2>
              <span className="text-xs text-muted-foreground/60">
                Últimas {recentActivities.length} atividades
              </span>
            </div>

            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
                <History className="size-8 text-muted-foreground/30" />
                <p>Nenhuma atividade registrada.</p>
                <p className="text-xs text-muted-foreground/60">
                  As ações dos usuários no CMS aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivities.map((entry) => (
                  <AuditActivityCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}

            {recentActivities.length > 0 && (
              <Link
                href="/admin/historico"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-md border border-border py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Ver todas as atividades
                <ArrowRight className="size-4" />
              </Link>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {/* Quick actions */}
          <section className="rounded-[16px] border border-border bg-card p-5">
            <h2 className="mb-3 text-lg font-bold text-foreground">
              Ações rápidas
            </h2>
            <div className="space-y-1.5">
              {quickActions.map((action) => {
                const Icon = QUICK_ICONS[action.icon] ?? Plus;
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Schedule */}
          {scheduleItems.length > 0 && (
            <section className="rounded-[16px] border border-border bg-card p-5">
              <h2 className="mb-3 text-lg font-bold text-foreground">
                Programação
              </h2>
              <ul className="space-y-3">
                {scheduleItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-3 rounded-md border border-border p-3"
                  >
                    <div className="flex size-8 shrink-0 flex-col items-center justify-center rounded-md bg-muted text-center">
                      <span className="text-xs leading-none font-semibold text-foreground">
                        {formatDate(item.date).split(" ")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.date).split(" ")[1]}
                      </span>
                    </div>
                    <p className="text-xs leading-snug text-foreground">
                      {item.label}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
