"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSearchInput } from "@/app/admin/_components/crud/admin-search-input";
import type { AuditAction, AuditEntry } from "@/lib/api/contracts";
import { MOCK_CMS_AUDIT_LOG } from "@/lib/mock/admin-cms";
import { Clock } from "lucide-react";
import { useMemo, useState } from "react";

const ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
  LOGIN: "Login",
  LOGOUT: "Logout",
  PUBLISH: "Publicação",
};

const ACTION_COLORS: Record<AuditAction, string> = {
  CREATE:
    "rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700",
  UPDATE:
    "rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700",
  DELETE: "rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700",
  LOGIN:
    "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground",
  LOGOUT:
    "rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
  PUBLISH:
    "rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand",
};

export default function AdminHistoricoPage() {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_CMS_AUDIT_LOG.filter((entry) => {
      const matchesSearch =
        !q ||
        entry.user_name.toLowerCase().includes(q) ||
        entry.entity.toLowerCase().includes(q) ||
        (entry.entity_label?.toLowerCase().includes(q) ?? false);

      const matchesAction =
        actionFilter === "ALL" || entry.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [query, actionFilter]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleFilter(action: AuditAction | "ALL") {
    setActionFilter(action);
    setPage(1);
  }

  const columns: AdminTableColumn<AuditEntry>[] = [
    {
      key: "action",
      header: "Ação",
      render: (e) => (
        <span className={ACTION_COLORS[e.action]}>
          {ACTION_LABELS[e.action]}
        </span>
      ),
    },
    {
      key: "entity",
      header: "Entidade",
      render: (e) => (
        <div>
          <p className="text-sm text-foreground">{e.entity}</p>
          {e.entity_label && (
            <p className="text-xs text-muted-foreground">{e.entity_label}</p>
          )}
        </div>
      ),
    },
    {
      key: "user_name",
      header: "Usuário",
      render: (e) => (
        <span className="text-sm text-foreground">{e.user_name}</span>
      ),
    },
    {
      key: "created_at",
      header: "Data",
      render: (e) => (
        <span className="text-xs text-muted-foreground">
          {new Date(e.created_at).toLocaleString("pt-BR")}
        </span>
      ),
    },
  ];

  return (
    <AdminListPage
      title="Histórico"
      icon={Clock}
      toolbar={
        <div className="flex items-center gap-3">
          <AdminSearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Buscar por usuário ou entidade"
            className="max-w-72"
          />
          <select
            value={actionFilter}
            onChange={(e) =>
              handleFilter(e.target.value as AuditAction | "ALL")
            }
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="ALL">Todas as ações</option>
            {(Object.keys(ACTION_LABELS) as AuditAction[]).map((action) => (
              <option key={action} value={action}>
                {ACTION_LABELS[action]}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "entrada" : "entradas"}
          </span>
        </div>
      }
    >
      <AdminDataTable
        columns={columns}
        data={paginated}
        keyExtractor={(e) => e.id}
        emptyTitle="Nenhuma entrada encontrada"
        emptyDescription="Ajuste os filtros ou aguarde novas ações no sistema."
        pagination={{
          page,
          pageSize,
          total: filtered.length,
          onPageChange: setPage,
        }}
      />
    </AdminListPage>
  );
}
