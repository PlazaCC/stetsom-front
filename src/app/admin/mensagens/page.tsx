"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminDrawer } from "@/app/admin/_components/crud/admin-drawer";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import {
  getGetApiMessagesQueryKey,
  patchApiMessagesId,
  useGetApiMessages,
} from "@/api/stetsom";
import type { ContactMessage } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Mail, Settings } from "lucide-react";
import { useState } from "react";

type Tab = "contatos" | "departamentos";

const DEPARTMENTS: string[] = [
  "Suporte Técnico",
  "Comercial",
  "Produto",
  "Marketing",
  "Financeiro",
];

export default function AdminMensagensPage() {
  const queryClient = useQueryClient();
  const messagesQuery = useGetApiMessages();
  const [localOverrides, setLocalOverrides] = useState<
    Record<string, Partial<ContactMessage>>
  >({});
  const [selected, setSelected] = useState<ContactMessage | undefined>();
  const [activeTab, setActiveTab] = useState<Tab>("contatos");

  const markReadMutation = useMutation({
    mutationFn: (id: string) => patchApiMessagesId(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getGetApiMessagesQueryKey() }),
  });

  const messages: ContactMessage[] = (messagesQuery.data?.items ?? []).map(
    (m) => ({
      ...m,
      ...localOverrides[m.id],
    }),
  );

  function markAsRead(id: string) {
    setLocalOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], is_read: true },
    }));
    markReadMutation.mutate(id);
  }

  function handleOpen(message: ContactMessage) {
    setSelected(message);
    if (!message.is_read) markAsRead(message.id);
  }

  const unread = messages.filter((m) => !m.is_read).length;

  const contactColumns: AdminTableColumn<ContactMessage>[] = [
    {
      key: "status",
      header: "",
      className: "w-2",
      render: (m) =>
        !m.is_read ? (
          <span className="block size-2 rounded-full bg-brand" />
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
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
          {m.department}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "text-right",
      className: "text-right",
      render: (m) => (
        <button
          type="button"
          onClick={() => handleOpen(m)}
          className="text-xs font-medium text-brand hover:underline"
        >
          Ver mensagem
        </button>
      ),
    },
  ];

  return (
    <>
      <AdminListPage
        title="Central de contato"
        icon={Mail}
        action={
          <AdminActionBar>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Settings className="size-4" />
              Configurar encaminhamento
            </button>
          </AdminActionBar>
        }
        toolbar={
          <div className="flex items-center gap-4">
            <div className="flex border-b border-border">
              {(["contatos", "departamentos"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium capitalize transition-colors",
                    activeTab === tab
                      ? "border-b-2 border-brand text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab === "contatos" ? "Contatos" : "Departamentos"}
                </button>
              ))}
            </div>
            {activeTab === "contatos" && unread > 0 && (
              <span className="text-xs text-muted-foreground">
                <span className="font-semibold text-brand">{unread}</span>{" "}
                {unread === 1 ? "não lida" : "não lidas"}
              </span>
            )}
          </div>
        }
      >
        {activeTab === "contatos" ? (
          <AdminDataTable
            columns={contactColumns}
            data={messages}
            isLoading={messagesQuery.isLoading}
            keyExtractor={(m) => m.id}
            emptyTitle="Nenhuma mensagem"
            emptyDescription="As mensagens enviadas pelo site aparecerão aqui."
          />
        ) : (
          <div className="overflow-hidden rounded-[16px] border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Departamento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Mensagens recebidas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Não lidas
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DEPARTMENTS.map((dept) => {
                  const deptMessages = messages.filter(
                    (m) => m.department === dept,
                  );
                  const deptUnread = deptMessages.filter(
                    (m) => !m.is_read,
                  ).length;
                  return (
                    <tr key={dept} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {dept}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {deptMessages.length}
                      </td>
                      <td className="px-4 py-3">
                        {deptUnread > 0 ? (
                          <span className="font-semibold text-brand">
                            {deptUnread}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminListPage>

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
                {selected.department}
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
              <p className="whitespace-pre-wrap leading-relaxed text-sm text-foreground">
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
    </>
  );
}
