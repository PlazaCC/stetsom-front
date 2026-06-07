import { AdminTabs } from "@/app/admin/_components/crud/admin-tabs";
import { LayoutTemplate, ListChecks, Package, Tags } from "lucide-react";

/**
 * Tab bar for the Produtos area. Categorias, Templates and Atributos are
 * configuration of the product catalog, so they live as tabs alongside the
 * product listing (Figma 1684-8363) instead of separate sidebar entries.
 */
export function ProdutosTabs() {
  return (
    <AdminTabs
      items={[
        {
          href: "/admin/produtos",
          label: "Produtos",
          icon: Package,
          exact: true,
        },
        { href: "/admin/produtos/categorias", label: "Categorias", icon: Tags },
        {
          href: "/admin/produtos/templates",
          label: "Templates",
          icon: LayoutTemplate,
        },
        {
          href: "/admin/produtos/atributos",
          label: "Atributos",
          icon: ListChecks,
        },
      ]}
    />
  );
}
