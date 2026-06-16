import { TemplateForm } from "@/app/admin/produtos/categorias/_components/template-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCategoriaTemplateNovoPage({
  params,
}: PageProps) {
  const { id } = await params;
  return <TemplateForm mode="create" categoryId={id} />;
}
