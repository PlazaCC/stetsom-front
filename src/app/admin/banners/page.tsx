"use client";

import { useGetApiBanners } from "@/api/stetsom";
import { BannersContent } from "./_components/banners-content";

export default function AdminBannersPage() {
  const { data, isLoading, dataUpdatedAt } = useGetApiBanners();

  if (isLoading || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return <BannersContent key={dataUpdatedAt} initialBanners={data} />;
}
