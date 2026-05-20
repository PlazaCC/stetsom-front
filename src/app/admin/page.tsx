"use client";

import { useAdminDashboard } from "@/hooks/use-admin";

export default function AdminHome() {
  const dashboard = useAdminDashboard();

  if (dashboard.isLoading) {
    return <div className="text-zinc-500">Carregando dashboard...</div>;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="text-red-600">Nao foi possivel carregar o dashboard.</div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-sans-condensed text-4xl font-black uppercase text-foreground">
          {dashboard.data.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {dashboard.data.subtitle}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.data.metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[16px] border border-border bg-card p-5"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 font-sans-condensed text-3xl font-black text-foreground">
              {metric.value}
            </p>
            {metric.variation ? (
              <p className="mt-1 text-xs text-brand">{metric.variation}</p>
            ) : null}
          </article>
        ))}
      </section>

      <section className="rounded-[16px] border border-border bg-card p-5">
        <h2 className="font-sans-condensed text-2xl font-black uppercase text-foreground">
          Atividades recentes
        </h2>

        <ul className="mt-4 space-y-3">
          {dashboard.data.recentActivities.map((activity) => (
            <li
              key={activity.id}
              className="rounded-md border border-border p-4"
            >
              <p className="font-medium text-foreground">{activity.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {new Date(activity.timestamp).toLocaleString("pt-BR")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
