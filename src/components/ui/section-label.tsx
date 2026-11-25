import { RichText } from "@/components/editor/block-text/rich-text";
import { cn } from "@/lib/utils";
import { decodeHtmlEntities } from "@/lib/utils/plain-text";

interface SectionLabelProps {
  label: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
  rich?: boolean;
}

export function SectionLabel({
  label,
  title,
  subtitle,
  dark = false,
  className,
  rich = false,
}: SectionLabelProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn("h-px w-6 shrink-0", dark ? "bg-brand" : "bg-brand")}
        />
        <span
          className={cn(
            "font-sans-condensed text-base leading-none font-normal uppercase",
            dark ? "text-brand" : "text-brand",
          )}
        >
          {label}
        </span>
      </div>
      {title && (
        <div
          className={cn(
            "mt-0.5 font-sans-condensed text-display-sm leading-none font-black whitespace-pre-line uppercase",
            dark ? "text-white" : "text-brand-dark",
          )}
        >
          {rich ? <RichText content={title} /> : title}
        </div>
      )}
      {subtitle &&
        (rich ? (
          <RichText
            content={subtitle}
            className={cn(
              "mt-1 text-base font-medium",
              dark ? "text-text-subtle-dark" : "text-text-subtle",
            )}
          />
        ) : (
          <p
            className={cn(
              "mt-1 text-base font-medium whitespace-pre-line",
              dark ? "text-text-subtle-dark" : "text-text-subtle",
            )}
          >
            {decodeHtmlEntities(subtitle)}
          </p>
        ))}
    </div>
  );
}
