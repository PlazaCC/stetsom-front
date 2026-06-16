import { TemplateForm } from "@/app/admin/produtos/categorias/_components/template-form";

interface PageProps {
  params: Promise<{ id: string; templateId: string }>;
}

export default async function AdminCategoriaTemplateEditPage({
  params,
}: PageProps) {
  const { id, templateId } = await params;
  return <TemplateForm mode="edit" categoryId={id} templateId={templateId} />;
}
