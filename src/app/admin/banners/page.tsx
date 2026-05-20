"use client";

import { AdminActionBar } from "@/app/admin/_components/crud/admin-action-bar";
import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { AdminSortableRow } from "@/app/admin/_components/crud/admin-sortable-row";
import { AdminStatusToggle } from "@/app/admin/_components/crud/admin-status-toggle";
import type { Banner } from "@/lib/api/contracts";
import { MOCK_CMS_BANNERS } from "@/lib/mock/admin-cms";
import { Image, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_CMS_BANNERS);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function toggleStatus(id: string) {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }
          : b,
      ),
    );
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      setOverId(null);
      return;
    }
    setBanners((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((b) => b.id === draggedId);
      const toIndex = items.findIndex((b) => b.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      return items.map((b, i) => ({ ...b, order: i + 1 }));
    });
    setDraggedId(null);
    setOverId(null);
  }

  return (
    <AdminListPage
      title="Banners"
      icon={Image}
      action={
        <AdminActionBar>
          <button className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-80">
            <Plus className="size-4" />
            Novo banner
          </button>
        </AdminActionBar>
      }
      toolbar={
        <p className="text-xs text-muted-foreground">
          Arraste as linhas para reordenar. A ordem aqui reflete a exibição no
          site.
        </p>
      }
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-8 px-2 py-3" />
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Ordem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Título
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {banners.map((banner) => (
                <AdminSortableRow
                  key={banner.id}
                  id={banner.id}
                  isDragging={draggedId === banner.id}
                  isOver={overId === banner.id && draggedId !== banner.id}
                  onDragStart={setDraggedId}
                  onDragOver={(e, id) => {
                    e.preventDefault();
                    setOverId(id);
                  }}
                  onDrop={handleDrop}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setOverId(null);
                  }}
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {banner.order}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">
                        {banner.title}
                      </p>
                      {banner.subtitle && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {banner.link_url ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <AdminStatusToggle
                        active={banner.status === "ACTIVE"}
                        onToggle={() => toggleStatus(banner.id)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {banner.status === "ACTIVE" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-brand hover:underline">
                      Editar
                    </button>
                  </td>
                </AdminSortableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminListPage>
  );
}
