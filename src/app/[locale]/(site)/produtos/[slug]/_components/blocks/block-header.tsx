import { cn } from "@/lib/utils";

interface BlockHeaderProps {
  title?: string;
  description?: string;
  /** BEM base class of the host block (e.g. `blockImage`). */
  classPrefix: string;
  className?: string;
}

/**
 * Optional title + description header shared by content blocks. Renders nothing
 * when both are empty.
 */
export function BlockHeader({
  title,
  description,
  classPrefix,
  className,
}: BlockHeaderProps) {
  if (!title && !description) return null;

  return (
    <header className={cn(`${classPrefix}__header`, className)}>
      {title && (
        <h3
          className={`${classPrefix}__title font-sans-condensed text-section-title font-black text-brand-dark uppercase`}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className={`${classPrefix}__description mt-2 text-sm text-text-subtle`}
        >
          {description}
        </p>
      )}
    </header>
  );
}
