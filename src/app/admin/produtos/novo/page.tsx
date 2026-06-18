import { ProductWizard } from "@/app/admin/_components/product-wizard";

export default function AdminProdutoNovoPage() {
  return (
    <div className="px-4 py-4 lg:px-11.75 lg:py-7.25">
      <ProductWizard mode="create" />
    </div>
  );
}
