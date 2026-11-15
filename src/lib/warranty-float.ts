import type { PublicWarrantyFloatConfig } from "@/api/stetsom/model/publicWarrantyFloatConfig";

export type WarrantyFloatRoute = keyof PublicWarrantyFloatConfig["visible_on"];

export const WARRANTY_FLOAT_ROUTE_OPTIONS: ReadonlyArray<{
  key: WarrantyFloatRoute;
  label: string;
  description: string;
}> = [
  { key: "home", label: "Home", description: "/" },
  {
    key: "catalog",
    label: "Catálogo",
    description: "listagem geral /produtos",
  },
  {
    key: "category",
    label: "Categorias e linhas",
    description: "/produtos/[categoria]",
  },
  {
    key: "product",
    label: "Produto",
    description: "detalhe /produto/[slug]",
  },
  { key: "about", label: "Sobre", description: "/sobre" },
  { key: "support", label: "Suporte", description: "/suporte" },
];

/**
 * Maps next-intl's internal pathname templates to the global warranty-float
 * configuration. The normalized fallbacks also keep direct paths with a
 * trailing slash consistent with their canonical routes.
 */
export function resolveWarrantyFloatRoute(
  pathname: string,
): WarrantyFloatRoute | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";

  if (normalized === "/") return "home";
  if (normalized === "/produtos") return "catalog";
  if (normalized === "/sobre") return "about";
  if (normalized === "/suporte") return "support";
  if (normalized === "/produto/[slug]" || normalized.startsWith("/produto/")) {
    return "product";
  }
  if (
    normalized === "/produtos/[category]" ||
    normalized === "/produtos/[category]/[line]" ||
    normalized === "/produtos/[category]/produtos" ||
    normalized.startsWith("/produtos/")
  ) {
    return "category";
  }

  return null;
}
