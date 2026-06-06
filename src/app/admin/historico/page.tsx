"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { useGetApiAudit } from "@/api/stetsom";
import type { AuditEntry } from "@/api/stetsom/model";
import { Clock } from "lucide-react";

const columns: AdminTableColumn<AuditEntry>[] = [
  {
    key: "user_name",
    header: "Usuário",
    render: (e) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
          {e.user_name.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-foreground">
          {e.user_name}
        </span>
      </div>
    ),
  },
  {
    key: "action_sentence",
    header: "Ação feita",
    render: (e) => (
      <span className="text-sm text-foreground">{e.action_sentence}</span>
    ),
  },
  {
    key: "created_at",
    header: "Data de ação",
    render: (e) => (
      <span className="text-xs text-muted-foreground">
        {new Date(e.created_at).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
];

export default function AdminHistoricoPage() {
  const audit = useGetApiAudit();
  const entries = audit.data?.items ?? [];

  return (
    <AdminListPage
      title="Histórico"
      icon={Clock}
      toolbar={
        <p className="text-xs text-muted-foreground">
          {entries.length} entradas registradas
        </p>
      }
    >
      <AdminDataTable
        columns={columns}
        data={entries}
        isLoading={audit.isLoading}
        keyExtractor={(e) => e.id}
        emptyTitle="Nenhuma entrada registrada"
        emptyDescription="As ações dos usuários no CMS aparecerão aqui."
      />
    </AdminListPage>
  );
}
