import { TemplateForm } from "@/app/admin/produtos/categorias/_components/template-form";

interface PageProps {
  params: Promise<{ id: string; templateId: string }>;
}

export default async function AdminCategoriaTemplateEditPage({
  params,
}: PageProps) {
  const { id, templateId } = await params;
  return (
    <div className="px-4 py-4 lg:px-11.75 lg:py-7.25">
      <TemplateForm mode="edit" categoryId={id} templateId={templateId} />
    </div>
  );
}
