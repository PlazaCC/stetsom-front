"use client";

import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { WARRANTY_SYSTEM_URL } from "@/lib/warranty";
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
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.6 }}
      className="pointer-events-none fixed right-4 bottom-6 z-50 sm:right-5 lg:right-6 lg:bottom-8"
    >
      <a
        href={WARRANTY_SYSTEM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group/warranty pointer-events-auto flex items-center gap-3",
          "rounded-full border border-white/30 bg-brand px-6 py-4",
          "shadow-[0_8px_32px_rgba(232,19,42,0.45)]",
          "transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-[0_14px_40px_rgba(232,19,42,0.55)]",
          "active:translate-y-0 active:scale-[0.97]",
          "lg:gap-3.5 lg:px-7 lg:py-4",
        )}
        aria-label={t("warranty")}
      >
        <ShieldCheck className="size-6 shrink-0 text-white transition-transform duration-300 group-hover/warranty:scale-110 lg:size-7" />
        <span className="text-base leading-none font-semibold whitespace-nowrap text-white uppercase lg:text-lg">
          {t("warranty")}
        </span>
      </a>
    </motion.div>
  );
}
