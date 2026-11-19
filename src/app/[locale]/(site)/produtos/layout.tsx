import { CompareProvider } from "./_components/product-compare/compare-provider";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CompareProvider>{children}</CompareProvider>;
}
