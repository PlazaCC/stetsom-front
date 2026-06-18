import { TemplateForm } from "@/app/admin/produtos/categorias/_components/template-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCategoriaTemplateNovoPage({
  params,
}: PageProps) {
  const { id } = await params;
  return (
    <div className="px-4 py-4 lg:px-11.75 lg:py-7.25">
      <TemplateForm mode="create" categoryId={id} />
    </div>
  );
}
