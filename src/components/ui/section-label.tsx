import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  className?: string;
}

export function SectionLabel({
  label,
  title,
  subtitle,
  dark = false,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div
          className={cn("w-6 h-px shrink-0", dark ? "bg-white" : "bg-brand")}
        />
        <span
          className={cn(
            "font-sans-condensed font-medium text-base uppercase leading-none",
            dark ? "text-white" : "text-brand",
          )}
        >
          {label}
        </span>
      </div>
      {title && (
        <div
          className={cn(
            "font-sans-condensed font-black text-[40px] uppercase leading-none mt-0.5 whitespace-pre-line",
            dark ? "text-white" : "text-brand-dark",
          )}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <p
          className={cn(
            "font-medium text-base leading-relaxed mt-1",
            dark ? "text-[rgb(184,184,184)]" : "text-[rgb(102,102,102)]",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
