"use client";

import { useGetApiBanners } from "@/api/stetsom";
import { BannersContent } from "./_components/banners-content";

export default function AdminBannersPage() {
  const { data, isLoading, dataUpdatedAt } = useGetApiBanners();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center px-4 py-4 lg:px-11.75 lg:py-7.25">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 lg:px-11.75 lg:py-7.25">
      <BannersContent key={dataUpdatedAt} initialBanners={data} />
    </div>
  );
}
