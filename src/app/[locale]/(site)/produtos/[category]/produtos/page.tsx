import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { toApiLocale } from "@/i18n/locale";
import { buildLocalizedAlternates, localizedSlug } from "@/i18n/metadata";
import { resolveLocalizedTaxonomy } from "@/lib/catalog/taxonomy";
import type { Locale } from "@/i18n/routing";
import { getCatalogCategories, renderCatalogPage } from "../../catalog-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const [{ category }, locale, t] = await Promise.all([
    params,
    getLocale(),
    getTranslations("Catalog"),
  ]);
  const categories = await getCatalogCategories(toApiLocale(locale)).catch(
    () => [],
  );
  const resolved = resolveLocalizedTaxonomy(
    categories,
    category,
    undefined,
    locale as Locale,
  );
  const item = resolved?.category;
  return item
    ? {
        title: `${item.name} | ${t("allProductsTitle")}`,
        alternates: buildLocalizedAlternates(locale, (apiLocale) => ({
          pathname: "/produtos/[category]/produtos",
          params: { category: localizedSlug(item.localized_slugs, apiLocale) },
        })),
      }
    : {};
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    discontinued?: string;
    export?: string;
  }>;
}) {
  const [{ category }, filters] = await Promise.all([params, searchParams]);
  const result = await renderCatalogPage({
    category,
    all: true,
    searchParams: filters,
  });
  if (!result) notFound();
  return result;
}
