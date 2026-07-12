import { CategoriesContent } from "./_components/categories-content";

export default async function AdminCategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <CategoriesContent initialSelectedId={category} />;
}
