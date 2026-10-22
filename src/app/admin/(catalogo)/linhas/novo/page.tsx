import { LineForm } from "../_components/line-form";

export default async function AdminLinhaNovoPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  return <LineForm initialCategoryId={category} />;
}
