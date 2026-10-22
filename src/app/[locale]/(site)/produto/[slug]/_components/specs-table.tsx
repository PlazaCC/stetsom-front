"use client";

import type { PublicVariant } from "@/api/stetsom/model";
import { SpecValue } from "@/components/ui/spec-value";
import { entriesForAttribute } from "@/lib/specs/matrix";
import {
  filterSpecSections,
  hasGroupedSections,
  type SpecSection,
} from "@/lib/specs/table";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface SpecsTableProps {
  /** Variants already sorted by `order` ascending. */
  variants: PublicVariant[];
  /** Groups and their attributes across all variants, in CMS order. */
  sections: SpecSection[];
}

/** Section title row — one per attribute group, spanning the whole table. */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border bg-white px-5 pt-6 pb-2.5 lg:px-42.5">
      <h3 className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase">
        {children}
      </h3>
    </div>
  );
}

/**
 * Technical specifications table, split into attribute groups ("Potência e
 * áudio", "Alimentação"…). Each group restarts the zebra striping.
 *
 * Desktop keeps the multi-variant matrix (one column per variant). Mobile
 * paginates by variant — one variant per page, navigated with arrows — so the
 * values never get squished when a product has several variants (1 OHM,
 * 2 OHMS, 4 OHMS…).
 */
export function SpecsTable({ variants, sections }: SpecsTableProps) {
  const t = useTranslations("ProductDetail");
  const [activeVariant, setActiveVariant] = useState(0);

  const hasVariants = variants.length > 1;
  const safeVariantIndex = activeVariant < variants.length ? activeVariant : 0;
  const currentVariant = variants[safeVariantIndex];
  const showTitles = hasGroupedSections(sections);

  const sectionTitle = (section: SpecSection) =>
    section.group_name ?? (section.group_id ? null : t("otherSpecs"));

  const goPrev = () =>
    setActiveVariant(
      (index) => (index - 1 + variants.length) % variants.length,
    );
  const goNext = () =>
    setActiveVariant((index) => (index + 1) % variants.length);

  const columns = hasVariants
    ? `1fr repeat(${variants.length}, minmax(120px, 1fr))`
    : "1fr 1fr";

  // Mobile shows one variant at a time, so it lists only what that variant
  // records.
  const currentSections = currentVariant
    ? filterSpecSections(
        sections,
        (attributeId) =>
          entriesForAttribute(currentVariant.attributes, attributeId).length >
          0,
      )
    : [];

  return (
    <div className="bg-white pb-9">
      {/* Desktop — matrix with one column per variant. */}
      <div className="hidden w-full overflow-x-auto lg:block">
        <div
          className="grid items-center gap-8 bg-brand-dark px-5 py-4.5 lg:px-42.5"
          style={{
            gridTemplateColumns: `1fr repeat(${variants.length}, minmax(120px, 1fr))`,
          }}
        >
          <span className="font-sans-condensed text-lg leading-tight font-black text-white uppercase">
            {t("techSpecifications")}
          </span>
          {variants.map((v) => (
            <span
              key={v.variant_id}
              className="font-sans text-sm font-bold text-white uppercase"
            >
              {v.name}
            </span>
          ))}
        </div>
        {sections.map((section) => {
          const title = showTitles ? sectionTitle(section) : null;
          return (
            <div key={section.group_id ?? "ungrouped"}>
              {title && <SectionTitle>{title}</SectionTitle>}
              {section.rows.map(({ attribute_id, attribute_name }, i) => (
                <div
                  key={attribute_id}
                  className={cn(
                    "grid items-center gap-8 px-5 py-4.5 lg:px-42.5",
                    i % 2 === 0 ? "bg-muted" : "bg-white",
                  )}
                  style={{ gridTemplateColumns: columns }}
                >
                  <span className="font-sans text-sm font-medium text-brand-dark capitalize">
                    {attribute_name ?? attribute_id}
                  </span>
                  {variants.map((v) => (
                    <SpecValue
                      key={v.variant_id}
                      entries={entriesForAttribute(v.attributes, attribute_id)}
                      className="font-sans text-sm text-text-subtle"
                    />
                  ))}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Mobile — one variant per page, arrow navigation (TCL reference). */}
      <div className="lg:hidden">
        {currentVariant && (
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-brand-dark px-5 py-3.5">
            <h2 className="min-w-0 flex-1 font-sans-condensed text-sm leading-tight font-black break-words whitespace-normal text-white uppercase">
              {t("techSpecifications")}
            </h2>
            <div className="flex shrink-0 items-center gap-3">
              {hasVariants && (
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={t("specsPreviousVariant")}
                  className="flex shrink-0 items-center justify-center p-1 text-white transition-colors hover:text-brand active:text-brand"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              <span className="max-w-full truncate font-sans-condensed text-sm font-black text-white uppercase">
                {currentVariant.name}
              </span>

              {hasVariants && (
                <button
                  type="button"
                  onClick={goNext}
                  aria-label={t("specsNextVariant")}
                  className="flex shrink-0 items-center justify-center p-1 text-white transition-colors hover:text-brand active:text-brand"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {currentVariant && (
            <motion.div
              key={currentVariant.variant_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {currentSections.map((section) => {
                const title = showTitles ? sectionTitle(section) : null;
                return (
                  <div key={section.group_id ?? "ungrouped"}>
                    {title && <SectionTitle>{title}</SectionTitle>}
                    {section.rows.map(({ attribute_id, attribute_name }, i) => (
                      <div
                        key={attribute_id}
                        className={cn(
                          "grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] items-start gap-6 px-5 py-4.5",
                          i % 2 === 0 ? "bg-muted" : "bg-white",
                        )}
                      >
                        <span className="font-sans text-sm font-medium text-brand-dark capitalize">
                          {attribute_name ?? attribute_id}
                        </span>
                        <SpecValue
                          entries={entriesForAttribute(
                            currentVariant.attributes,
                            attribute_id,
                          )}
                          className="font-sans text-sm text-text-subtle"
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
