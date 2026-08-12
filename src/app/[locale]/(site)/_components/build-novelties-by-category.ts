import type { ProductCardItem, PublicCategory } from "@/api/stetsom/model";

export type NoveltyCategory = {
  slug: string;
  name: string;
  spotlight: ProductCardItem;
  grid: ProductCardItem[];
};

/** One spotlight + four grid cards per category. */
export const NOVELTIES_PAGE_SIZE = 5;

export async function buildNoveltiesByCategory(
  categories: PublicCategory[],
  fetchProducts: (categorySlug: string) => Promise<ProductCardItem[]>,
): Promise<NoveltyCategory[]> {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const results = await Promise.all(
    sortedCategories.map(async (category) => {
      const items = await fetchProducts(category.slug);
      if (items.length === 0) return null;

      const [spotlight, ...rest] = items;
      return {
        slug: category.slug,
        name: category.name,
        spotlight,
        grid: rest.slice(0, NOVELTIES_PAGE_SIZE - 1),
      } satisfies NoveltyCategory;
    }),
  );

  return results.filter((novelty) => novelty !== null);
}
