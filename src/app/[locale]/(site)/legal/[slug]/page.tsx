import { getApiLegalPagesPublicSlug } from "@/api/stetsom/server/legal-pages-public/legal-pages-public";
import { Container } from "@/components/ui/container";
import { toApiLocale } from "@/i18n/locale";
import { buildLocalizedAlternates, localizedSlug } from "@/i18n/metadata";
import { getPathname } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";

type LegalPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const getLegalPage = cache((slug: string, locale: "pt" | "en" | "es") =>
  getApiLegalPagesPublicSlug(slug, { locale }),
);

// Prose styling for the admin-authored (sanitized) HTML body. Tailwind v4 here
// has no typography plugin, so styles are applied via descendant selectors.
const PROSE =
  "max-w-3xl text-base leading-relaxed text-text-subtle [&_a]:text-brand [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-8 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export async function generateMetadata({
  params,
}: LegalPageProps): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const page = await getLegalPage(slug, toApiLocale(locale)).catch(() => null);
  if (!page) return {};

  return {
    title: page.title,
    alternates: buildLocalizedAlternates(locale, (apiLocale) => ({
      pathname: "/legal/[slug]",
      params: { slug: localizedSlug(page.localized_slugs, apiLocale) },
    })),
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const apiLocale = toApiLocale(locale);
  const page = await getLegalPage(slug, apiLocale).catch(() => null);
  if (!page) notFound();

  const canonicalSlug = localizedSlug(page.localized_slugs, apiLocale);
  if (slug !== canonicalSlug) {
    permanentRedirect(
      getPathname({
        locale,
        href: { pathname: "/legal/[slug]", params: { slug: canonicalSlug } },
      }),
    );
  }

  return (
    <main className="mt-header bg-white py-12 lg:py-20">
      <Container>
        <h1 className="font-sans-condensed text-4xl leading-none font-black text-brand-dark uppercase lg:text-display-sm">
          {page.title}
        </h1>
        <div
          className={`${PROSE} mt-8`}
          // HTML is sanitized by stetsom-api before persistence and again when read.
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </Container>
    </main>
  );
}
