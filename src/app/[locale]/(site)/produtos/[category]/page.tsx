import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { toApiLocale } from "@/i18n/locale";
import { buildLocalizedAlternates, localizedSlug } from "@/i18n/metadata";
import { resolveLocalizedTaxonomy } from "@/lib/catalog/taxonomy";
import type { Locale } from "@/i18n/routing";
import { getCatalogCategories, renderCatalogPage } from "../catalog-page";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    discontinued?: string;
    export?: string;
  }>;
};

export async function generateMetadata(
  props: Pick<CategoryPageProps, "params">,
): Promise<Metadata> {
  const [{ category }, locale, t] = await Promise.all([
    props.params,
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
  if (!item) return {};
  return {
    title: `${item.name} | ${t("productsTitle")}`,
    alternates: buildLocalizedAlternates(locale, (apiLocale) => ({
      pathname: "/produtos/[category]",
      params: { category: localizedSlug(item.localized_slugs, apiLocale) },
    })),
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ category }, filters] = await Promise.all([params, searchParams]);
  const result = await renderCatalogPage({ category, searchParams: filters });
  if (!result) notFound();
  return result;
}
