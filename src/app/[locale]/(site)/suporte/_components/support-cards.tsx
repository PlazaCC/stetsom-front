import { PageIcon } from "@/components/page-icons/page-icon";
import type { PageIconOptionName } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { RichText } from "@/components/editor/block-text/rich-text";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type SupportCard = {
  title: string;
  icon?: string;
  description: string;
  action?:
    | "DOCUMENTATION"
    | "SERVICE_CENTERS"
    | "CONTACT"
    | "WARRANTY"
    | "CUSTOM_URL";
  href?: string;
};

const ACTIONS: Record<
  NonNullable<SupportCard["action"]>,
  { href?: string; icon: PageIconOptionName }
> = {
  DOCUMENTATION: { href: "#documentation", icon: "file-text" },
  SERVICE_CENTERS: { href: "#service-centers", icon: "map-pin" },
  CONTACT: { href: "#contact", icon: "message-circle-more" },
  WARRANTY: { icon: "shield-check" },
  CUSTOM_URL: { icon: "arrow-up-right" },
};

function inferAction(card: SupportCard): NonNullable<SupportCard["action"]> {
  if (card.action) return card.action;
  const text = decodeHtmlEntities(
    `${card.title} ${card.description}`.replace(/<[^>]*>/g, " "),
  ).toLocaleLowerCase();
  if (
    text.includes("manual") ||
    text.includes("document") ||
    text.includes("download")
  )
    return "DOCUMENTATION";
  if (
    text.includes("assistência") ||
    text.includes("assistencia") ||
    text.includes("autorizado")
  )
    return "SERVICE_CENTERS";
  if (text.includes("contato") || text.includes("fale conosco"))
    return "CONTACT";
  if (text.includes("garantia") || text.includes("warranty")) return "WARRANTY";
  return "CUSTOM_URL";
}

interface SupportCardsProps {
  cards: SupportCard[];
  warrantyHref?: string;
}

export function SupportCards({
  cards,
  warrantyHref,
}: Readonly<SupportCardsProps>) {
  return (
    <section className="w-full bg-off-white py-8 lg:py-12">
      <Container className="flex justify-center">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const action = inferAction(card);
            const { href: internalHref, icon: fallbackIcon } = ACTIONS[action];
            const href =
              internalHref ??
              (action === "WARRANTY" ? warrantyHref : card.href) ??
              "#";
            const isExternal = href.startsWith("http");

            const cardClass = cn(
              "group relative flex max-w-83.75 flex-row items-center gap-4 border border-border bg-white p-2 md:flex-col md:items-start md:gap-1 lg:p-4",
              "transition-colors duration-200",
            );

            return (
              <div key={card.title} className={cardClass}>
                <a
                  href={href}
                  aria-label={decodeHtmlEntities(
                    card.title.replace(/<[^>]*>/g, " "),
                  ).trim()}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="absolute inset-0 z-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                />
                <div className="pointer-events-none relative z-10 flex items-center justify-center rounded-xs">
                  <PageIcon
                    name={card.icon}
                    fallback={fallbackIcon}
                    strokeWidth={1.5}
                    size={36}
                    className="text-brand"
                  />
                </div>
                <div className="pointer-events-none relative z-10 [&_a]:pointer-events-auto">
                  <RichText
                    headingLevel={3}
                    content={card.title}
                    className="font-sans-condensed text-xl font-bold text-brand-dark uppercase lg:text-3xl"
                  />
                  <RichText
                    content={card.description}
                    className="max-w-2xs flex-1 text-xs leading-tight text-text-subtle lg:text-sm lg:leading-relaxed"
                  />
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-center scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100"
                />
                <ArrowUpRight
                  size={32}
                  className="pointer-events-none absolute right-1 bottom-1 hidden text-text-subtle transition-colors duration-200 group-hover:text-brand md:block"
                />
                <ArrowRight
                  size={20}
                  strokeWidth={3}
                  className="pointer-events-none text-text-subtle md:hidden"
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
