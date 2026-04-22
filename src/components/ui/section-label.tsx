import { cn } from "@/lib/utils"

interface SectionLabelProps {
  label: string
  title?: string
  subtitle?: string
  dark?: boolean
  className?: string
}

export default function SectionLabel({
  label,
  title,
  subtitle,
  dark = false,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <div className="w-6 h-px bg-brand shrink-0" />
        <span className="font-sans-condensed font-medium text-base uppercase text-brand leading-none">
          {label}
        </span>
      </div>
      {title && (
        <div
          className={cn(
            "font-sans-condensed font-bold text-[40px] uppercase leading-none mt-0.5 whitespace-pre-line",
            dark ? "text-white" : "text-brand-dark"
          )}
        >
          {title}
        </div>
      )}
      {subtitle && (
        <p
          className={cn(
            "font-medium text-base leading-relaxed mt-1",
            dark ? "text-[rgb(184,184,184)]" : "text-[rgb(102,102,102)]"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
