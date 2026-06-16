import { getLocale } from "next-intl/server";
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { CatalogContent } from "./_components/catalog-content";

const PAGE_SIZE = 24;

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    line?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const [sp, locale] = await Promise.all([searchParams, getLocale()]);
  const apiLocale = toApiLocale(locale);

  const q = sp.q?.trim() || undefined;
  const category =
    sp.category && sp.category !== "todos" ? sp.category : undefined;
  const line = sp.line && sp.line !== "todas" ? sp.line : undefined;
  const sort = sp.sort === "newest" ? "newest" : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [categories, catalog] = await Promise.all([
    serverOrvalClient<PublicCategory[]>({
      method: "GET",
      url: "/api/categories",
      params: { locale: apiLocale },
    }).catch(() => [] as PublicCategory[]),
    serverOrvalClient<ProductCatalogResponse>({
      method: "GET",
      url: "/api/products",
      params: {
        q,
        category,
        line,
        sort,
        status: "PUBLISHED",
        page,
        pageSize: PAGE_SIZE,
        locale: apiLocale,
      },
    }).catch(
      () =>
        ({
          items: [],
          total: 0,
          page,
          pageSize: PAGE_SIZE,
          totalPages: 0,
        }) satisfies ProductCatalogResponse,
    ),
  ]);

  return <CatalogContent categories={categories} catalog={catalog} />;
}
