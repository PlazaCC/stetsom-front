"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminDrawer } from "@/app/admin/_components/crud/admin-drawer";
import { AdminPageLayout } from "@/app/admin/_components/crud/admin-page-layout";
import {
  AdminRowAction,
  AdminRowActions,
} from "@/app/admin/_components/crud/admin-row-actions";
import { StatusBadge } from "@/app/admin/_components/crud/status-badge";
import {
  getGetApiMessagesQueryKey,
  patchApiMessagesId,
  useGetApiConfig,
  useGetApiMessages,
} from "@/api/stetsom";
import type { ContactMessage } from "@/api/stetsom/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useState } from "react";
import { DepartmentRoutingModal } from "./department-routing-modal";

type Tab = "contatos" | "departamentos";

interface DeptRow {
  slug: string;
  label: string;
  total: number;
  unread: number;
}

interface MensagensContentProps {
  activeTab: Tab;
}

export function MensagensContent({ activeTab }: MensagensContentProps) {
  const queryClient = useQueryClient();
  const messagesQuery = useGetApiMessages();
  const configQuery = useGetApiConfig();
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, Partial<ContactMessage>>
  >({});
  const [selected, setSelected] = useState<ContactMessage | undefined>();
  const [routingOpen, setRoutingOpen] = useState(false);

  const markReadMutation = useMutation({
    mutationFn: (id: string) => patchApiMessagesId(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getGetApiMessagesQueryKey() }),
  });

  const messages: ContactMessage[] = (messagesQuery.data?.items ?? []).map(
    (m) => ({ ...m, ...localOverrides[m.id] }),
  );

  const configuredDepts = configQuery.data?.contact_departments ?? [];

  function departmentLabel(slug: string): string {
    const match = configuredDepts.find((d) => d.slug === slug);
    return match?.label ?? slug;
  }

  function markAsRead(id: string) {
    setLocalOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], is_read: true },
    }));
    markReadMutation.mutate(id, {
      onError: () => {
        setLocalOverrides((prev) => ({
          ...prev,
          [id]: { ...prev[id], is_read: false },
        }));
      },
    });
  }

  function handleOpen(message: ContactMessage) {
    setSelected(message);
    if (!message.is_read) markAsRead(message.id);
  }

  const unread = messages.filter((m) => !m.is_read).length;

  const deptSlugs =
    configuredDepts.length > 0
      ? configuredDepts.map((d) => d.slug)
      : [...new Set(messages.map((m) => m.department))];

  const deptRows: DeptRow[] = deptSlugs.map((slug) => {
    const deptMessages = messages.filter((m) => m.department === slug);
    return {
      slug,
      label: departmentLabel(slug),
      total: deptMessages.length,
      unread: deptMessages.filter((m) => !m.is_read).length,
    };
  });

  const contactColumns: AdminTableColumn<ContactMessage>[] = [
    {
      key: "status",
      header: "",
      className: "w-2",
      render: (m) =>
        !m.is_read ? (
          <span className="block size-2 rounded-full bg-primary" />
        ) : null,
    },
    {
      key: "name",
      header: "Nome",
      render: (m) => (
        <div>
          <p className="font-medium text-foreground">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.email}</p>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Data do contato",
      render: (m) => (
        <span className="text-xs text-muted-foreground">
          {new Date(m.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "department",
      header: "Setor responsável",
      render: (m) => (
        <StatusBadge
          status={m.department}
          label={departmentLabel(m.department)}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (m) => (
        <AdminRowActions>
          <AdminRowAction onClick={() => handleOpen(m)}>
            Ver mensagem
          </AdminRowAction>
        </AdminRowActions>
      ),
    },
  ];

  const deptColumns: AdminTableColumn<DeptRow>[] = [
    {
      key: "label",
      header: "Departamento",
      render: (d) => (
        <span className="font-medium text-foreground">{d.label}</span>
      ),
    },
    {
      key: "total",
      header: "Mensagens recebidas",
      render: (d) => <span className="text-muted-foreground">{d.total}</span>,
    },
    {
      key: "unread",
      header: "Não lidas",
      render: (d) =>
        d.unread > 0 ? (
          <span className="font-semibold text-primary">{d.unread}</span>
        ) : (
          <span className="text-muted-foreground">0</span>
        ),
    },
  ];

  const settingsAction = (
    <AdminActionBar>
      <button
        type="button"
        onClick={() => setRoutingOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
      >
        <Settings className="size-4" />
        Configurar encaminhamento
      </button>
    </AdminActionBar>
  );

  return (
    <>
      <AdminPageLayout>
        {activeTab === "contatos" ? (
          <AdminDataTable
            columns={contactColumns}
            data={messages}
            isLoading={messagesQuery.isLoading}
            keyExtractor={(m) => m.id}
            emptyTitle="Nenhuma mensagem"
            emptyDescription="As mensagens enviadas pelo site aparecerão aqui."
            action={settingsAction}
            toolbar={
              unread > 0 ? (
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">{unread}</span>{" "}
                  {unread === 1 ? "não lida" : "não lidas"}
                </span>
              ) : undefined
            }
          />
        ) : (
          <AdminDataTable
            columns={deptColumns}
            data={deptRows}
            isLoading={messagesQuery.isLoading}
            keyExtractor={(d) => d.slug}
            emptyTitle="Nenhum departamento configurado"
            emptyDescription="Configure os departamentos de encaminhamento abaixo."
            action={settingsAction}
          />
        )}
      </AdminPageLayout>

      <AdminDrawer
        open={!!selected}
        onClose={() => setSelected(undefined)}
        title="Mensagem"
      >
        {selected && (
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Nome</p>
              <p className="text-sm font-semibold text-foreground">
                {selected.name}
              </p>
              <p className="text-xs text-muted-foreground">{selected.email}</p>
              {selected.phone && (
                <p className="text-xs text-muted-foreground">
                  {selected.phone}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Setor responsável
              </p>
              <p className="text-sm font-medium text-foreground">
                {departmentLabel(selected.department)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Assunto
              </p>
              <p className="text-sm font-semibold text-foreground">
                {selected.subject}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Data do contato
              </p>
              <p className="text-xs text-foreground">
                {new Date(selected.created_at).toLocaleString("pt-BR")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Mensagem
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {selected.message}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                className="flex-1 rounded-md bg-foreground py-2 text-center text-sm font-semibold text-background transition-opacity hover:opacity-80"
              >
                Responder por e-mail
              </a>
            </div>
          </div>
        )}
      </AdminDrawer>

      {routingOpen && (
        <DepartmentRoutingModal
          onClose={() => setRoutingOpen(false)}
          initialDepartments={configQuery.data?.contact_departments ?? []}
        />
      )}
    </>
  );
}
