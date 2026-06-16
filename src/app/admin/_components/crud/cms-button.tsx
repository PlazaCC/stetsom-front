import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * CMS action button — Mantine-inspired, token-only (resolves to the blue accent
 * inside `.cms`). Use INSTEAD of the public `@/components/ui/button` within the
 * admin: that one is the Stetsom-red, uppercase, Barlow site button.
 *
 * Variants mirror Mantine: filled · light · outline · subtle · default · danger.
 * `cmsButtonVariants(...)` is exported so the same look can be applied to a
 * `<Link>` (e.g. `className={cmsButtonVariants({ variant: "filled" })}`).
 */
export const cmsButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        filled: "bg-primary text-primary-foreground hover:bg-cms-primary-hover",
        light:
          "bg-cms-primary-subtle text-cms-primary hover:bg-cms-primary-subtle/70",
        outline:
          "border border-cms-primary text-cms-primary hover:bg-cms-primary-subtle",
        subtle: "text-cms-primary hover:bg-cms-primary-subtle",
        default: "border border-border bg-card text-foreground hover:bg-muted",
        danger: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-5 text-sm",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "sm",
    },
  },
);

export interface CmsButtonProps
  extends
    React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof cmsButtonVariants> {}

export function CmsButton({
  className,
  variant,
  size,
  type = "button",
  ...props
}: CmsButtonProps) {
  return (
    <button
      type={type}
      className={cn(cmsButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
