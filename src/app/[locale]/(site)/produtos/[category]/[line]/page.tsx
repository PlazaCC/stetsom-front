import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { toApiLocale } from "@/i18n/locale";
import { buildLocalizedAlternates, localizedSlug } from "@/i18n/metadata";
import { resolveLocalizedTaxonomy } from "@/lib/catalog/taxonomy";
import type { Locale } from "@/i18n/routing";
import { getCatalogCategories, renderCatalogPage } from "../../catalog-page";

type LinePageProps = {
  params: Promise<{ category: string; line: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    discontinued?: string;
    export?: string;
  }>;
};

export async function generateMetadata(
  props: Pick<LinePageProps, "params">,
): Promise<Metadata> {
  const [{ category, line }, locale, t] = await Promise.all([
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
    line,
    locale as Locale,
  );
  const item = resolved?.category;
  const lineItem = resolved?.line;
  return lineItem && item
    ? {
        title: `${lineItem.name} | ${item.name} | ${t("productsTitle")}`,
        alternates: buildLocalizedAlternates(locale, (apiLocale) => ({
          pathname: "/produtos/[category]/[line]",
          params: {
            category: localizedSlug(item.localized_slugs, apiLocale),
            line: localizedSlug(lineItem.localized_slugs, apiLocale),
          },
        })),
      }
    : {};
}

export default async function LinePage({
  params,
  searchParams,
}: LinePageProps) {
  const [{ category, line }, filters] = await Promise.all([
    params,
    searchParams,
  ]);
  const result = await renderCatalogPage({
    category,
    line,
    all: true,
    searchParams: filters,
  });
  if (!result) notFound();
  return result;
}
