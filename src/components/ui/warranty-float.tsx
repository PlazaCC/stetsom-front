"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

export function WarrantyFloat() {
  const pathname = usePathname();
  const t = useTranslations("Footer");

  // Hide on /suporte and /produtos/[slug]
  if (pathname === "/suporte" || /^\/produtos\/[^/]+$/.test(pathname)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
      className="pointer-events-none fixed right-0 bottom-8 z-50 lg:right-6"
    >
      <Link
        href="/suporte"
        className={cn(
          "group/warranty pointer-events-auto flex items-center gap-2.5",
          "rounded-l-lg border border-white/10 bg-brand-dark/95 px-4 py-3",
          "shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xs",
          "transition-all duration-300 hover:bg-brand hover:pr-6",
          "lg:rounded-lg lg:px-5 lg:py-3.5",
        )}
        aria-label={t("warranty")}
      >
        <ShieldCheck className="size-5 shrink-0 text-brand transition-colors duration-300 group-hover/warranty:text-white" />
        <span className="text-sm leading-none font-semibold whitespace-nowrap text-white uppercase lg:text-sm">
          {t("warranty")}
        </span>
      </Link>
    </motion.div>
  );
}
