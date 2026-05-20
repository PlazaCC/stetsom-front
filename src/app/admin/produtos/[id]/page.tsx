"use client";

import { ProductWizard } from "@/app/admin/_components/product-wizard";
import { buildCmsProductDetail } from "@/lib/mock/admin-cms";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProdutoEditPage({ params }: PageProps) {
  const { id } = use(params);
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
