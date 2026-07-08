"use client";

import { useGetApiBanners } from "@/api/stetsom";
import { useParams } from "next/navigation";
import { BannerFormPage } from "../_components/banner-form-page";

export default function AdminBannerEditPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useGetApiBanners();

  if (isLoading || !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  const banner = data.items.find((b) => b.id === params.id);

  if (!banner) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-4 lg:px-11.75 lg:py-7.25">
        <p className="text-sm text-muted-foreground">Banner não encontrado.</p>
      </div>
    );
  }

  return <BannerFormPage mode="edit" banner={banner} />;
}
