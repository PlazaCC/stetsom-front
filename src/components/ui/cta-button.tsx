import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: "brand" | "brand-dark";
  size?: "sm" | "md";
  external?: boolean;
  className?: string;
}

export function CTAButton({
  href,
  label,
  variant = "brand",
  size = "md",
  external = false,
  className,
}: Readonly<CTAButtonProps>) {
  const classes = cn(
    buttonVariants({ variant, size }),
    "inline-flex items-center gap-2",
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {label}
        <ExternalLink size={18} />
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {label}
      <ArrowRight className="size-4" strokeWidth={2.5} />
    </Link>
  );
}
