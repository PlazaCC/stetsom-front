"use client";

import { ProductWizard } from "@/app/admin/_components/product-wizard";
import { MOCK_CMS_PRODUCTS_DETAIL } from "@/lib/mock/admin-cms";
import { use } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminProdutoEditPage({ params }: PageProps) {
  const { id } = use(params);
  const detail = MOCK_CMS_PRODUCTS_DETAIL[id];

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-sm text-muted-foreground">Produto não encontrado.</p>
      </div>
    );
  }

  return <ProductWizard mode="edit" initial={detail} />;
}
