import { CategoryForm } from "@/app/admin/produtos/categorias/_components/category-form";

export default function AdminCategoriaNovaPage() {
  return (
    <div className="px-4 py-4 lg:px-11.75 lg:py-7.25">
      <CategoryForm mode="create" />
    </div>
  );
}
