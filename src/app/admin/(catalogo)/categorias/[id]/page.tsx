import { CategoryForm } from "../_components/category-form";

export default async function AdminCategoriaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryForm categoryId={id} />;
}
