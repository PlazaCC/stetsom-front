"use client";

import {
  AdminDataTable,
  type AdminTableColumn,
} from "@/app/admin/_components/crud/admin-data-table";
import { AdminDrawer } from "@/app/admin/_components/crud/admin-drawer";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import type { ContactMessage } from "@/lib/api/contracts";
import { MOCK_CMS_MESSAGES } from "@/lib/mock/admin-cms";
import { Bell } from "lucide-react";
import { useState } from "react";

export default function AdminMensagensPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(MOCK_CMS_MESSAGES);
  const [selected, setSelected] = useState<ContactMessage | undefined>();

  function markAsRead(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)),
    );
  }

  function handleOpen(message: ContactMessage) {
    setSelected(message);
    if (!message.is_read) markAsRead(message.id);
  }

  const unread = messages.filter((m) => !m.is_read).length;

  const columns: AdminTableColumn<ContactMessage>[] = [
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
      header: "Remetente",
      render: (m) => (
        <div>
          <p className="font-medium text-foreground">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Assunto",
      render: (m) => <span className="text-foreground">{m.subject}</span>,
    },
    {
      key: "created_at",
      header: "Recebida",
      render: (m) => (
        <span className="text-xs text-muted-foreground">
          {new Date(m.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
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
        title="Central de Mensagens"
        icon={Bell}
        toolbar={
          unread > 0 ? (
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-brand">{unread}</span>{" "}
              {unread === 1 ? "mensagem não lida" : "mensagens não lidas"}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Todas as mensagens foram lidas.
            </p>
          )
        }
      >
        <AdminDataTable
          columns={columns}
          data={messages}
          keyExtractor={(m) => m.id}
          emptyTitle="Nenhuma mensagem"
          emptyDescription="As mensagens enviadas pelo site aparecerão aqui."
        />
      </AdminListPage>

      <AdminDrawer
        open={!!selected}
        onClose={() => setSelected(undefined)}
        title="Mensagem"
      >
        {selected && (
          <div className="space-y-5">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Remetente
              </p>
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
                Assunto
              </p>
              <p className="text-sm font-semibold text-foreground">
                {selected.subject}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Recebida em
              </p>
              <p className="text-xs text-foreground">
                {new Date(selected.created_at).toLocaleString("pt-BR")}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Mensagem
              </p>
              <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
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
