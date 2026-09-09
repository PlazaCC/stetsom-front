import { getLocale } from "next-intl/server";
import { getApiCategories } from "@/api/stetsom/server/categories-public/categories-public";
import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";
import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { CatalogContent } from "./_components/catalog-content";
import type { CatalogLineCardData } from "./_components/catalog-lines-grid";

const PAGE_SIZE = 24;

const EMPTY_CATALOG: ProductCatalogResponse = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 0,
};

type ApiLocale = ReturnType<typeof toApiLocale>;

/**
 * Resolves the cover for each line of a category — the thumbnail of its most
 * recently added product, falling back to the line icon. There is no batched
 * "cover per line" endpoint, so this runs one filtered request per line in
 * parallel (safe for the typical handful of lines per category).
 */
async function fetchCategoryLineCards(
  categories: PublicCategory[],
  categorySlug: string,
  apiLocale: ApiLocale,
): Promise<CatalogLineCardData[]> {
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) return [];

  const lines = [...category.lines].sort((a, b) => a.order - b.order);

  const lineCards = await Promise.all(
    lines.map(async (line) => {
      const res = await getApiProducts({
        category: categorySlug,
        line: line.slug,
        sort: "newest",
        status: "PUBLISHED",
        page: 1,
        pageSize: 1,
        locale: apiLocale,
      }).catch(() => null);

      return {
        line_id: line.line_id,
        name: line.name,
        slug: line.slug,
        icon_url: line.icon_url ?? null,
        cover_url: res?.items?.[0]?.thumbnail_url ?? line.icon_url ?? null,
      } satisfies CatalogLineCardData;
    }),
  );

  return lineCards;
}

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
    export?: string;
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
  // Descontinuados ficam ocultos por padrão; só entram no resultado quando o
  // usuário liga o filtro "Exibir descontinuados" (discontinued=1 → sem filtro).
  const is_discontinued = sp.discontinued === "1" ? undefined : false;
  const is_export = sp.export === "1" ? true : undefined;

  const categories = await getApiCategories({ locale: apiLocale }).catch(
    () => [] as PublicCategory[],
  );

  // Etapa intermediária da taxonomia: com uma categoria escolhida e nenhuma
  // linha, a página mostra as linhas da categoria em cards (imagem do último
  // produto cadastrado + nome) em vez de um grid de produtos.
  if (category && !line) {
    const lineCards = await fetchCategoryLineCards(
      categories,
      category,
      apiLocale,
    );
    return (
      <CatalogContent
        categories={categories}
        catalog={EMPTY_CATALOG}
        lineCards={lineCards}
      />
    );
  }

  const catalog = await getApiProducts({
    q,
    category,
    line,
    sort,
    status: "PUBLISHED",
    is_discontinued,
    is_export,
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
  );

  return (
    <CatalogContent
      categories={categories}
      catalog={catalog}
      lineCards={null}
    />
  );
}
