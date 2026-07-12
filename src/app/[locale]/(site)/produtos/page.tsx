import { getLocale } from "next-intl/server";
import { getApiCategories } from "@/api/stetsom/server/categories-public/categories-public";
import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";
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
    discontinued?: string;
    // export?: string; // TODO(backend): no export-line concept in the schema yet — toggle has no effect
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
  const is_discontinued = sp.discontinued === "0" ? false : undefined;

  const [categories, catalog] = await Promise.all([
    getApiCategories({ locale: apiLocale }).catch(() => [] as PublicCategory[]),
    getApiProducts({
      q,
      category,
      line,
      sort,
      status: "PUBLISHED",
      is_discontinued,
      page,
      pageSize: PAGE_SIZE,
      locale: apiLocale,
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
