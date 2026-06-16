"use client";

import { useGetApiDashboard } from "@/api/stetsom";
import { Image, Mail, Package, Plus, Upload } from "lucide-react";
import Link from "next/link";

const QUICK_ICONS: Record<string, React.ElementType> = {
  package: Package,
  image: Image,
  upload: Upload,
  mail: Mail,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default function AdminHome() {
  const dashboard = useGetApiDashboard();

  if (dashboard.isLoading) {
    return <div className="text-muted-foreground">Carregando dashboard...</div>;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="text-destructive">
        Não foi possível carregar o dashboard.
      </div>
    );
  }

  const { metrics, recentActivities, scheduleItems, quickActions } =
    dashboard.data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold text-foreground">
          {dashboard.data.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {dashboard.data.subtitle}
        </p>
      </header>

      {/* Metrics */}
      <section className="grid gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="flex items-start gap-4 rounded-[16px] border border-border bg-card p-5"
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
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
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

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Recent activities */}
          <section className="rounded-[16px] border border-border bg-card p-5">
            <h2 className="text-xl font-bold text-foreground">
              Atividades recentes
            </h2>
            <ul className="mt-4 space-y-3">
              {recentActivities.length === 0 ? (
                <li className="py-6 text-center text-sm text-muted-foreground">
                  Nenhuma atividade recente.
                </li>
              ) : (
                recentActivities.map((activity) => (
                  <li
                    key={activity.id}
                    className="rounded-md border border-border p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </li>
                ))
              )}
            </ul>
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
                      <span className="text-xs font-semibold leading-none text-foreground">
                        {formatDate(item.date).split(" ")[0]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.date).split(" ")[1]}
                      </span>
                    </div>
                    <p className="text-xs text-foreground leading-snug">
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
