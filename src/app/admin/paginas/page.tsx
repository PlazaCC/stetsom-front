"use client";

import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PAGE_LABELS, PAGE_PUBLIC_HREFS } from "./_components/page-constants";

const PAGES = Object.entries(PAGE_LABELS).map(([slug, title]) => ({
  id: slug,
  slug,
  title: { pt: title },
  updated_at: null,
}));

export default function AdminPaginasPage() {
  return (
    <AdminListPage
      title="Páginas"
      icon={FileText}
      toolbar={
        <p className="text-xs text-muted-foreground">
          Gerencie o conteúdo das seções das páginas institucionais do site.
        </p>
      }
    >
      <div className="overflow-hidden rounded-[16px] border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Página
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                Última atualização
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PAGES.map((page) => (
              <tr key={page.slug} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  {page.title.pt}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {PAGE_PUBLIC_HREFS[page.slug] ?? `/${page.slug}`}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {page.updated_at
                    ? new Date(page.updated_at).toLocaleDateString("pt-BR")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <a
                      href={PAGE_PUBLIC_HREFS[page.slug] ?? `/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="size-3" />
                      Ver
                    </a>
                    <Link
                      href={`/admin/paginas/${page.slug}`}
                      className="text-xs font-medium text-brand hover:underline"
                    >
                      Editar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminListPage>
  );
}
