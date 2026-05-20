"use client";

import { useAdminBanners } from "@/hooks/use-admin";
import { BannersContent } from "./_components/banners-content";

export default function AdminBannersPage() {
  const bannersQuery = useAdminBanners();

  if (bannersQuery.isLoading || !bannersQuery.data) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  return (
    <BannersContent
      key={bannersQuery.dataUpdatedAt}
      initialBanners={bannersQuery.data}
    />
  );
}
