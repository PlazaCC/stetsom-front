import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  MapPin,
  MessageCircleMore,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

type SupportCard = {
  title: string;
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
  { icon: LucideIcon; href?: string }
> = {
  DOCUMENTATION: { icon: FileText, href: "#documentation" },
  SERVICE_CENTERS: { icon: MapPin, href: "#service-centers" },
  CONTACT: { icon: MessageCircleMore, href: "#contact" },
  WARRANTY: { icon: ShieldCheck },
  CUSTOM_URL: { icon: ArrowUpRight },
};

function inferAction(card: SupportCard): NonNullable<SupportCard["action"]> {
  if (card.action) return card.action;
  const text = `${card.title} ${card.description}`.toLocaleLowerCase();
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
            const { icon: Icon, href: internalHref } = ACTIONS[action];
            const href =
              internalHref ??
              (action === "WARRANTY" ? warrantyHref : card.href) ??
              "#";
            const isExternal = href.startsWith("http");

            const cardClass = cn(
              "group relative flex max-w-83.75 flex-row items-center gap-4 border border-border bg-white p-2 md:flex-col md:items-start md:gap-1 lg:p-4",
              "transition-colors duration-200",
            );

            const inner = (
              <>
                <div className="flex items-center justify-center rounded-xs">
                  <Icon strokeWidth={1.5} size={36} className="text-brand" />
                </div>
                <div>
                  <h3 className="font-sans-condensed text-xl font-bold text-brand-dark uppercase lg:text-3xl">
                    {card.title}
                  </h3>
                  <p className="max-w-2xs flex-1 text-xs leading-tight whitespace-pre-line text-text-subtle lg:text-sm lg:leading-relaxed">
                    {decodeHtmlEntities(card.description)}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-center scale-x-0 bg-brand transition-transform duration-200 group-hover:scale-x-100"
                />
                <ArrowUpRight
                  size={32}
                  className="absolute right-1 bottom-1 hidden text-text-subtle transition-colors duration-200 group-hover:text-brand md:block"
                />
                <ArrowRight
                  size={20}
                  strokeWidth={3}
                  className="text-text-subtle md:hidden"
                />
              </>
            );

            if (isExternal) {
              return (
                <a
                  key={card.title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              );
            }

            return (
              <a key={card.title} href={href} className={cardClass}>
                {inner}
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
