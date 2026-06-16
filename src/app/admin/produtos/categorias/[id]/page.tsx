import { CategoryForm } from "@/app/admin/produtos/categorias/_components/category-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCategoriaEditPage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryForm mode="edit" categoryId={id} />;
}
