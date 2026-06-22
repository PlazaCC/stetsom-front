import { ProductWizard } from "@/app/admin/_components/product-wizard/wizard";
import { SetRouteLabel } from "@/app/admin/_components/admin-route-meta";
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type { CmsProductDetailPayload } from "@/api/stetsom/model";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProdutoEditPage({ params }: PageProps) {
  const { id } = await params;
  const detail = await serverOrvalClient<CmsProductDetailPayload>({
    method: "GET",
    url: `/api/products/admin/${id}`,
  }).catch(() => null);

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-4 lg:px-11.75 lg:py-7.25">
        <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <SetRouteLabel label={detail.product.name.pt} />
      <ProductWizard mode="edit" initial={detail} />
    </>
  );
}
