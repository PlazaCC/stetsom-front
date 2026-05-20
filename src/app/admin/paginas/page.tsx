import { AdminListPage } from "@/app/admin/_components/crud/admin-list-page";
import { FileText } from "lucide-react";

const SITE_PAGES = [
  {
    id: "home",
    label: "Home",
    href: "/",
    updated_at: "2026-05-19T00:00:00.000Z",
  },
  {
    id: "produtos",
    label: "Catálogo de produtos",
    href: "/produtos",
    updated_at: "2026-05-18T00:00:00.000Z",
  },
  {
    id: "sobre",
    label: "Sobre a Stetsom",
    href: "/sobre",
    updated_at: "2026-04-10T00:00:00.000Z",
  },
  {
    id: "suporte",
    label: "Suporte técnico",
    href: "/suporte",
    updated_at: "2026-05-01T00:00:00.000Z",
  },
];

export default function AdminPaginasPage() {
  return (
    <AdminListPage
      title="Páginas"
      icon={FileText}
      toolbar={
        <p className="text-xs text-muted-foreground">
          Gerencie o conteúdo das páginas institucionais do site.
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
            {SITE_PAGES.map((page) => (
              <tr key={page.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">
                  {page.label}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {page.href}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(page.updated_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-medium text-brand hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminListPage>
  );
}
