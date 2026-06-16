import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import type { PublicCategory } from "@/api/stetsom/model";
import { serverOrvalClient } from "@/api/stetsom/orval-server";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  // Categories power the header nav. The public payload only carries a
  // localized name + slug (no image/description), so the Header keeps curated
  // presentation by slug. A failed fetch falls back to the curated list.
  const categories = await serverOrvalClient<PublicCategory[]>({
    method: "GET",
    url: "/api/categories",
    params: { locale: toApiLocale(locale) },
  }).catch(() => [] as PublicCategory[]);

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
