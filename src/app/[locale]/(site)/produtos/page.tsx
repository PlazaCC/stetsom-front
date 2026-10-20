import { renderCatalogPage } from "./catalog-page";

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    discontinued?: string;
    export?: string;
  }>;
}) {
  const params = await searchParams;
  const result = await renderCatalogPage({
    searchParams: params,
  });

  return result;
}
