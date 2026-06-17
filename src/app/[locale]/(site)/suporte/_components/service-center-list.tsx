"use client";

import type { PartnerLocation } from "@/api/stetsom/model";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const PAGE_SIZE = 6;

interface ServiceCenterListProps {
  serviceCenters: PartnerLocation[];
}

export function ServiceCenterList({ serviceCenters }: ServiceCenterListProps) {
  const t = useTranslations("Support.serviceCenters");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return serviceCenters;
    return serviceCenters.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q),
    );
  }, [serviceCenters, query]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="flex flex-col gap-3 lg:w-86">
      <div className="flex h-10 items-center gap-2 border border-border bg-white px-3">
        <MapPin size={14} className="shrink-0 text-icon-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder={t("searchPlaceholder")}
          className="flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted"
        />
      </div>

      <div className="flex flex-col gap-2">
        {shown.length === 0 ? (
          <p className="border border-border bg-white px-4 py-3 text-sm text-text-subtle">
            {t("noResults")}
          </p>
        ) : (
          shown.map((posto, idx) => (
            <div
              key={posto.id ?? `posto-${idx}`}
              className="flex flex-col gap-0.5 border border-border bg-white px-4 py-3"
            >
              <p className="font-sans text-sm font-semibold text-brand-dark">
                {posto.name}
              </p>
              <p className="font-sans text-xs text-text-subtle">
                {posto.address}
              </p>
              <div className="flex items-center gap-3">
                {posto.phone && (
                  <p className="font-sans text-xs text-brand">{posto.phone}</p>
                )}
                {posto.phone2 && (
                  <p className="font-sans text-xs text-text-subtle">
                    {posto.phone2}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {visible < filtered.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="h-10 border border-border bg-white font-sans text-2xs font-bold uppercase tracking-[0.6px] text-brand-dark transition-colors hover:bg-muted"
        >
          {t("loadMore")}
        </button>
      )}
    </div>
  );
}
