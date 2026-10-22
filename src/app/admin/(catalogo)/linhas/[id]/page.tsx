import { LineForm } from "../_components/line-form";

export default async function AdminLinhaEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { id } = await params;
  const { category } = await searchParams;
  return <LineForm lineId={id} initialCategoryId={category} />;
}
