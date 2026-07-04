import { getApiLegalPagesPublicSlug } from "@/api/stetsom/server/legal-pages-public/legal-pages-public";
import { Container } from "@/components/ui/container";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

type LegalPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Prose styling for the admin-authored (sanitized) HTML body. Tailwind v4 here
// has no typography plugin, so styles are applied via descendant selectors.
const PROSE =
  "max-w-3xl text-base leading-relaxed text-text-subtle [&_a]:text-brand [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_hr]:my-8 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:text-foreground [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export default async function LegalDetailPage(props: LegalPageProps) {
  const { slug } = await props.params;
  const locale = await getLocale();

  const page = await getApiLegalPagesPublicSlug(slug, {
    locale: toApiLocale(locale),
  }).catch(() => null);

  if (!page) notFound();

  return (
    <section className="py-16">
      <Container>
        <h1 className="mb-8 font-sans-condensed text-display-sm font-black text-foreground uppercase">
          {page.title}
        </h1>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored HTML sanitized at save time */}
        <article
          className={PROSE}
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </Container>
    </section>
  );
}
