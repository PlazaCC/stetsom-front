import { ProductWizard } from "@/app/admin/_components/product-wizard";
import { buildCmsProductDetail } from "@/lib/mock/admin-cms";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProdutoEditPage({ params }: PageProps) {
  const { id } = await params;
  const detail = buildCmsProductDetail(id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  return <ProductWizard mode="edit" initial={detail} />;
}
