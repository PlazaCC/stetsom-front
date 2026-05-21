import { ProductWizard } from "@/app/admin/_components/product-wizard";
import { getCmsProvider } from "@/lib/api/provider";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProdutoEditPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await getCmsProvider().getCmsProductDetail(id);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  return <ProductWizard mode="edit" initial={detail} />;
}
